import { Q } from '@nozbe/watermelondb';
import { decode } from 'html-entities';
import { synchronize } from '@nozbe/watermelondb/sync';
import { getEventTypes, getEvents } from '../api/VSPJEvents';
import { getMoodleEvents } from './synchronization/moodle';
import store from '../store/store';
import {
  refreshIfNeeded,
  selectAuthorized,
  selectMoodleAuthorized,
} from '../store/authSlice';
import moment from 'moment-timezone';
import { fetchLoggedInUser, selectUserLoaded } from '../store/userSlice';
import {
  showNewEventNotification,
  showNotification,
} from '../helpers/notifications';

export async function sync(database) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      let lastPulledAtMoment = null;
      let fromMoment = null;
      if (lastPulledAt) {
        lastPulledAtMoment = moment.unix(lastPulledAt);
      } else {
        fromMoment = moment().subtract(1, 'years');
      }

      let timestamp;

      try {
        await store.dispatch(refreshIfNeeded());

        if (
          !selectAuthorized(store.getState()) ||
          !selectMoodleAuthorized(store.getState())
        ) {
          throw new Error('User is not authorized!');
        }

        if (!selectUserLoaded(store.getState())) {
          store.dispatch(fetchLoggedInUser());
        }

        const eventTypes = await getEventTypes();

        const eventTypesMap = await syncEventsTypes(database, eventTypes); // full reload
        const eventsResponse = await getEvents(
          fromMoment ? fromMoment.toDate() : null,
          null,
          lastPulledAtMoment ? lastPulledAtMoment.toDate() : null
        );

        timestamp = eventsResponse.timestamp;
        const events = eventsResponse.events;

        const moodleEvents = await getMoodleEvents();
        await syncEvents(
          database,
          eventTypesMap,
          events.concat(moodleEvents),
          !lastPulledAt
        );
      } catch (err) {
        if (err.response) {
          console.log('ERROR status:', err.response.status);
          console.log('error.response.data:', err.response.data);
          if (err.response.status === 401) {
            console.log('401 Unauthorized');
            throw new Error('401 Unauthorized');
          }
        }
        throw err;
      }
      const changes = {};
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      // const response = await fetch(`https://my.backend/sync?last_pulled_at=${lastPulledAt}`, {
      //   method: 'POST',
      //   body: JSON.stringify(changes)
      // })
      // if (!response.ok) {
      //   throw new Error(await response.text())
      // }
    },
    migrationsEnabledAtVersion: 1,
  });
}

async function syncEventsTypes(database, eventTypes) {
  return await database.write(async (writer) => {
    const eventTypesMap = new Map();
    for (const eventType of eventTypes) {
      const eventTypesC = await database
        .get('event_types')
        .query(Q.where('server_id', eventType.id.toString()))
        .fetch();
      if (eventTypesC.length === 0) {
        // TODO: Full reload
        eventTypesMap.set(
          eventType.id.toString(),
          await database.get('event_types').create((et) => {
            et.serverId = eventType.id.toString();
            et.description = eventType.description;
            et.isFavorite = true;
          })
        );
        console.log(`create event type ${eventType.id}`);
      } else if (eventTypesC.length >= 1) {
        if (eventTypesC[0].description !== eventType.description) {
          await eventTypesC[0].update((et) => {
            et.description = eventType.description;
          });
          console.log(`update event type ${eventType.id}`);
        }
        eventTypesMap.set(eventType.id.toString(), eventTypesC[0]);
        for (const eventType of eventTypesC.slice(1)) {
          await eventType.destroyPermanently();
        }
      }
    }
    return eventTypesMap;
  });
}

async function syncEvents(database, eventTypes, events, firstSync) {
  return await database.write(async (writer) => {
    const batchWriters = [];

    for (const event of events) {
      const savedEvents = await database
        .get('events')
        .query(Q.where('server_id', event.id.toString()))
        .fetch();
      if (savedEvents.length === 0) {
        const eventType = eventTypes.get(event.eventTypeId.toString());

        batchWriters.push(
          await writer.callWriter(() =>
            eventType.prepareAddEvent(
              event.id.toString(),
              decode(event.title),
              decode(event.description),
              new Date(event.startDateTime),
              new Date(event.endDateTime),
              event.recurrent,
              event.url,
              event.moodleTimemodifiedAt
            )
          )
        );

        if (!firstSync && eventType.isFavorite) {
          showNewEventNotification(event);
          // showNotification(`Nová událost: ${event.title}`, event.description);
        }

        // console.log(event.startAt, event.endAt);
        console.log(`create event ${event.id}`);
      } else if (savedEvents.length >= 1) {
        // console.log('event.startDateTime', event.id, event.startDateTime);
        // if (
        //   event.eventTypeId !== 5 ||
        //   event.moodleTimemodifiedAt.getTime() !== savedEvents[0].getTime()
        // ) {
        batchWriters.push(
          savedEvents[0].prepareUpdate((e) => {
            e.title = decode(event.title);
            e.description = decode(event.description);
            e.startAt = new Date(event.startDateTime);
            e.endAt = new Date(event.endDateTime);
            e.recurrent = event.recurrent;
            if (event.url) {
              e.url = event.url;
            }
            if (event.moodleTimemodifiedAt)
              e.moodleTimemodifiedAt = event.moodleTimemodifiedAt;
          })
        );
        console.log('mmbatchWriters', event);
        // }
        // console.log(event.startAt, event.endAt);
        for (const savedEvent of savedEvents.slice(1)) {
          await savedEvent.destroyPermanently();
        }
        console.log(`update event ${event.id}`);
      }
    }
    console.log(batchWriters.length);
    // console.log(batchWriters);
    await writer.batch(...batchWriters);
  });
}

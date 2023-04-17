import { Q } from '@nozbe/watermelondb';
import { decodeEntity } from 'html-entities';
import { synchronize } from '@nozbe/watermelondb/sync';
import { getEventTypes, getEvents } from '../api/VSPJEvents';
import { getMoodleEvents } from './synchronization/moodle';
import moment from 'moment-timezone';

export async function sync(database) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      //   const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
      //     JSON.stringify(migration)
      //   )}`;
      //   const response = await fetch(`https://my.backend/sync?${urlParams}`);
      //   if (!response.ok) {
      //     throw new Error(await response.text());
      //   }

      //   const { changes, timestamp } = await response.json();

      let lastPulledAtMoment = null;
      if (lastPulledAt) {
        lastPulledAtMoment = moment.unix(lastPulledAt);
      } else {
        lastPulledAtMoment = moment().subtract(1, 'years'); // new Date(2022, 0, 17).getTime() / 1000;
        lastPulledAt = lastPulledAtMoment.unix();
      }

      const newLastPulledAtMoment = moment();

      try {
        const eventTypes = await getEventTypes();
        // console.log(eventTypes);
        const eventTypesMap = await syncEventsTypes(database, eventTypes);
        const events = await getEvents(lastPulledAtMoment.toDate()); // new Date(2022, 0, 17)
        const moodleEvents = await getMoodleEvents();
        await syncEvents(database, eventTypesMap, events.concat(moodleEvents));
      } catch (err) {
        if (err.response) {
          console.log('ERROR status:', err.response.status);
          console.log('error.response.data:', error.response.data);
          if (err.response.status === 401) {
            console.log('401 Unauthorized');
            throw new Error('401 Unauthorized');
          }
        }
        throw err;
      }
      const changes = {};
      return { changes, timestamp: newLastPulledAtMoment.unix() };
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
        eventTypesMap.set(
          eventType.id.toString(),
          await eventTypesC[0].update((et) => {
            et.description = eventType.description;
          })
        );
        for (const eventType of eventTypesC.slice(1)) {
          await eventType.destroyPermanently();
        }
        console.log(`update event type ${eventType.id}`);
      }
    }
    return eventTypesMap;
  });
}

async function syncEvents(database, eventTypes, events) {
  return await database.write(async (writer) => {
    const batchWriters = [];

    for (const event of events) {
      const savedEvents = await database
        .get('events')
        .query(Q.where('server_id', event.id.toString()))
        .fetch();
      if (savedEvents.length === 0) {
        batchWriters.push(
          await writer.callWriter(() =>
            eventTypes
              .get(event.eventTypeId.toString())
              .prepareAddEvent(
                event.id.toString(),
                decodeEntity(event.title),
                decodeEntity(event.description),
                new Date(event.startDateTime),
                new Date(event.endDateTime),
                event.recurrent
              )
          )
        );
        // console.log(event.startAt, event.endAt);
        console.log(`create event ${event.id}`);
      } else if (savedEvents.length >= 1) {
        console.log('event.startDateTime', event.id, event.startDateTime);
        batchWriters.push(
          savedEvents[0].prepareUpdate((e) => {
            e.title = decodeEntity(event.title);
            e.description = decodeEntity(event.description);
            e.startAt = new Date(event.startDateTime);
            e.endAt = new Date(event.endDateTime);
            e.recurrent = event.recurrent;
          })
        );
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

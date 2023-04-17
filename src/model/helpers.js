import { Q } from '@nozbe/watermelondb';
import moment from 'moment';

export const getEventTypes = (database) => database.get('event_types').query();

export const getFavoriteEventTypes = (database) =>
  database.get('event_types').query(Q.where('is_favorite', true));

export const setIsFavorite = async (database, eventType, favorite) => {
  await database.write(async () => {
    await eventType.update(() => {
      eventType.isFavorite = favorite;
    });
  });
};

/**
 *
 * @param {*} database
 * @param {*} eventTypeId
 * @param {Date} olderThan
 * @returns
 */
export const getEvents = (database, eventTypeId, olderThan) => {
  return database
    .get('events')
    .query(
      Q.unsafeSqlQuery(
        'SELECT * ' +
          ' FROM events ' +
          ' WHERE (events.start_at >= ?' +
          ' OR events.end_at >= ?' +
          ') AND event_type_id = ?' +
          ' ORDER BY events.start_at',
        [olderThan.getTime(), olderThan.getTime(), eventTypeId]
      )
    );
};

/**
 *
 * @param {*} database
 * @param {Date} date
 * @returns
 */
export const getEventsPerMonth = (database, date) => {
  const d = moment(date);
  const ym = d.format('YYYY-MM');
  return database
    .get('events')
    .query(
      Q.unsafeSqlQuery(
        'SELECT events.*' +
          ' FROM events' +
          ' INNER JOIN event_types on events.event_type_id = event_types.id' +
          " WHERE (strftime('%Y-%m', DATE(events.start_at/1000, 'unixepoch')) = ? OR strftime('%Y-%m', DATE(events.end_at/1000, 'unixepoch')) = ? ) AND event_types.is_favorite = 1",
        [ym, ym]
      )
    );
};

/**
 *
 * @param {*} database
 * @param {Date} olderThan
 * @returns
 */
export const getAllEvents = (database, olderThan) => {
  return database
    .get('events')
    .query(
      Q.unsafeSqlQuery(
        'SELECT events.* ' +
          ' FROM events ' +
          ' INNER JOIN event_types on events.event_type_id = event_types.id' +
          ' WHERE (events.start_at >= ?' +
          ' OR events.end_at >= ?' +
          ') AND event_types.is_favorite = 1' +
          ' ORDER BY events.start_at',
        [olderThan.getTime(), olderThan.getTime()]
      )
    );
};

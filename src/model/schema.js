import { appSchema, tableSchema } from '@nozbe/watermelondb';
import EventType from './EventType';
import Event from './Event';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'event_types',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'description', type: 'string' },
        { name: 'is_favorite', type: 'boolean', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'events',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'start_at', type: 'number' },
        { name: 'end_at', type: 'number' },
        { name: 'recurrent', type: 'boolean' },
        { name: 'event_type_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});

export const modelClasses = [EventType, Event];

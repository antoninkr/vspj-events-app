import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';

export default class Event extends Model {
  static table = 'events';
  static associations = {
    event_types: { type: 'belongs_to', key: 'event_type_id' },
  };

  @text('server_id') serverId;
  @text('title') title;
  @text('description') description;
  @date('start_at') startAt;
  @date('end_at') endAt;
  @text('recurrent') recurrent;

  @relation('event_types', 'event_type_id') eventType;
}

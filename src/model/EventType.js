import { Model } from '@nozbe/watermelondb';
import { field, text, children, writer } from '@nozbe/watermelondb/decorators';

export default class EventType extends Model {
  static table = 'event_types';

  static associations = {
    events: { type: 'has_many', foreignKey: 'event_type_id' },
  };

  @text('server_id') serverId;
  @text('description') description;
  @field('order') order;
  @field('is_favorite') isFavorite;

  @children('events') events;

  @writer async prepareAddEvent(
    serverId,
    title,
    description,
    startAt,
    endAt,
    recurrent,
    url,
    moodleTimemodifiedAt
  ) {
    const newEvent = await this.collections
      .get('events')
      .prepareCreate((event) => {
        event.eventType.set(this);
        event.serverId = serverId;
        event.title = title;
        event.description = description;
        event.startAt = startAt;
        event.endAt = endAt;
        event.recurrent = recurrent;
        if (url) {
          event.url = url;
        }
        if (moodleTimemodifiedAt) {
          event.moodleTimemodifiedAt = moodleTimemodifiedAt;
        }
      });
    return newEvent;
  }
}

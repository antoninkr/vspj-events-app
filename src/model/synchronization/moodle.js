import { getEvents } from '../../api/Moodle';
import moment from 'moment-timezone';

const parseMoodleEvent = (moodleEvent) => {
  const id = `5-${moodleEvent.id}`;
  const eventTypeId = 5;
  const title = `${moodleEvent.course.shortname} - ${moodleEvent.name}`;
  const description = moodleEvent.description;
  const startAt = parseInt(moodleEvent.timestart);
  const endAt =
    parseInt(moodleEvent.timestart) + parseInt(moodleEvent.timeduration);
  const recurrent = false;
  const url = moodleEvent.url;
  const moodleTimemodifiedAt = new Date(moodleEvent.timemodified * 1000);

  if (!id || !moodleEvent.name || !startAt) {
    throw new Error(`Invalid format of the Moodle event id: ${serverId}`);
  }

  const startAtDate = new Date(startAt * 1000);
  const endAtDate = new Date(endAt * 1000);

  return {
    id,
    eventTypeId,
    title,
    description,
    startDateTime: startAtDate.toISOString(),
    endDateTime: endAtDate.toISOString(),
    recurrent,
    url,
    moodleTimemodifiedAt,
  };
};

export const getMoodleEvents = async () => {
  const response = await getEvents();
  const events = [];
  if (response.events) {
    for (const e of response.events) {
      if (e.eventtype !== 'attendance' && e.visible) {
        try {
          const event = parseMoodleEvent(e);
          events.push(event);
        } catch (error) {
          console.warn(error.message);
        }
      }
    }
  }
  return events;
};

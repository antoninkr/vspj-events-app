import * as Notifications from 'expo-notifications';
import moment from 'moment-timezone';

export const showNotification = (title, body) => {
  const content = {
    title,
    body,
  };

  const trigger = null;

  try {
    Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    // console.log('scheduleNotificationAsync');
  } catch (e) {
    console.error(e.getMessage());
  }
};

export const showNewEventNotification = (event) => {
  const { startAt, endAt } = event;
  const startAtMoment = moment(startAt);
  const endAtMoment = moment(endAt);

  const dates =
    startAtMoment.format('D.M.YYYY H:mm') +
    (endAtMoment.unix() ? ' - ' + endAtMoment.format('D.M.YYYY H:mm') : '');

  showNotification(
    `Nová událost: ${event.title}`,
    `(${dates}) ${event.description}`
  );
};

import * as Notifications from 'expo-notifications';

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

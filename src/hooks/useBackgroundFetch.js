import { useState, useEffect } from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { connectToDatabase } from './useWatermelonDB';
import store from '../store/store';
import { sync } from '../model/synchronization';

const BACKGROUND_FETCH_TASK = 'background-fetch';

let database = null;

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log(store.getState().user);

  const now = Date.now();
  if (!database) {
    database = connectToDatabase();
  }

  sync(database)
    .then(() => {
      console.log('BACKGROUND_FETCH_TASK sync OK');
    })
    .catch(() => {
      console.log(err);
      console.error(
        `BACKGROUND_FETCH_TASK An error occurred while attempting to synchronize WatermelonDB.`
      );
    });

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );
  //   console.log(database);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const useBackgroundFetch = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);

  database = useDatabase();
  //   console.log('Database from useBackgroundFetch:');

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync(database);
    }

    checkStatusAsync();
  };

  return [status, isRegistered, toggleFetchTask];
};

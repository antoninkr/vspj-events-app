import { useEffect, useState } from 'react';

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from '../model/schema';
import migrations from '../model/migrations';
import { modelClasses } from '../model/schema';

export function connectToDatabase() {
  const adapter = new SQLiteAdapter({
    schema,
    migrations,
    dbName: 'eventssqlite',
    jsi: true /* Platform.OS === 'ios' */,
    onSetUpError: (error) => {},
  });

  const database = new Database({
    adapter,
    modelClasses,
  });

  return database;
}

export const useWatermelonDB = () => {
  const [database, setDatabase] = useState(null);

  const connectToDB = () => {
    setDatabase(connectToDatabase());
  };

  const reconnectToDatabase = connectToDB;

  useEffect(() => {
    connectToDB();
  }, []);

  return [database, reconnectToDatabase];
};

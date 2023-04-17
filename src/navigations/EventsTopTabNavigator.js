import React, { useEffect, useState } from 'react';
import EventsScreen from '../screens/EventsScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useWindowDimensions, View } from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { getFavoriteEventTypes } from '../model/helpers';
import { calculateTabWidth } from '../helpers/reactNavigation';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import R from 'ramda';
import { useDispatch } from 'react-redux';
import { sync } from '../model/synchronization';
import EventsLoading from '../components/Loading';
import AllEventsScreen from '../screens/AllEventsScreen.js';

import { Text } from '@rneui/base';

const Tab = createMaterialTopTabNavigator();

const EventsTopTabNavigator = ({ eventTypes }) => {
  const { width } = useWindowDimensions();
  const database = useDatabase();

  const [synchronizationEnded, setSynchronizationEnded] = useState(false);

  useEffect(() => {
    const synchronize = async () => {
      try {
        await sync(database);
      } catch (err) {
        console.log(err);
        console.error(
          `An error occurred while attempting to synchronize WatermelonDB.`
        );
      }
      setTimeout(() => {
        setSynchronizationEnded(true);
      }, 2000);
    };
    synchronize();
  }, []);

  return eventTypes.length ? (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: calculateTabWidth(width) },
        tabBarStyle: { backgroundColor: 'powderblue' },
        tabBarLabelStyle: { textTransform: 'lowercase' },
      }}
    >
      <Tab.Screen
        key="all_events"
        name="AllEventsScreen"
        options={{ title: 'Vše' }}
        children={() => <AllEventsScreen />}
      />

      {eventTypes.map((eventType) => (
        <Tab.Screen
          key={eventType.serverId}
          name={'EventsScreen1' + eventType.serverId}
          options={{ title: eventType.description }}
          children={() => <EventsScreen eventType={eventType} />}
        />
      ))}
    </Tab.Navigator>
  ) : (
    <EventsLoading
      text="Načítání událostí..."
      loadingFailed={synchronizationEnded}
      errorMessage="Někde nastala chyba při načítání událostí. Zkuste to prosím později."
    />
  );
};

const enhance = R.compose(
  withDatabase,
  withObservables([], ({ database }) => ({
    eventTypes: getFavoriteEventTypes(database), // Shortcut syntax for `post.comments.observe()`
  }))
);

const EnhancedEventsTopTabNavigator = enhance(EventsTopTabNavigator);

export default EnhancedEventsTopTabNavigator;

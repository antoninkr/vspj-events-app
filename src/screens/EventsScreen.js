import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MicrosoftButton from '../components/buttons/MicrosoftButton';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import R from 'ramda';
import Event from '../components/EventBrief';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import EventBrief from '../components/EventBrief';
import { getEvents } from '../model/helpers';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Dialog } from '@rneui/themed';
import { Q } from '@nozbe/watermelondb';
import BlackButton from '../components/buttons/BlackButton';
import moment from 'moment';
import EventDetailDialog from '../components/EventDetailDialog';

const EventsScreen = ({ eventType, events }) => {
  const navigation = useNavigation();

  const [eventDialogVisible, setEventDialogVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const closeDialog = () => {
    setEventDialogVisible(false);
  };

  const showEventDetail = (event) => {
    setSelectedEvent(event);
    setEventDialogVisible(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <EventBrief
              event={item}
              onPress={() => {
                showEventDetail(item);
              }}
            />
          )}
          keyExtractor={(event) => event.serverId}
        />
      </SafeAreaView>

      <EventDetailDialog
        event={selectedEvent}
        visible={eventDialogVisible}
        closeDialog={closeDialog}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    fontSize: 30,
  },
});

const enhance = R.compose(
  withDatabase,
  withObservables(['eventType'], ({ eventType, database }) => {
    const fromDate = new Date();

    return {
      eventType,
      events: getEvents(database, eventType._raw.id, fromDate),
    };
  })
);

const EnhancedEventsScreen = enhance(EventsScreen);
export default EnhancedEventsScreen;

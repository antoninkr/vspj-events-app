import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda, Calendar, LocaleConfig } from 'react-native-calendars';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import R from 'ramda';
import { Q } from '@nozbe/watermelondb';
import moment from 'moment';
import { getEventsPerMonth } from '../model/helpers';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { getDatesOfMonth } from '../helpers/date';
import testIDs from '../calendars/testIDs';
import EventAgendaItem from '../components/EventAgendaItem';
import EventDetailDialog from '../components/EventDetailDialog';

const CalendarScreen = ({ events }) => {
  const [items, setItems] = useState(undefined);
  const database = useDatabase();

  const [eventDialogVisible, setEventDialogVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const closeDialog = () => {
    setEventDialogVisible(false);
  };

  /**
   *
   * @param {DateData} day
   */
  const loadItems = async (day) => {
    const items = {};

    const mDay = new moment(day.timestamp);

    const events = await getEventsPerMonth(database, mDay).fetch();

    for (const event of events) {
      const startAtMoment = moment(event.startAt);
      const endAtMoment = moment(event.endAt);
      const sameDate =
        startAtMoment.format('YYYY-MM-DD') === endAtMoment.format('YYYY-MM-DD');

      const strTime = timeToString(event.startAt);
      const strEndTime = timeToString(event.endAt);

      if (!items[strTime]) {
        items[strTime] = [];
      }
      items[strTime].push({
        event,
        day: strTime,
      });

      if (!sameDate) {
        if (!items[strEndTime]) {
          items[strEndTime] = [];
        }
        items[strEndTime].push({
          event,
          day: strEndTime,
        });
      }
    }

    setItems((prevItems) => {
      const newItems = Object.assign(Object.assign({}, prevItems), items);
      for (const date of getDatesOfMonth(mDay.toDate())) {
        if (!newItems[timeToString(date)]) {
          newItems[timeToString(date)] = [];
        }
      }
      return newItems;
    });
  };

  /**
   *
   * @param {AgendaEntry} event
   * @param {boolean} isFirst
   * @returns
   */
  const renderItem = ({ event, day }, isFirst) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';
    console.log(day);
    return (
      <EventAgendaItem
        event={event}
        onPress={() => {
          setSelectedEvent(event);
          setEventDialogVisible(true);
        }}
        testID={testIDs.agenda.CONTAINER}
        renderedDate={day}
      />
    );
  };

  return (
    <>
      <Agenda
        testID={testIDs.agenda.CONTAINER}
        items={items}
        loadItemsForMonth={loadItems}
        selected={moment().format('YYYY-MM-DD')}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        showClosingKnob={true}
        hideExtraDays={true}
        // reservationsKeyExtractor={this.reservationsKeyExtractor}
      />
      <EventDetailDialog
        event={selectedEvent}
        visible={eventDialogVisible}
        closeDialog={closeDialog}
      />
    </>
  );
};

const renderEmptyDate = () => {
  return <View style={styles.emptyDate}></View>;
};

/**
 *
 * @param {AgendaEntry} r1
 * @param {AgendaEntry} r2
 * @returns
 */
const rowHasChanged = (r1, r2) => {
  return r1.name !== r2.name;
};

/**
 *
 * @param {number} time
 * @returns
 */
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const styles = StyleSheet.create({
  emptyDate: {
    height: 15,
    flex: 1,
    /*
    paddingTop: 30,
    borderTopColor: '#d9d9d9',
    borderTopWidth: 2,
    */
  },
});

const enhance = R.compose(
  withDatabase,
  withObservables([], ({ database }) => ({
    events: database
      .get('events')
      .query(Q.on('event_types', 'is_favorite', true)),
  }))
);

const EnhancedCalendarScreen = enhance(CalendarScreen);

export default EnhancedCalendarScreen;

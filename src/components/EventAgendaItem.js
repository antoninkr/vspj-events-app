import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';

const EventAgendaItem = ({ event, testID, onPress, renderedDate }) => {
  const startAtMoment = moment(event.startAt);
  const endAtMoment = moment(event.endAt);
  const sameDate =
    startAtMoment.format('YYYY-MM-DD') === endAtMoment.format('YYYY-MM-DD');
  const sameTime = startAtMoment.format('H:mm') === endAtMoment.format('H:mm');
  const start = startAtMoment.format('YYYY-MM-DD') === renderedDate;

  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.item /*, { height: 80 }*/]}
      onPress={onPress}
    >
      {sameDate ? (
        <Text>
          {moment(event.startAt).format('H:mm')}
          {sameTime ? null : <> - {moment(event.endAt).format('H:mm')}</>}
        </Text>
      ) : (
        <Text>
          {moment(event.startAt).format('D.M.YYYY H:mm')}
          {moment(event.endAt).unix()
            ? ' - ' + moment(event.endAt).format('D.M.YYYY H:mm')
            : null}
        </Text>
      )}

      <Text style={styles.title}>
        {!sameDate ? (start ? 'ZAČÁTEK: ' : 'KONEC: ') : null}
        {event.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 15,
    marginRight: 10,
    marginTop: 17,
  },
  title: { fontSize: 16, color: 'black', textAlign: 'justify' },
});

export default EventAgendaItem;

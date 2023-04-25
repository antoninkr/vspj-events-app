import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment-timezone';
import Moment from 'react-moment';

const EventBrief = ({ event, onPress }) => {
  const { startAt, endAt } = event;
  const startAtMoment = moment(startAt);
  const endAtMoment = moment(endAt);
  const fromDate = new Date(); // 2022, 0, 14, 12, 33
  // const fromDate = new Date();
  //let fromNow = startAtMoment.from(fromDate);
  let fromNow = startAtMoment;
  let start = true;

  if (startAt.getTime() <= fromDate.getTime()) {
    start = false;
    // fromNow = `${startAtMoment.format('MM.DD.YY')} - ${endAtMoment.format(
    //   'MM.DD.YY'
    // )}`;
    if (endAtMoment.unix()) {
      // fromNow = endAtMoment.from(fromDate);
      fromNow = endAtMoment;
    }
    /*
    else {
      fromNow = startAtMoment.format('MM.DD.YYYY');
    }
    */
  }

  const fromNowJSX = <Moment date={fromNow} element={Text} fromNow />; //fromNow

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{event.title.replace(/&quot;/g, '"')}</Text>
        <Text style={styles.time}>{start ? fromNowJSX : 'Probíhá'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderColor: 'black',
    // borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    margin: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    flex: 70,
    fontSize: 16,
    // textAlign: 'justify',
  },
  time: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EventBrief;

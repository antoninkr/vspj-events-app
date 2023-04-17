import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Dialog } from '@rneui/themed';
import BlackButton from '../components/buttons/BlackButton';
import moment from 'moment';

const EventDetailDialog = ({ event, visible, closeDialog }) => {
  const [eventType, setEventType] = useState(null);

  const loadEventType = async (event) => {
    const eventType = await event.eventType.fetch();
    setEventType(eventType);
  };

  useEffect(() => {
    setEventType(null);
    if (event) {
      loadEventType(event);
    }
  }, [event]);

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={closeDialog}
      style={{
        maxHeight: '70%',
        minHeight: '40%',
      }}
    >
      <Dialog.Title title="Detail události" />
      <View style={styles.container}>
        {event ? (
          <ScrollView
            style={{
              maxHeight: '80%',
            }}
          >
            <Text style={styles.lable}>Název:</Text>
            <Text style={styles.value}>{event.title}</Text>
            {eventType ? (
              <>
                <Text style={styles.lable}>Typ:</Text>
                <Text style={styles.value}>{eventType.description}</Text>
              </>
            ) : null}
            <Text style={styles.lable}>Začátek:</Text>
            <Text style={styles.value}>
              {moment(event.startAt).format('D.M.YYYY H:mm')}
            </Text>
            {moment(event.endAt).unix() ? (
              <>
                <Text style={styles.lable}>Konec:</Text>
                <Text style={styles.value}>
                  {moment(event.endAt).format('D.M.YYYY H:mm')}
                </Text>
              </>
            ) : null}

            {event.title != event.description && event.description ? (
              <>
                <Text style={styles.lable}>Popis:</Text>
                <Text style={styles.value}>{event.description}</Text>
              </>
            ) : null}
          </ScrollView>
        ) : null}
        <View style={styles.btnContainer}>
          <BlackButton title="Zavřít" onPress={closeDialog} />
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  lable: { fontWeight: 'bold', fontSize: 15, margin: 4 },
  value: { fontSize: 16, marginLeft: 8 /* textAlign: 'justify'*/ },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  btnContainer: {
    alignSelf: 'center',
  },
});

export default EventDetailDialog;

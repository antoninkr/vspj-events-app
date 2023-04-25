import React from 'react';
import withObservables from '@nozbe/with-observables';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox, Text } from '@rneui/themed';
import { setIsFavorite } from '../model/helpers';
import { useDatabase } from '@nozbe/watermelondb/hooks';

const EventTypeSettingRow = ({ eventType }) => {
  const database = useDatabase();

  const onPress = async () => {
    await setIsFavorite(database, eventType, !eventType.isFavorite);
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <CheckBox checked={eventType.isFavorite} onPress={onPress} />
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={styles.labelContainer}
      >
        <Text style={styles.label}>{eventType.description}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  labelContainer: {
    justifyContent: 'center',
  },
});

const enhance = withObservables(['eventType'], ({ eventType }) => ({
  eventType,
}));

const EnhancedEventTypeSettingRow = enhance(EventTypeSettingRow);

// TODO
export default EnhancedEventTypeSettingRow;

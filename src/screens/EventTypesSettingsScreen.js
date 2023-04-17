import React from 'react';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import R from 'ramda';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { getEventTypes } from '../model/helpers';
import EventTypeSettingRow from '../model/EventTypeSettingRow';
import BlackButton from '../components/buttons/BlackButton';
import { useNavigation } from '@react-navigation/native';

const EventTypesSettingsScreen = ({ eventTypes }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Text h3>Vyberte typy událostí, které Vás zajímají:</Text>
      <View style={styles.flatListContainer}>
        <FlatList
          data={eventTypes}
          renderItem={({ item }) => <EventTypeSettingRow eventType={item} />}
          keyExtractor={(item) => item.serverId}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <BlackButton
          title={'Pokračovat'}
          onPress={() => navigation.navigate('BottomTabsNavigator')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { margin: 10 },
  flatListContainer: {
    margin: 10,
    marginTop: 30,
    marginLeft: '10%',
  },
});

const enhance = R.compose(
  withDatabase,
  withObservables([], ({ database }) => ({
    eventTypes: getEventTypes(database),
  }))
);

const EnhancedEventTypesSettingsScreen = enhance(EventTypesSettingsScreen);

export default EnhancedEventTypesSettingsScreen;

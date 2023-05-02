import 'react-native-gesture-handler';
import React from 'react';
import { registerRootComponent } from 'expo';
import moment from 'moment-timezone';
import 'moment/locale/cs';
import { LocaleConfig } from 'react-native-calendars';
import App from './App';
import * as Notifications from 'expo-notifications';
import { showNotification } from './src/helpers/notifications';

moment.locale('cs');

// prettier-ignore
LocaleConfig.locales['cs'] = {
    monthNames: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',],
    monthNamesShort: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis','Pro',],
    dayNames: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle', ],
    dayNamesShort: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    today: 'Dnes',
};

LocaleConfig.defaultLocale = 'cs';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

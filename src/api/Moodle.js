import axios from 'axios';
import store from './../store/store';
import * as AxiosLogger from 'axios-logger';
import Constants from 'expo-constants';
import { newAbortSignal } from '../helpers/axios';
import { selectUserToken } from '../store/moodleAuthSlice';

const axiosInstance = axios.create({
  baseURL: Constants.expoConfig.extra.moodleUrl,
});

axiosInstance.interceptors.request.use((config) => {
  config.signal = newAbortSignal(180000);
  return config;
});

axiosInstance.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
);

axiosInstance.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
);

export const getUserToken = async (username, password) => {
  const response = await axiosInstance.get('/login/token.php', {
    params: {
      username,
      password,
      service: 'moodle_mobile_app',
    },
  });
  return response.data;
};

export const getEvents = async () => {
  const userToken = selectUserToken(store.getState());
  const response = await axiosInstance.get('/webservice/rest/server.php', {
    params: {
      wsfunction: 'core_calendar_get_calendar_upcoming_view',
      moodlewsrestformat: 'json',
      wstoken: userToken,
    },
  });
  return response.data;
};

// https://moodle.vspj.cz/login/token.php?username=USERNAME&password=PASSWORD&service=moodle_mobile_app
// http://DOMAIN_OR_IP/webservice/rest/server.php?wstoken=TOKEN&moodlewsrestformat=JSON&wsfunction=FUNCTION

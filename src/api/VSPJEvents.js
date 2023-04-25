import axios from 'axios';
import { selectAccessToken } from './../store/authSlice';
import store from './../store/store';
import * as AxiosLogger from 'axios-logger';
import Constants from 'expo-constants';
import { newAbortSignal } from '../helpers/axios';
import moment from 'moment-timezone';

const axiosInstance = axios.create({
  baseURL: Constants.expoConfig.extra.vspjEventsApiUrl,
  // headers: {
  //   Authorization: `Bearer ${accessToken}`,
  // },
});
axiosInstance.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
);

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = selectAccessToken(store.getState());
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => new Promise.reject(err)
);

axiosInstance.interceptors.request.use((config) => {
  config.signal = newAbortSignal(180000);
  return config;
});

axiosInstance.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
);

export const getLoggedInUser = async () => {
  return await axiosInstance.get('/userinfo/');
};

export const getEventTypes = async () => {
  const response = await axiosInstance.get('/event-types/');
  return response.data;
};

/**
 * @async
 * @param {Date} fromDate
 * @param {Date} toDate
 * @param {Date} changedAfter
 * @returns {Promise}
 */
export const getEvents = async (
  fromDate = null,
  toDate = null,
  changedAfter = null
) => {
  const params = {};
  if (fromDate) {
    params.from_date = moment(fromDate).format('YYYY-MM-DD');
  }
  if (toDate) {
    params.to_date = moment(toDate).format('YYYY-MM-DD');
  }
  if (changedAfter) {
    params.changed_after = moment(changedAfter).unix();
  }
  const response = await axiosInstance.get('/events/', { params });
  return response.data;
};

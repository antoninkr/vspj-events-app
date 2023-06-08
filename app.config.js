module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      eventsApiOpenidConnectProviderUrl:
        process.env.EVENTS_API_OPENID_CONNECT_PROVIDER_URL ?? '',
      vspjEventsAppOpenidConnectClientId:
        process.env.VSPJ_EVENTS_APP_OPENID_CONNECT_CLIENT_ID ?? '',
      vspjEventsApiOpenidConnectClaim:
        process.env.VSPJ_EVENTS_API_OPENID_CONNECT_CLAIM ?? '',
      vspjEventsApiUrl: process.env.VSPJ_EVENTS_API_URL ?? '',
      test: process.env.TEST ?? '',
      moodleUrl: process.env.MOODLE_URL ?? '',
    },
  };
};

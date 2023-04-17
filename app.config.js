module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      eventsApiOpenidConnectProviderUrl:
        process.env.EVENTS_API_OPENID_CONNECT_PROVIDER_URL ??
        'https://login.microsoftonline.com/97f201cb-6533-4746-96aa-dd521e74b94f/v2.0/',
      eventsApiOpenidConnectClientId:
        process.env.EVENTS_API_OPENID_CONNECT_CLIENT_ID ??
        'ca3c3264-b25b-4ef4-8625-242bb77d8034',
      vspjEventsApiUrl:
        process.env.VSPJ_EVENTS_API_URL ?? 'http://is.vspj.local/eventsapi',
      test: process.env.TEST ?? 'default_test_value',
      moodleUrl: process.env.MOODLE_URL ?? 'https://moodle.vspj.cz',
    },
  };
};

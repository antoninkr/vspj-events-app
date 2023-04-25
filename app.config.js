module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      eventsApiOpenidConnectProviderUrl:
        process.env.EVENTS_API_OPENID_CONNECT_PROVIDER_URL ??
        'https://login.microsoftonline.com/97f201cb-6533-4746-96aa-dd521e74b94f/v2.0/',
      vspjEventsAppOpenidConnectClientId:
        process.env.VSPJ_EVENTS_APP_OPENID_CONNECT_CLIENT_ID ??
        'be20dedd-bbc4-474c-ab6c-e19f3672f198',
      vspjEventsApiOpenidConnectClaim:
        process.env.VSPJ_EVENTS_API_OPENID_CONNECT_CLAIM ??
        'api://56a22c68-4867-4a7b-8477-9c1648b5d33d/Events.Read',
      vspjEventsApiUrl:
        process.env.VSPJ_EVENTS_API_URL ?? 'http://is.vspj.local/eventsapi',
      test: process.env.TEST ?? 'default_test_value',
      moodleUrl: process.env.MOODLE_URL ?? 'https://moodle.vspj.cz',
    },
  };
};

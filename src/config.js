const development = {
  lsTokenKey: 'auth-data',
  clientId:
    '482039686904-ihpee3br3p9m6o3a2ad02ffkcopkvbca.apps.googleusercontent.com',
  baseUrl: 'http://localhost:3000',
  scope: 'profile email',
  prompt: 'select_account'
};

const production = {
  lsTokenKey: 'auth-data',
  clientId:
    '482039686904-ihpee3br3p9m6o3a2ad02ffkcopkvbca.apps.googleusercontent.com',
  baseUrl: 'http://localhost:3000',
  scope: 'profile email',
  prompt: 'select_account'
};

export default process.env.NODE_ENV === 'production' ? production : development;

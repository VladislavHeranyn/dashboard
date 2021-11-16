import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import GAuth from 'vue-google-oauth2';
import config from '../config';

const { clientId, scope, prompt } = config;
const gauthOption = {
  clientId,
  scope,
  prompt
};

Vue.use(GAuth, gauthOption);
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'md'
  }
});

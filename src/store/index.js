import Vue from 'vue';
import Vuex from 'vuex';
import authModule from './modules/auth';
import appModule from './modules/app';
import appConfigModule from '../store/modules/appConfig';
import errorsModule from './modules/errors';
import dashboardsModule from './modules/dashboards';
import schedulersModule from './modules/schedulers';
import alertsModule from './modules/alerts';
import widgetModule from '../store/modules/widgets';
import thresholdModule from './modules/thresholds';
import reportModule from './modules/reports';
import jobsModule from './modules/jobs';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: authModule,
    app: appModule,
    appConfig: appConfigModule,
    errors: errorsModule,
    dashboard: dashboardsModule,
    scheduler: schedulersModule,
    alerts: alertsModule,
    widgets: widgetModule,
    threshold: thresholdModule,
    report: reportModule,
    job: jobsModule
  }
});

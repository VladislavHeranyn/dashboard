import { format, parseISO } from 'date-fns';

function prettifyDate(date) {
  return format(parseISO(new Date(date).toISOString()), 'yyyy-MM-dd');
}

export default {
  namespaced: true,
  state: {
    // on back-end
    dashboardView: false,
    date: prettifyDate(Date.now())
  },
  actions: {
    setDate(ctx, res) {
      ctx.commit('SET_DATE', res);
    },
    changeDashboardView(ctx) {
      // action changeView
      ctx.commit('CHANGE_DASHBOARD_VIEW');
    }
  },
  mutations: {
    CHANGE_DASHBOARD_VIEW(state) {
      // mutation changeView
      state.dashboardView = !state.dashboardView;
    },
    SET_DATE(state, payload) {
      state.date = payload;
    }
  },
  getters: {}
};

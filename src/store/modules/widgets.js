import { axiosInstance } from '../../utils/axios';
import moment from 'moment';

export default {
  namespaced: true,
  state: {
    keys: [],
    categoriesDetail: [],
    valuesDetail: [],
    type: [],
    data: {}
  },
  actions: {
    async fetchKeys(ctx) {
      const { data } = await axiosInstance.get('/keys');
      ctx.commit('SET_KEYS', data.sort());
    },

    async setWidget(ctx, dashboard) {
      await axiosInstance.put(
        `/dashboards/${dashboard.dashboardId}/widgets/${dashboard.id}`,
        { type: dashboard.type }
      );
    },

    async fetchAllWidgetData(ctx, { dashboardId, widgetId }) {
      const { data } = await axiosInstance.get(
        `dashboards/${dashboardId}/widgets/${widgetId}`
      );
      data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      ctx.commit('SET_WIDGET_DATA', data);
    }
  },

  mutations: {
    SET_KEYS(state, keys) {
      state.keys = keys;
    },

    SET_WIDGET_DATA(state, { key, name, data }) {
      state.data = { key, name };
      state.categoriesDetail = data.map((item) =>
        moment(item.date).format('l')
      );
      state.valuesDetail = [
        {
          name: data[0]?.valueType,
          data: data.map((item) => item.value)
        }
      ];
    }
  }
};

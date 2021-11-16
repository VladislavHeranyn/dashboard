import { axiosInstance } from '../../utils/axios';

export default {
  namespaced: true,
  state: {
    thresholds: [],
    loading: false
  },
  actions: {
    async addThreshold(ctx, { threshold, widgetId, dashboardId }) {
      await axiosInstance.post(
        `/dashboards/${dashboardId}/widgets/${widgetId}/thresholds`,
        threshold
      );

      ctx.dispatch('fetchThresholds', { dashboardId, widgetId });
    },

    async fetchThresholds(ctx, { dashboardId, widgetId }) {
      ctx.dispatch('setLoading', true);
      const { data } = await axiosInstance.get(
        `/dashboards/${dashboardId}/widgets/${widgetId}/thresholds`
      );
      data.sort((a, b) => a.id - b.id);
      ctx.commit('SET_THRESHOLDS', data);
      ctx.dispatch('setLoading', false);
    },

    async editThreshold(
      ctx,
      { dashboardId, widgetId, thresholdId, newThreshold }
    ) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.put(
        `/dashboards/${dashboardId}/widgets/${widgetId}/thresholds/${thresholdId}`,
        newThreshold
      );
      await ctx.dispatch('fetchThresholds', { dashboardId, widgetId });
    },

    async deleteThreshold(ctx, { dashboardId, widgetId, thresholdId }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.delete(
        `/dashboards/${dashboardId}/widgets/${widgetId}/thresholds/${thresholdId}`
      );
      await ctx.dispatch('fetchThresholds', { dashboardId, widgetId });
    },

    setLoading(ctx, bool) {
      ctx.commit('SET_LOADING', bool);
    }
  },

  mutations: {
    SET_THRESHOLDS(state, thresholds) {
      state.thresholds = null;
      state.thresholds = thresholds;
    },

    SET_LOADING(state, bool) {
      state.loading = bool;
    }
  }
};

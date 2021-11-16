import { axiosInstance } from '../../utils/axios';

export default {
  namespaced: true,

  state: {
    schedulers: [],
    loading: false
  },

  actions: {
    async fetchSchedulers(ctx, dashboardId) {
      ctx.dispatch('setLoading', true);
      const { data } = await axiosInstance.get(
        `/dashboards/${dashboardId}/schedulers`
      );
      ctx.commit('SET_SCHEDULERS', data);
      ctx.dispatch('setLoading', false);
    },

    async addScheduler(ctx, { dashboardId, rule }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.post(`/dashboards/${dashboardId}/schedulers`, {
        rule
      });
      await ctx.dispatch('fetchSchedulers', dashboardId);
    },

    async editScheduler(ctx, { dashboardId, id, rule }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.put(`/dashboards/${dashboardId}/schedulers/${id}`, {
        rule
      });
      await ctx.dispatch('fetchSchedulers', dashboardId);
    },

    async deleteScheduler(ctx, { dashboardId, id }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.delete(`/dashboards/${dashboardId}/schedulers/${id}`);
      await ctx.dispatch('fetchSchedulers', dashboardId);
    },

    setLoading(ctx, bool) {
      ctx.commit('SET_LOADING', bool);
    }
  },

  mutations: {
    SET_SCHEDULERS(state, schedulers) {
      state.schedulers = schedulers;
    },

    SET_LOADING(state, bool) {
      state.loading = bool;
    }
  },

  getters: {
    getSchedulers: (state) => (dashboardId) =>
      state.schedulers.filter(
        (scheduler) => scheduler.dashboardId == dashboardId
      )
  }
};

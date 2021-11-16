import { axiosInstance, guestAxiosInstance } from '../../utils/axios';

export default {
  namespaced: true,

  state: {
    dashboards: [],
    loading: false
  },

  actions: {
    async fetchDashboards(ctx) {
      const { data } = await axiosInstance.get('/dashboards');
      ctx.commit('SET_DASHBOARDS', data);
    },

    async addDashboard(ctx, { name, openedDashboardId }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.post('/dashboards', {
        name
      });
      await ctx.dispatch('fetchDashboards');
      if (openedDashboardId) {
        await ctx.dispatch('fetchWidgets', openedDashboardId);
      }
      ctx.dispatch('setLoading', false);
    },

    async renameDashboard(ctx, { id, name, openedDashboardId }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.put(`/dashboards/${id}`, {
        name
      });
      await ctx.dispatch('fetchDashboards');
      if (openedDashboardId) {
        await ctx.dispatch('fetchWidgets', openedDashboardId);
      }
      ctx.dispatch('setLoading', false);
    },

    async deleteDashboard(ctx, { id, openedDashboardId }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.delete(`/dashboards/${id}`);
      await ctx.dispatch('fetchDashboards');
      if (openedDashboardId) {
        await ctx.dispatch('fetchWidgets', openedDashboardId);
      }
      ctx.dispatch('setLoading', false);
    },

    async copyDashboard(ctx, { id, name, openedDashboardId }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.post(`/dashboards/${id}/copy`, {
        name
      });
      await ctx.dispatch('fetchDashboards');
      if (openedDashboardId) {
        await ctx.dispatch('fetchWidgets', openedDashboardId);
      }
      ctx.dispatch('setLoading', false);
    },

    async fetchWidgets(ctx, dashboardId) {
      ctx.dispatch('setLoading', true);
      const dashboardsCopy = [...ctx.state.dashboards];
      const currentDashboardIndex = dashboardsCopy.findIndex(
        (dashboard) => dashboardId == dashboard.id
      );
      const { data } = await axiosInstance.get(
        `/dashboards/${dashboardId}/widgets`,
        {
          params: { date: ctx.rootState.app.date }
        }
      );
      dashboardsCopy[currentDashboardIndex].widgets = data;
      await ctx.commit('SET_DASHBOARDS', dashboardsCopy);
      ctx.dispatch('setLoading', false);
    },

    async setType(ctx, { dashboardId, widgetId, type }) {
      const dashboardsCopy = [...ctx.state.dashboards];

      const currentDashboardIndex = dashboardsCopy.findIndex(
        (dashboard) => dashboard.id == dashboardId
      );

      const currentWidgetIndex = dashboardsCopy[
        currentDashboardIndex
      ].widgets.findIndex((widget) => widget.id == widgetId);
      dashboardsCopy[currentDashboardIndex].widgets[
        currentWidgetIndex
      ].type = type;
      ctx.commit('SET_DASHBOARDS', dashboardsCopy);
    },

    async addWidget(ctx, { dashboardId, widget }) {
      ctx.dispatch('setLoading', true);
      const position = ctx.state.dashboards.find(
        (dashboard) => dashboard.id == dashboardId
      ).widgets.length;
      await axiosInstance.post(`/dashboards/${dashboardId}/widgets`, {
        ...widget,
        position
      });
      await ctx.dispatch('fetchWidgets', dashboardId);
    },
    async deleteWidget(ctx, { dashboardId, widgetId }) {
      ctx.dispatch('setLoading', true);
      await axiosInstance.delete(
        `/dashboards/${dashboardId}/widgets/${widgetId}`
      );
      await ctx.dispatch('fetchWidgets', dashboardId);
    },

    async setWidgetPositions(ctx, { dashboardId, widgets }) {
      const dashboardsCopy = [...ctx.state.dashboards];

      const currentDashboardIndex = dashboardsCopy.findIndex(
        (dashboard) => dashboardId == dashboard.id
      );

      dashboardsCopy[currentDashboardIndex].widgets = widgets;
      ctx.commit('SET_DASHBOARDS', dashboardsCopy);
    },

    async rememberWidgetPositions(ctx, { dashboardId, indexWidget }) {
      await axiosInstance.put(`/dashboards/${dashboardId}/widgets/position`, {
        indexWidget
      });
    },

    async fetchDataToSend(ctx, { dashboardId, token }) {
      ctx.dispatch('setLoading', true);
      ctx.state.dashboards.push({ id: dashboardId, widgets: [] });
      const { data } = await guestAxiosInstance.get(
        `/dashboards/${dashboardId}/widgets`,
        {
          headers: { token, accept: 'application/json' },
          params: { date: new Date() }
        }
      );
      ctx.state.dashboards[0].widgets = data;
      ctx.dispatch('setLoading', false);
    },

    setLoading(ctx, bool) {
      ctx.commit('SET_LOADING', bool);
    }
  },

  mutations: {
    SET_DASHBOARDS(state, dashboards) {
      state.dashboards = dashboards;
    },

    SET_LOADING(state, bool) {
      state.loading = bool;
    }
  },

  getters: {
    getWidgets: (state) => (dashboardId) => {
      return state.dashboards.find((dashboard) => dashboard.id == dashboardId)
        .widgets;
    }
  }
};

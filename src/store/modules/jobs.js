import { axiosInstance } from '../../utils/axios';

export default {
  namespaced: true,
  state: {
    jobs: [],
    total: 0,
    limit: 20,
    page: 1,
    orderBy: undefined,
    orderTo: undefined
  },

  actions: {
    async fetchJobs(ctx, { page, orderBy, orderTo }) {
      const { data } = await axiosInstance.get(
        `/jobs/history?page=${page}&limit=${this.state.job.limit}&orderBy=${orderBy}&orderTo=${orderTo}`,
        {
          params: { date: ctx.rootState.app.date }
        }
      );
      ctx.commit('FETCH_JOBS', data);
      ctx.commit('SET_JOBS_VALUE', { page, orderBy, orderTo });
    }
  },

  mutations: {
    FETCH_JOBS(state, jobs) {
      state.jobs = jobs.setPageItem;
      state.total = jobs.total;
    },
    SET_JOBS_VALUE(state, value) {
      state.page = value.page;
      state.orderBy = value.orderBy;
      state.orderTo = value.orderTo;
    }
  },
  getters: {}
};

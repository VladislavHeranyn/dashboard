import store from '..';
import { axiosInstance } from '../../utils/axios';

export default {
  namespaced: true,
  state: {
    message: []
  },
  actions: {
    async deleteAlert(ctx, message) {
      ctx.commit('DELETE_ALERT', message);
      await axiosInstance.delete(`/alerts/${message.id}`);
    },

    async checkMessage(ctx, message) {
      ctx.commit('CHECK_MESSAGE', message);
      await axiosInstance.put(`/alerts/${message.id}/read/`, {
        read: true
      });
    },

    async fetchMessages(ctx) {
      const { data } = await axiosInstance.get('/alerts');
      ctx.commit('FETCH_MESSAGES', data);
    }
  },
  mutations: {
    DELETE_ALERT(state, message) {
      state.message = state.message.filter((item) => {
        return item.id !== message.id;
      });
    },
    CHECK_MESSAGE(state, message) {
      state.message = state.message.map((item) => {
        message.read = true;
        return item;
      });
    },
    FETCH_MESSAGES(state, messages) {
      state.message = messages;
    }
  },
  getters: {}
};

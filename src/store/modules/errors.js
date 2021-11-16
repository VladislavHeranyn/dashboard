export default {
  namespaced: true,
  state: {
    isOpen: false,
    text: ''
  },
  actions: {
    showMessage(ctx, payload) {
      ctx.commit('SHOW_MESSAGE', payload);
      setTimeout(() => ctx.commit('CLOSE_SNACKBAR'), 5000);
    },
    closeSnackbar(ctx) {
      ctx.commit('CLOSE_SNACKBAR');
    }
  },
  mutations: {
    SHOW_MESSAGE(state, payload) {
      state.text = payload;
      state.isOpen = true;
    },
    CLOSE_SNACKBAR(state) {
      state.isOpen = false;
    }
  },
  getters: {}
};

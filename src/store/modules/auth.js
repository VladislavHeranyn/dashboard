import * as ls from 'local-storage';
import config from '../../config';
import { initAxiosInstance, guestAxiosInstance } from '../../utils/axios';

const emptyState = {
  name: null,
  jwt: null,
  img: null
};

function getDefaultState() {
  const lsData = ls.get(config.lsTokenKey);
  if (lsData) {
    const { name, jwt, img } = lsData;
    return { name, jwt, img };
  }
  return emptyState;
}

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    isLogged(state) {
      return !!state.jwt;
    }
  },
  actions: {
    async init(ctx) {
      const data = ls.get(config.lsTokenKey);
      if (data) {
        await ctx.dispatch('setData', data);
      }
    },
    async setData(ctx, payload) {
      ls.set(config.lsTokenKey, payload);
      initAxiosInstance(payload.jwt, () => ctx.dispatch('logout'));
    },
    async login(ctx, google) {
      const googleUser = await google.signIn();
      if (googleUser) {
        const idToken = googleUser.getAuthResponse().id_token;
        const res = await guestAxiosInstance.post('/login', {
          token: idToken
        });
        if (res.data) {
          await ctx.dispatch('setData', res.data);
          ctx.commit('LOGIN', res.data);
        }
      }
    },
    async logout(ctx) {
      ls.remove(config.lsTokenKey);
      ctx.commit('LOGOUT');
    }
  },
  mutations: {
    LOGIN(state, payload) {
      const { name, jwt, img } = payload;
      state.name = name;
      state.jwt = jwt;
      state.img = img;
    },
    LOGOUT(state) {
      state.name = null;
      state.jwt = null;
      state.img = null;
    }
  }
};

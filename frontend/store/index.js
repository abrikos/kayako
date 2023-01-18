export const state = () => ({
  loginRedirect: '/search',
  snackbar: null,
})

export const mutations = {
  setSnackBar(state, payload){
    state.snackbar = payload
  }
}

export const getters = {
  getLoginRedirect(state) {
    return state.loginRedirect;
  },
  getLoggedUser(state) {
    return state.auth.user
  },
  getSnackBar(state) {
    return state.snackbar
  }
}

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }) {
    const cookie = this.$cookies.get('auth');
    if (cookie) {
      commit('auth/setTokens', cookie.auth);
    }

    const { accessToken, refreshToken } = state.auth;
    if (accessToken && refreshToken) {
      try {
        await dispatch('auth/refresh');
      } catch (e) {
        commit('auth/logout');
      }
    }
  }
};

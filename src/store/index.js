import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import routerInfo from './modules/routerInfo'
import projectInfo from './modules/projectInfo'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import locas from '../api/locas'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const noStore = ["routes"];

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    routerInfo,
    projectInfo,
    permission,
    tagsView
  },
  getters,
  plugins: [
    // createPersistedState({
    // storage: {
    //   getItem: (key, value) => {
    //     // [noStore].includes(key) ? value : locas.get(key, value);
    //     locas.get(key, value);
    //   },
    //   setItem: (key, value) => locas.set(key, value),
    //   removeItem: key => locas.removeItem(key)
    // }

    // storage: {
    //   getItem: key => locas.get(key),
    //   setItem: (key, value) => locas.set(key, value),
    //   removeItem: key => locas.removeItem(key)
    // }
    // })
  ]
})

export default store

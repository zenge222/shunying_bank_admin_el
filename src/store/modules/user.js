import { _login, _logout } from '@/services/login' // getInfo
import { _menuList } from '@/services/system'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes } from '@/router'
import router from '@/router'

import { Message } from 'element-ui'
import Layout from '@/layout'

export function getAsyncRoutes(routes) {
  const res = []
  const keys = ['path', 'name', 'children', 'redirect', 'alwaysShow', 'meta', 'hidden']
  routes.forEach(item => {
    const newItem = {}
    if (item.component) {
      if (item.component === 'layout/index') {
        newItem.component = Layout
      } else {
        newItem.component = () => import(`@/${item.component}`)
      }
    }
    newItem.meta = {
      title: item.title,
      icon: item.icon
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
    }
    if (newItem.children && newItem.children.length) {
      newItem.children = getAsyncRoutes(item.children)
    }
    res.push(newItem)
  })
  return res
}


const getDefaultState = () => {
  return {
    token: getToken(),
    name: 'admin',
    avatar: '',
    userInfo: {
      username: '',
      id: '',
      profile: '',
    },
    routes: [],
    addRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_INFO: (state, data) => {
    state.userInfo.username = data.username;
    state.userInfo.id = data.id
    state.userInfo.profile = data.baseUrl + data.profile;
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code } = userInfo
    return new Promise((resolve, reject) => {
      _login({ username: username.trim(), password: password, code: code }).then(res => {
        const { data } = res
        if (res.code == 1) {
          commit('SET_TOKEN', data.token);
          commit('SET_USER_INFO', data);
          setToken(data.token);
          let userInfo = {};
          userInfo.id = data.id;
          userInfo.username = data.username;
          userInfo.profile = data.baseUrl + data.profile;
          userInfo.nickName = data.nickName;
          localStorage.setItem("userInfo", JSON.stringify(userInfo))
          router.push('/');
        } else {
          Message({ type: "warning", message: res.msg })
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // generateRoutes({ commit }) {
  //   return new Promise(async resolve => {
  //     let accessedRoutes
  //     _menuList().then(res => {
  //       const asyncRoutes = getAsyncRoutes(res.data) // 对路由格式进行处理
  //       accessedRoutes = asyncRoutes || []
  //       commit('SET_ROUTES', accessedRoutes)
  //       console.log('asyncRoutes', asyncRoutes)
  //       resolve(accessedRoutes)
  //     })
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      _logout(state.token).then(() => {
        removeToken() // must remove  token  first
        // resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


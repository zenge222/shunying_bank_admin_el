import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { constantRoutes } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
// var accessRoutes //用来获取后台拿到的路由
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  let hasToken = getToken()
  if (localStorage.getItem("userInfo") == null) {
    hasToken = null;
  }
  // hasToken
  if (hasToken) {
    // console.log('addRoutes',store.state.permission.addRoutes)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否已通过 getInfo 获得其权限角色
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      const hasRoles = store.state.permission.roles && store.state.permission.roles.length > 0;
      if (hasRoles) {
        next()
      } else {
        // if (accessRoutes) return next();
        try {
          console.log('try')
          const { roles = ['admin'] } = store.dispatch('permission/getInfo');
          // 在这里获取异步路由

          // console.log(localStorage.getItem("userInfo"))
          await store.dispatch('permission/generateRoutes', roles)
          // 获取用户信息
          // 注意：角色必须是对象数组！例如: ['admin'] or ,['developer','editor']

          // 调用router.addRoutes方法,将异步路由添加进去
          // console.log('accessRoutes', accessRoutes)

          // let data = constantRoutes.concat(accessRoutes)
          // router.options.routes = data;
          // router.matcher.addRoutes(store.state.permission.routes)
          // router.matcher = new vueRouter({ mode: 'hash' }).matcher;
          // router.options.routes = constantRoutes.concat(accessRoutes);
          // router.addRoutes([...constantRoutes.concat(accessRoutes)]);

          // hack方法以确保addRoutes是完整的
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // console.log('catch')
          // 删除token并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
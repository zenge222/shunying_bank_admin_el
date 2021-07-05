import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)
// import("@/store/index.js").then(res => {
//   console.log(res.default.getters.routerType);
//   // console.log(res.default.getters.user);
// });
/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/*
  // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
  hidden: true // (默认 false)

  //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
  redirect: 'noRedirect'

  // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
  alwaysShow: true

  name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
  meta: {
    roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
    title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
    noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)

    // 当路由设置了该属性，则会高亮相对应的侧边栏。
    // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
    // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
    activeMenu: '/article/list'
  }

  {
  path: '/permission',
  component: Layout,
  redirect: '/permission/index', //重定向地址，在面包屑中点击会重定向去的地址
  hidden: true, // 不在侧边栏线上
  alwaysShow: true, //一直显示根路由
  meta: { roles: ['admin','editor'] }, //你可以在根路由设置权限，这样它下面所以的子路由都继承了这个权限
  children: [{
    path: 'index',
    component: ()=>import('permission/index'),
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'lock', //图标
      roles: ['admin','editor'], //或者你可以给每一个子路由设置自己的权限
      noCache: true // 不会被 <keep-alive> 缓存
    }
  }]
}
*/

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: "/",
  //   component: () => import("@/layout/index"),
  //   redirect: "/home",
  //   name: 'Home',
  //   meta: { title: "项目管理", icon: "el-icon-s-home" },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/home",
  //       hidden: false,
  //       name: "CutProject",
  //       component: () => import("@/views/proManage/cutProject/index"),
  //       meta: { title: "切换项目", icon: "", roles: [] }
  //     },
  //     {
  //       path: "/projectHome",
  //       hidden: true,
  //       name: "ProjectHome",
  //       component: () => import("@/views/proManage/projectHome/index"),
  //       meta: { title: "项目首页", icon: "", roles: [] }
  //     },
  //     {
  //       path: "/structureManage",
  //       name: 'StructureManage',
  //       hidden: true,
  //       redirect: "/mechanismManageList",
  //       component: () => import("@/views/proManage/structureManage/index"),
  //       meta: { title: "机构管理", icon: "", roles: [] },
  //       children: [
  //         {
  //           path: "/mechanismManageList",
  //           hidden: false,
  //           name: "MechanismManageList",
  //           component: () => import("@/views/proManage/structureManage/mechanismManageList/index"),
  //           meta: { title: "机构人员管理", icon: "", roles: [] },
  //         },
  //         {
  //           path: "/mechanismDetail",
  //           hidden: true,
  //           name: "MechanismDetail",
  //           component: () => import("@/views/proManage/structureManage/mechanismDetail/index"),
  //           meta: { title: "机构人员信息", icon: "", roles: [] },
  //         },
  //         // 
  //         {
  //           path: "/regionManage",
  //           hidden: false,
  //           name: "RegionManage",
  //           component: () => import("@/views/proManage/structureManage/regionManage/index"),
  //           meta: { title: "区域管理", icon: "", roles: [] },
  //         },
  //         {
  //           path: "/regionInfo",
  //           hidden: true,
  //           name: "RegionInfo",
  //           component: () => import("@/views/proManage/structureManage/regionInfo/index"),
  //           meta: { title: "区域信息", icon: "", roles: [] },
  //         },
  //         {
  //           path: "/outletsManage",
  //           hidden: false,
  //           name: "OutletsManage",
  //           component: () => import("@/views/proManage/structureManage/outletsManage/index"),
  //           meta: { title: "网点管理", icon: "", roles: [] },
  //         },
  //         {
  //           path: "/outletsInfo",
  //           hidden: true,
  //           name: "OutletsInfo",
  //           component: () => import("@/views/proManage/structureManage/outletsInfo/index"),
  //           meta: { title: "网点信息", icon: "", roles: [] },
  //         },
  //         {
  //           path: "/dutyManage",
  //           hidden: false,
  //           name: "DutyManage",
  //           component: () => import("@/views/proManage/structureManage/dutyManage/index"),
  //           meta: { title: "职责管理", icon: "", roles: [] },
  //         },
  //         {
  //           path: "/dutyInfo",
  //           hidden: true,
  //           name: "DutyInfo",
  //           component: () => import("@/views/proManage/structureManage/dutyInfo/index"),
  //           meta: { title: "职责信息", icon: "", roles: [] },
  //         },
  //       ],
  //     },
  //     {
  //       path: "/assessmentManage",
  //       name: 'AssessmentManage',
  //       hidden: true,
  //       redirect: "/cleanerDailyTasks",
  //       alwaysShow: true,
  //       component: () => import("@/views/proManage/assessmentManage/index"),
  //       meta: { title: "考核管理", icon: "" },
  //       children: [
  //         {
  //           path: "/cleanerDailyTasks",
  //           hidden: false,
  //           name: "CleanerDailyTasks",
  //           component: () => import("@/views/proManage/assessmentManage/cleanerDailyTasks/index"),
  //           meta: { title: "保洁日常任务", icon: "" },
  //         },
  //         {
  //           path: "/outletsAssessment",
  //           hidden: false,
  //           name: "OutletsAssessment",
  //           component: () => import("@/views/proManage/assessmentManage/outletsAssessment/index"),
  //           meta: { title: "网点月度考核", icon: "" },
  //         },
  //         {
  //           path: "/outletsCheckRecord",
  //           hidden: false,
  //           name: "OutletsCheckRecord",
  //           component: () => import("@/views/proManage/assessmentManage/outletsCheckRecord/index"),
  //           meta: { title: "网点巡检记录", icon: "" },
  //         },
  //       ],
  //     },
  //     {
  //       path: "/feedBackManage",
  //       name: 'FeedBackManage',
  //       hidden: true,
  //       redirect: "/cleanUpNeeds",
  //       alwaysShow: true,
  //       component: () => import("@/views/proManage/feedBackManage/index"),
  //       meta: { title: "反馈管理", icon: "" },
  //       children: [
  //         {
  //           path: "/cleanUpNeeds",
  //           hidden: false,
  //           name: "CleanUpNeeds",
  //           component: () => import("@/views/proManage/feedBackManage/cleanUpNeeds/index"),
  //           meta: {
  //             title: "需求管理", icon: ""
  //           },
  //         },
  //         {
  //           path: "/eventReportList",
  //           hidden: false,
  //           name: "EventReportList",
  //           component: () => import("@/views/proManage/feedBackManage/eventReportList/index"),
  //           meta: {
  //             title: "事件上报列表", icon: ""
  //           },
  //         },
  //         {
  //           path: "/complaintList",
  //           hidden: false,
  //           name: "ComplaintList",
  //           component: () => import("@/views/proManage/feedBackManage/complaintList/index"),
  //           meta: {
  //             title: "投诉", icon: ""
  //           },
  //         },
  //       ],
  //     },

  //     {
  //       path: "/materielManage",
  //       name: 'MaterielManage',
  //       hidden: true,
  //       redirect: "/materialApplicationRecord",
  //       alwaysShow: true,
  //       component: () => import("@/views/proManage/materielManage/index"),
  //       meta: { title: "物料管理", icon: "" },
  //       children: [
  //         {
  //           path: "/materialApplicationRecord",
  //           hidden: false,
  //           name: "MaterialApplicationRecord",
  //           component: () => import("@/views/proManage/materielManage/materialApplicationRecord/index"),
  //           meta: {
  //             title: "物料申请", icon: ""
  //           },
  //         },
  //         {
  //           path: "/materialRecordDetail",
  //           hidden: true,
  //           name: "MaterialRecordDetail",
  //           component: () => import("@/views/proManage/materielManage/materialRecordDetail/index"),
  //           meta: {
  //             title: "物料申请详情", icon: ""
  //           },
  //         },
  //         {
  //           path: "/accountingRecord",
  //           hidden: false,
  //           name: "AccountingRecord",
  //           component: () => import("@/views/proManage/materielManage/accountingRecord/index"),
  //           meta: {
  //             title: "物料核算单记录", icon: ""
  //           },
  //         },
  //         {
  //           path: "/accountingRecordDetail",
  //           hidden: true,
  //           name: "AccountingRecordDetail",
  //           component: () => import("@/views/proManage/materielManage/accountingRecordDetail/index"),
  //           meta: {
  //             title: "物料核算单详情", icon: ""
  //           },
  //         },
  //         {
  //           path: "/outDataList",
  //           hidden: false,
  //           name: "OutDataList",
  //           component: () => import("@/views/proManage/materielManage/outDataList/index"),
  //           meta: {
  //             title: "网点物料列表", icon: ""
  //           },
  //         },
  //         {
  //           path: "/regionDataList",
  //           hidden: false,
  //           name: "RegionDataList",
  //           component: () => import("@/views/proManage/materielManage/regionDataList/index"),
  //           meta: {
  //             title: "区域物料列表", icon: ""
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       path: "/setUp",
  //       name: 'SetUp',
  //       hidden: true,
  //       redirect: "/outCheckSetUp",
  //       alwaysShow: true,
  //       component: () => import("@/views/proManage/setUp/index"),
  //       meta: { title: "设置", icon: "" },
  //       children: [
  //         {
  //           path: "/outCheckSetUp",
  //           hidden: false,
  //           name: "OutCheckSetUp",
  //           component: () => import("@/views/proManage/setUp/outCheckSetUp/index"),
  //           meta: {
  //             title: "网点巡检配置", icon: ""
  //           },
  //         },
  //         {
  //           path: "/feedBackSetUp",
  //           hidden: false,
  //           name: "FeedBackSetUp",
  //           component: () => import("@/views/proManage/setUp/feedBackSetUp/index"),
  //           meta: {
  //             title: "反馈处理配置", icon: ""
  //           },
  //         },
  //         {
  //           path: "/outAssessmentSetUp",
  //           hidden: false,
  //           name: "OutAssessmentSetUp",
  //           component: () => import("@/views/proManage/setUp/outAssessmentSetUp/index"),
  //           meta: {
  //             title: "网点月考核配置", icon: ""
  //           },
  //         },
  //         {
  //           path: "/materielSetUp",
  //           hidden: false,
  //           name: "MaterielSetUp",
  //           component: () => import("@/views/proManage/setUp/materielSetUp/index"),
  //           meta: {
  //             title: "物料配置", icon: ""
  //           },
  //         },
  //         {
  //           path: "/materielBatchSetUp",
  //           hidden: false,
  //           name: "MaterielBatchSetUp",
  //           component: () => import("@/views/proManage/setUp/materielBatchSetUp/index"),
  //           meta: {
  //             title: "物料批次配置", icon: ""
  //           },
  //         },
  //       ]
  //     },
  //   ],
  // },
  // {
  //   path: "/sManage",
  //   name: "/SManage",
  //   component: () => import("@/layout/index"),
  //   redirect: "/staffManage",
  //   meta: { title: "人事管理", icon: "el-icon-s-home" },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/staffManage",
  //       hidden: false,
  //       name: "StaffManage",
  //       component: () => import("@/views/perManage/staffManage/index"),
  //       meta: { title: "员工管理", icon: "" },
  //     },
  //     {
  //       path: "/staffInfo",
  //       hidden: true,
  //       name: "StaffInfo",
  //       component: () => import("@/views/perManage/staffInfo/index"),
  //       meta: {
  //         title: "员工信息", icon: ""
  //       },
  //     },
  //     {
  //       path: "/checkAssessList",
  //       hidden: false,
  //       name: "CheckAssessList",
  //       component: () => import("@/views/perManage/checkAssessList/index"),
  //       meta: {
  //         title: "巡检考核列表", icon: ""
  //       },
  //     },
  //     {
  //       path: "/cleanAssessList",
  //       hidden: false,
  //       name: "CleanAssessList",
  //       component: () => import("@/views/perManage/cleanAssessList/index"),
  //       meta: {
  //         title: "保洁考核列表", icon: ""
  //       },
  //     },
  //     {
  //       path: "/staffAttendanceList",
  //       hidden: false,
  //       name: "StaffAttendanceList",
  //       component: () => import("@/views/perManage/staffAttendanceList/index"),
  //       meta: {
  //         title: "员工考勤列表", icon: ""
  //       },
  //     },
  //     {
  //       path: "/staffMonthlyEvaluation",
  //       hidden: false,
  //       name: "StaffMonthlyEvaluation",
  //       component: () => import("@/views/perManage/staffMonthlyEvaluation/index"),
  //       meta: {
  //         title: "员工月度考评", icon: ""
  //       },
  //     },
  //     {
  //       path: "/staffEvaluateConfig",
  //       hidden: false,
  //       name: "StaffEvaluateConfig",
  //       component: () => import("@/views/perManage/staffEvaluateConfig/index"),
  //       meta: {
  //         title: "员工考评配置", icon: ""
  //       },
  //     },
  //     {
  //       path: "/institutionApplyList",
  //       hidden: false,
  //       name: "InstitutionApplyList",
  //       component: () => import("@/views/perManage/institutionApplyList/index"),
  //       meta: {
  //         title: "机构申请排班记录", icon: ""
  //       },
  //     },
  //     {
  //       path: "/temporaryArrangeList",
  //       hidden: false,
  //       name: "TemporaryArrangeList",
  //       component: () => import("@/views/perManage/temporaryArrangeList/index"),
  //       meta: {
  //         title: "临时排班记录", icon: ""
  //       },
  //     },  // 
  //     {
  //       path: "/leaveApplyList",
  //       hidden: false,
  //       name: "LeaveApplyList",
  //       component: () => import("@/views/perManage/leaveApplyList/index"),
  //       meta: {
  //         title: "请假申请记录", icon: ""
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/systemManage",
  //   component: () => import("@/layout/index"),
  //   redirect: "/userManage",
  //   name: "SystemManage",
  //   meta: { title: "系统管理", icon: "el-icon-s-home" },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/userManage",
  //       hidden: false,
  //       name: "UserManage",
  //       component: () => import("@/views/systemManage/userManage/index"),
  //       meta: { title: "用户管理", icon: "" },
  //     },
  //     {
  //       path: "/menuManage",
  //       hidden: false,
  //       name: "MenuManage",
  //       component: () => import("@/views/systemManage/menuManage/index"),
  //       meta: { title: "菜单管理", icon: "" },
  //     },
  //     {
  //       path: "/roleManage",
  //       hidden: false,
  //       name: "RoleManage",
  //       component: () => import("@/views/systemManage/roleManage/index"),
  //       meta: { title: "角色管理", icon: "" },
  //     },
  //     {
  //       path: "/departmentManage",
  //       hidden: false,
  //       name: "DepartmentManage",
  //       component: () => import("@/views/systemManage/departmentManage/index"),
  //       meta: { title: "部门管理", icon: "" },
  //     },
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

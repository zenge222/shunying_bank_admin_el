import Vue from 'vue'
import { constantRoutes } from '@/router'
import { _userMenus } from '@/services/system'
import Layout from '@/layout/index'
import vueRouter from 'vue-router'
import router from '../../router/index'
import store from '..'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * 把后台返回菜单组装成routes要求的格式
 * @param {*} routes
 */
export function getAsyncRoutes(routes) {
    const res = []
    const keys = ['path', 'name', 'children', 'redirect', 'alwaysShow', 'meta', 'hidden']
    routes.forEach(item => {
        item.alwaysShow = true;
        item.hidden = item.hidden == 0 ? false : true;
        let newItem = { meta: { title: '', icon: '' } }

        if (item.component) {
            if (item.component === 'layout/index') {
                newItem.component = Layout
            } else {
                // webpack在编辑es6的时候动态引入import()时不能传入变量
                // newItem.component = () => import(`@/views/${item.component}`)
                newItem.component = resolve => {
                    require(['@/views/' + item.component], resolve)
                }
            }
        }
        newItem.meta.title = item.title;
        newItem.meta.icon = item.icon;
        for (const key in item) {
            if (keys.includes(key)) {
                newItem[key] = item[key]
            }
        }
        if (newItem.children && newItem.children.length) {
            newItem.children = getAsyncRoutes(item.children)
        }
        if (newItem.children.length == 0) {
            Vue.delete(newItem, 'children')
            newItem.alwaysShow = false;
        }
        res.push(newItem)
    })
    return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: [],
    roles: [],
    // showMenu: false // 处理刷新问题
}

const mutations = {
    SET_ROUTES: (state, data) => {
        console.log('commit')
        console.log(localStorage.getItem("showMenu"))
        if (localStorage.getItem("showMenu") && localStorage.getItem("showMenu") != null) {
            console.log('进 true')
            data[0].children.forEach(val => {
                val.hidden = false;
            })
        } else {
            console.log('进 false')
            if (localStorage.getItem("showMenu") != null) {
                data[0].children.forEach(val => {
                    val.hidden = true;
                })
                data[0].children[0].hidden = false;
            }
        }
        state.addRoutes = data
        state.routes = constantRoutes.concat(data)
        // console.log(state.routes)
        router.matcher = new vueRouter({ mode: 'hash' }).matcher;
        router.addRoutes([...state.routes]);

    },
    SET_ROLES: (state, data) => {
        state.roles = data
    },
    CLEAR_ROLES: (state, data) => {
        state.roles = [];
    },
    SET_SHOW_MENU: (state, data) => {
        state.showMenu = data;
        console.log(state.showMenu)
    },
    SHOW_ADD_ROUTERS: (state) => {
        state.routes[2].children.forEach((item) => {
            item.hidden = false;
        });
        router.matcher = new vueRouter({ mode: 'hash' }).matcher;
        router.addRoutes([...state.routes]);
        console.log('SHOW_ADD_ROUTERS', router.options.routes)
    },

}

const actions = {
    generateRoutes({ commit }, roles, id) {
        return new Promise(async resolve => {
            let id = "";
            if (localStorage.getItem("userInfo")) {
                id = JSON.parse(localStorage.getItem("userInfo")).id;
            } else {
                router.push('Login')
                return;
            }
            console.log('id:' + id);
            _userMenus(id).then(res => {
                const resData = getAsyncRoutes(res.data);// 对路由格式进行处理
                if (res.code == 1) {
                    let resRoutes = [
                        {
                            path: "/",
                            component: () => import("@/layout/index"),
                            redirect: "/home",
                            name: 'Home',
                            meta: { title: "项目管理", icon: "el-icon-s-home" },
                            alwaysShow: true,
                            children: [
                                {
                                    path: "/home",
                                    hidden: false,
                                    name: "CutProject",
                                    component: () => import("@/views/proManage/cutProject/index"),
                                    meta: { title: "切换项目", icon: "", roles: ['admin'] }
                                },
                                {
                                    path: "/projectHome",
                                    hidden: true,
                                    name: "ProjectHome",
                                    component: () => import("@/views/proManage/projectHome/index"),
                                    meta: { title: "项目首页", icon: "", roles: ['admin'] }
                                },
                                {
                                    path: "/structureManage",
                                    name: 'StructureManage',
                                    hidden: true,
                                    redirect: "/mechanismManageList",
                                    component: () => import("@/views/proManage/structureManage/index"),
                                    meta: { title: "机构管理", icon: "", roles: ['admin'] },
                                    children: [
                                        {
                                            path: "/mechanismManageList",
                                            hidden: false,
                                            name: "MechanismManageList",
                                            component: () => import("@/views/proManage/structureManage/mechanismManageList/index"),
                                            meta: { title: "机构人员管理", icon: "", roles: [] },
                                        },
                                        {
                                            path: "/mechanismDetail",
                                            hidden: true,
                                            name: "MechanismDetail",
                                            component: () => import("@/views/proManage/structureManage/mechanismDetail/index"),
                                            meta: { title: "机构人员信息", icon: "", roles: [] },
                                        },
                                        // 
                                        {
                                            path: "/regionManage",
                                            hidden: false,
                                            name: "RegionManage",
                                            component: () => import("@/views/proManage/structureManage/regionManage/index"),
                                            meta: { title: "区域管理", icon: "", roles: [] },
                                        },
                                        {
                                            path: "/regionInfo",
                                            hidden: true,
                                            name: "RegionInfo",
                                            component: () => import("@/views/proManage/structureManage/regionInfo/index"),
                                            meta: { title: "区域信息", icon: "", roles: [] },
                                        },
                                        {
                                            path: "/outletsManage",
                                            hidden: false,
                                            name: "OutletsManage",
                                            component: () => import("@/views/proManage/structureManage/outletsManage/index"),
                                            meta: { title: "网点管理", icon: "", roles: [] },
                                        },
                                        {
                                            path: "/outletsInfo",
                                            hidden: true,
                                            name: "OutletsInfo",
                                            component: () => import("@/views/proManage/structureManage/outletsInfo/index"),
                                            meta: { title: "网点信息", icon: "", roles: [] },
                                        },
                                        {
                                            path: "/dutyManage",
                                            hidden: false,
                                            name: "DutyManage",
                                            component: () => import("@/views/proManage/structureManage/dutyManage/index"),
                                            meta: { title: "职责管理", icon: "", roles: [] },
                                        },
                                        {
                                            path: "/dutyInfo",
                                            hidden: true,
                                            name: "DutyInfo",
                                            component: () => import("@/views/proManage/structureManage/dutyInfo/index"),
                                            meta: { title: "职责信息", icon: "", roles: [] },
                                        },
                                    ],
                                },
                                {
                                    path: "/assessmentManage",
                                    name: 'AssessmentManage',
                                    hidden: true,
                                    redirect: "/cleanerDailyTasks",
                                    alwaysShow: true,
                                    component: () => import("@/views/proManage/assessmentManage/index"),
                                    meta: { title: "考核管理", icon: "" },
                                    children: [
                                        {
                                            path: "/cleanerDailyTasks",
                                            hidden: false,
                                            name: "CleanerDailyTasks",
                                            component: () => import("@/views/proManage/assessmentManage/cleanerDailyTasks/index"),
                                            meta: { title: "保洁日常任务", icon: "" },
                                        },
                                        {
                                            path: "/outletsAssessment",
                                            hidden: false,
                                            name: "OutletsAssessment",
                                            component: () => import("@/views/proManage/assessmentManage/outletsAssessment/index"),
                                            meta: { title: "网点月度考核", icon: "" },
                                        },
                                        {
                                            path: "/outletsCheckRecord",
                                            hidden: false,
                                            name: "OutletsCheckRecord",
                                            component: () => import("@/views/proManage/assessmentManage/outletsCheckRecord/index"),
                                            meta: { title: "网点巡检记录", icon: "" },
                                        },
                                    ],
                                },
                                {
                                    path: "/feedBackManage",
                                    name: 'FeedBackManage',
                                    hidden: true,
                                    redirect: "/cleanUpNeeds",
                                    alwaysShow: true,
                                    component: () => import("@/views/proManage/feedBackManage/index"),
                                    meta: { title: "反馈管理", icon: "" },
                                    children: [
                                        {
                                            path: "/cleanUpNeeds",
                                            hidden: false,
                                            name: "CleanUpNeeds",
                                            component: () => import("@/views/proManage/feedBackManage/cleanUpNeeds/index"),
                                            meta: {
                                                title: "需求管理", icon: ""
                                            },
                                        },
                                        {
                                            path: "/eventReportList",
                                            hidden: false,
                                            name: "EventReportList",
                                            component: () => import("@/views/proManage/feedBackManage/eventReportList/index"),
                                            meta: {
                                                title: "事件上报列表", icon: ""
                                            },
                                        },
                                        {
                                            path: "/complaintList",
                                            hidden: false,
                                            name: "ComplaintList",
                                            component: () => import("@/views/proManage/feedBackManage/complaintList/index"),
                                            meta: {
                                                title: "投诉", icon: ""
                                            },
                                        },
                                    ],
                                },

                                {
                                    path: "/materielManage",
                                    name: 'MaterielManage',
                                    hidden: true,
                                    redirect: "/materialApplicationRecord",
                                    alwaysShow: true,
                                    component: () => import("@/views/proManage/materielManage/index"),
                                    meta: { title: "物料管理", icon: "" },
                                    children: [
                                        {
                                            path: "/materialApplicationRecord",
                                            hidden: false,
                                            name: "MaterialApplicationRecord",
                                            component: () => import("@/views/proManage/materielManage/materialApplicationRecord/index"),
                                            meta: {
                                                title: "物料申请", icon: ""
                                            },
                                        },
                                        {
                                            path: "/materialRecordDetail",
                                            hidden: true,
                                            name: "MaterialRecordDetail",
                                            component: () => import("@/views/proManage/materielManage/materialRecordDetail/index"),
                                            meta: {
                                                title: "物料申请详情", icon: ""
                                            },
                                        },
                                        {
                                            path: "/accountingRecord",
                                            hidden: false,
                                            name: "AccountingRecord",
                                            component: () => import("@/views/proManage/materielManage/accountingRecord/index"),
                                            meta: {
                                                title: "物料核算单记录", icon: ""
                                            },
                                        },
                                        {
                                            path: "/accountingRecordDetail",
                                            hidden: true,
                                            name: "AccountingRecordDetail",
                                            component: () => import("@/views/proManage/materielManage/accountingRecordDetail/index"),
                                            meta: {
                                                title: "物料核算单详情", icon: ""
                                            },
                                        },
                                        {
                                            path: "/outDataList",
                                            hidden: false,
                                            name: "OutDataList",
                                            component: () => import("@/views/proManage/materielManage/outDataList/index"),
                                            meta: {
                                                title: "网点物料列表", icon: ""
                                            },
                                        },
                                        {
                                            path: "/regionDataList",
                                            hidden: false,
                                            name: "RegionDataList",
                                            component: () => import("@/views/proManage/materielManage/regionDataList/index"),
                                            meta: {
                                                title: "区域物料列表", icon: ""
                                            },
                                        },
                                    ],
                                },
                                {
                                    path: "/setUp",
                                    name: 'SetUp',
                                    hidden: true,
                                    redirect: "/outCheckSetUp",
                                    alwaysShow: true,
                                    component: () => import("@/views/proManage/setUp/index"),
                                    meta: { title: "设置", icon: "" },
                                    children: [
                                        {
                                            path: "/outCheckSetUp",
                                            hidden: false,
                                            name: "OutCheckSetUp",
                                            component: () => import("@/views/proManage/setUp/outCheckSetUp/index"),
                                            meta: {
                                                title: "网点巡检配置", icon: ""
                                            },
                                        },
                                        {
                                            path: "/feedBackSetUp",
                                            hidden: false,
                                            name: "FeedBackSetUp",
                                            component: () => import("@/views/proManage/setUp/feedBackSetUp/index"),
                                            meta: {
                                                title: "反馈处理配置", icon: ""
                                            },
                                        },
                                        {
                                            path: "/outAssessmentSetUp",
                                            hidden: false,
                                            name: "OutAssessmentSetUp",
                                            component: () => import("@/views/proManage/setUp/outAssessmentSetUp/index"),
                                            meta: {
                                                title: "网点月考核配置", icon: ""
                                            },
                                        },
                                        {
                                            path: "/materielSetUp",
                                            hidden: false,
                                            name: "MaterielSetUp",
                                            component: () => import("@/views/proManage/setUp/materielSetUp/index"),
                                            meta: {
                                                title: "物料配置", icon: ""
                                            },
                                        },
                                        {
                                            path: "/materielBatchSetUp",
                                            hidden: false,
                                            name: "MaterielBatchSetUp",
                                            component: () => import("@/views/proManage/setUp/materielBatchSetUp/index"),
                                            meta: {
                                                title: "物料批次配置", icon: ""
                                            },
                                        },
                                    ]
                                },
                            ],
                        },
                        {
                            path: "/sManage",
                            name: "SManage",
                            component: () => import("@/layout/index"),
                            redirect: "/staffManage",
                            meta: { title: "人事管理", icon: "el-icon-s-home" },
                            alwaysShow: true,
                            children: [
                                {
                                    path: "/staffManage",
                                    hidden: false,
                                    name: "StaffManage",
                                    component: () => import("@/views/perManage/staffManage/index"),
                                    meta: { title: "员工管理", icon: "" },
                                },
                                {
                                    path: "/staffInfo",
                                    hidden: true,
                                    name: "StaffInfo",
                                    component: () => import("@/views/perManage/staffInfo/index"),
                                    meta: {
                                        title: "员工信息", icon: ""
                                    },
                                },
                                {
                                    path: "/checkAssessList",
                                    hidden: false,
                                    name: "CheckAssessList",
                                    component: () => import("@/views/perManage/checkAssessList/index"),
                                    meta: {
                                        title: "巡检考核列表", icon: ""
                                    },
                                },
                                {
                                    path: "/cleanAssessList",
                                    hidden: false,
                                    name: "CleanAssessList",
                                    component: () => import("@/views/perManage/cleanAssessList/index"),
                                    meta: {
                                        title: "保洁考核列表", icon: ""
                                    },
                                },
                                {
                                    path: "/staffAttendanceList",
                                    hidden: false,
                                    name: "StaffAttendanceList",
                                    component: () => import("@/views/perManage/staffAttendanceList/index"),
                                    meta: {
                                        title: "员工考勤列表", icon: ""
                                    },
                                },
                                {
                                    path: "/staffMonthlyEvaluation",
                                    hidden: false,
                                    name: "StaffMonthlyEvaluation",
                                    component: () => import("@/views/perManage/staffMonthlyEvaluation/index"),
                                    meta: {
                                        title: "员工月度考评", icon: ""
                                    },
                                },
                                {
                                    path: "/staffEvaluateConfig",
                                    hidden: false,
                                    name: "StaffEvaluateConfig",
                                    component: () => import("@/views/perManage/staffEvaluateConfig/index"),
                                    meta: {
                                        title: "员工考评配置", icon: ""
                                    },
                                },
                                {
                                    path: "/institutionApplyList",
                                    hidden: false,
                                    name: "InstitutionApplyList",
                                    component: () => import("@/views/perManage/institutionApplyList/index"),
                                    meta: {
                                        title: "机构申请排班记录", icon: ""
                                    },
                                },
                                {
                                    path: "/temporaryArrangeList",
                                    hidden: false,
                                    name: "TemporaryArrangeList",
                                    component: () => import("@/views/perManage/temporaryArrangeList/index"),
                                    meta: {
                                        title: "临时排班记录", icon: ""
                                    },
                                },  // 
                                {
                                    path: "/leaveApplyList",
                                    hidden: false,
                                    name: "LeaveApplyList",
                                    component: () => import("@/views/perManage/leaveApplyList/index"),
                                    meta: {
                                        title: "请假申请记录", icon: ""
                                    },
                                },
                            ],
                        },
                        {
                            path: "/systemManage",
                            component: () => import("@/layout/index"),
                            redirect: "/userManage",
                            name: "SystemManage",
                            meta: { title: "系统管理", icon: "el-icon-s-home" },
                            alwaysShow: true,
                            children: [
                                {
                                    path: "/userManage",
                                    hidden: false,
                                    name: "UserManage",
                                    component: () => import("@/views/systemManage/userManage/index"),
                                    meta: { title: "用户管理", icon: "" },
                                },
                                {
                                    path: "/menuManage",
                                    hidden: false,
                                    name: "MenuManage",
                                    component: () => import("@/views/systemManage/menuManage/index"),
                                    meta: { title: "菜单管理", icon: "" },
                                },
                                {
                                    path: "/roleManage",
                                    hidden: false,
                                    name: "RoleManage",
                                    component: () => import("@/views/systemManage/roleManage/index"),
                                    meta: { title: "角色管理", icon: "" },
                                },
                                {
                                    path: "/departmentManage",
                                    hidden: false,
                                    name: "DepartmentManage",
                                    component: () => import("@/views/systemManage/departmentManage/index"),
                                    meta: { title: "部门管理", icon: "" },
                                },
                            ]
                        },
                        {
                            path: "/equipmentManage",
                            component: () => import("@/layout/index"),
                            redirect: "/inventoryRecord",
                            name: "EquipmentManage",
                            meta: { title: "设备管理", icon: "el-icon-s-home" },
                            alwaysShow: true,
                            children: [
                                {
                                    path: "/inventoryRecord",
                                    hidden: false,
                                    name: "InventoryRecord",
                                    component: () => import("@/views/equipmentManage/inventoryRecord/index"),
                                    meta: { title: "固定资产盘点", icon: "" },
                                },
                                {
                                    path: "/deviceInfo",
                                    hidden: false,
                                    name: "DeviceInfo",
                                    component: () => import("@/views/equipmentManage/deviceInfo/index"),
                                    meta: { title: "设备信息", icon: "" },
                                },
                                {
                                    path: "/mechanicCheck",
                                    hidden: false,
                                    name: "MechanicCheck",
                                    component: () => import("@/views/equipmentManage/mechanicCheck/index"),
                                    meta: { title: "机器保养检查", icon: "" },
                                },
                                {
                                    path: "/equipmentRepair",
                                    hidden: false,
                                    name: "EquipmentRepair",
                                    component: () => import("@/views/equipmentManage/equipmentRepair/index"),
                                    meta: { title: "设备报修", icon: "" },
                                },
                                {
                                    path: "/equipmentScrapping",
                                    hidden: false,
                                    name: "EquipmentScrapping",
                                    component: () => import("@/views/equipmentManage/equipmentScrapping/index"),
                                    meta: { title: "设备报废", icon: "" },
                                },
                            ]
                        },
                    ];
                    commit('SET_ROUTES', resData)
                    resolve(resData)
                }
            })
        });
    },
    getInfo({ commit }) {
        commit('SET_ROLES', ['admin'])
        // console.log("commit('SET_ROLES', ['admin'])")
    },
    setShowMenu({ commit }, data) {
        commit('SET_SHOW_MENU', data)
    },
    clearRoles({ commit }) {
        commit('CLEAR_ROLES')
    },
    showAddRoutes({ commit, state }) {
        // const newRoute = JSON.parse(
        //     JSON.stringify(state.routes)
        // );
        // newRoute[2].children.forEach((item) => {
        //     item.hidden = false;
        // });
        // commit('SHOW_ADD_ROUTERS', newRoute)
        commit('SHOW_ADD_ROUTERS')


    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
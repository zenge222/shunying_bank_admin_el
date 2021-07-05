import request from '@/utils/requests'
import api from '@/api/apiConfig'

// 获取预约列表
export function _bankListData() {
    return request(api.getBankList);
}

export function _topInfo(data) {
    return request(api.getTopInfo, data);
}

// 项目列表
export function _getProjectList() {
    return request('project/list', 'get');
}

// 项目-首页
export function _getProjectHome(data) {
    return request('/project/home', 'get', data);
}

// 图片上传
export function _uploadPic(data) {
    return request('config/upload/image', 'post', data);
}

// 项目配型
export function _getProTypeList() {
    return request('project/type/list');
}

// 项目经理别表
export function _getProManagerList() {
    return request('project/projectManager/list');
}

// 项目-添加(修改)
export function _addRoEditPro(data) {
    return request('project/add', 'post', data);
}

// 机构人员管理-添加-员工身份
export function _getIdentityList() {
    return request('orgEmployee/userType/list');
}

// 机构人员管理-添加-区域列表
export function _getorgEmployeeAreaList(id) {
    return request('orgEmployee/area/list' + '?projectId=' + id, 'get');
}

// 机构人员管理-添加-网点列表
export function _getorgEmployeeOrgBranchList(id) {
    return request('orgEmployee/orgBranch/list' + '?areaId=' + id);
}
// 机构人员管理-列表
export function _getOrgEmployeeList(data) {
    return request('orgEmployee/orgEmployee/list', 'get', data);
}

// 机构人员管理-添加
export function _orgEmployeeAdd(data) {
    return request('orgEmployee/orgEmployee/add', 'post', data);
}

// 机构人员管理-修改
export function _orgEmployeeEdit(data) {
    return request('orgEmployee/orgEmployee/update', 'post', data);
}

// 机构人员管理-删除
export function _orgEmployeeDel(id) {
    return request('orgEmployee/orgEmployee/delete' + '?id=' + id, 'get');
}

// 机构人员管理-详情
export function _orgEmployeeDetail(id) {
    return request('orgEmployee/orgEmployee/detail' + '?id=' + id);
}

// 区域-列表
export function _getAreaList(data) {
    return request('area/list', '', data);
}

// 区域-删除
export function _areaDel(id) {
    return request('area/delete' + '?id=' + id, 'get');
}

// 区域-详情
export function _areaDetail(id) {
    return request('area/detail' + '?id=' + id, 'get');
}

// 区域-添加-区域经理
export function _areaManagerListDetail() {
    return request('area/areaManager/list');
}

// 区域-修改
export function _areaUpdate(data) {
    return request('area/update', 'post', data);
}

// 区域-添加
export function _areaAdd(data) {
    return request('area/add', 'post', data);
}

// 网点-列表
export function _getOrgBranchList(data) {
    return request('orgBranch/list', 'get', data);
}

// 网点-编辑-所属区域
export function _getOrgBranchAreaList(id) {
    return request('orgBranch/area/list' + '?projectId=' + id);
}

// 网点-删除
export function _orgBranchDel(id) {
    return request('orgBranch/delete' + '?id=' + id, 'get');
}

// 网点-编辑-巡检员
export function _getAreaLeaderList() {
    return request('orgBranch/areaLeader/list', 'get');
}

// 网点-详情
export function _orgBranchDetail(id) {
    return request('orgBranch/detail' + '?id=' + id);
}

// 网点-添加（修改）
export function _orgBranchAddEdit(data) {
    return request('orgBranch/add', 'post', data);
}

// 职责-添加-所属网点
export function _getTaskBranchAreaList(id) {
    return request('task/orgBranch/list' + '?projectId=' + id);
}

// 职责-添加-驻点员工
export function _getTaskUserList(data) {
    return request('task/user/list', "get", data);
}


// 职责-列表
export function _getTaskList(data) {
    return request('task/list', 'get', data);
}

// 职责-详情
export function _orgTaskDetail(id) {
    return request('task/detail' + '?id=' + id);
}

// 职责-删除
export function _taskDel(id) {
    return request('task/delete' + '?id=' + id, 'get');
}

// 职责-添加
export function _taskAdd(data) {
    return request('task/add', 'post', data);
}

// 职责-编辑
export function _taskUpdate(data) {
    return request('task/update', 'post', data);
}

// 保洁日常任务-状态
export function _getAccessStatusList() {
    return request('orgBranchAccess/status/list', 'get');
}

// 保洁日常任务-列表
export function _getTaskItemRecordList(data) {
    return request('orgBranchAccess/taskItemRecord/list', 'get', data);
}

// 网点月度考核-列表-满意度
export function _getSatisfactionList() {
    return request('orgBranchAccess/satisfaction/list', 'get');
}

// 网点月度考核-列表
export function _getBranchAssessRecordList(data) {
    return request('orgBranchAccess/branchAssessRecord/list', 'get', data);
}

// 保洁日常任务-详情
export function _taskItemRecordDetail(id) {
    return request('orgBranchAccess/taskItemRecord/detail' + '?id=' + id);
}

// 网点巡检记录-列表
export function _getOrgCheckRecordList(data) {
    return request('orgBranchAccess/orgCheckRecord/list', 'get', data);
}

// 清理需求-列表
export function _getFeedbackList(data) {
    return request('feedback/feedback/list', 'get', data);
}

// 清理需求-列表-状态
export function _getFeedbackStatusList() {
    return request('feedback/feedback/status/list', 'get');
}
//清理需求-详情
export function _getFeedbackStatusDetail(data) {
    return request('/feedback/feedback/detail', 'get', data)
}
// 网点月度考核-详情
export function _branchAssessRecordDetail(id) {
    return request('orgBranchAccess/branchAssessRecord/detail' + '?id=' + id);
}

// 网点巡检记录-详情
export function _orgCheckRecordDetail(id) {
    return request('orgBranchAccess/orgCheckRecord/detail' + '?id=' + id);
}

// 事件上报-列表-状态
export function _getEmergencyStatusList() {
    return request('feedback/emergency/status/list', 'get');
}

// 事件上报-列表
export function _getEmergencyList(data) {
    return request('feedback/emergency/list', 'get', data);
}

//事件上报-详情
export function _getEmergencyDetail(data) {
    return request('/feedback/emergency/detail', 'get', data)
}

// 投诉-列表
export function _getAdviceFeedbackList(data) {
    return request('feedback/adviceFeedback/list', 'get', data);
}

//投诉详情
export function _getAdviceFeedbackDetail(data) {
    return request('/feedback/adviceFeedback/detail', 'get', data)
}

// 事件上报-列表-状态
export function _getToolsApplyStatusList() {
    return request('tools/toolsApplyStatus/list', 'get');
}

// 物料申请-列表
export function _getToolsApplyList(data) {
    return request('tools/toolsApply/list', 'get', data);
}

// 各区域物料使用情况
export function _getHomeAreaInfo(data) {
    return request('project/home/area/tools/info', 'get', data);
}

// 项目-首页-网点月评比例
export function _getHomeAssess(data) {
    return request('project/home/assess', 'get', data);
}

// 物料批次
export function _getHomeToolsBatch(data) {
    return request('project/toolsBatch/list', 'get', data);
}

// 各批次物料成本
export function _getHomeToolsBatchTools(data) {
    return request('project/home/toolsBatch/tools/info', 'get', data);
}

/*
* <================================================设置模块===============================================>
* */

//网点巡检配置详情
export function inspectionSetting(data) {
    return request('/setting/orgCheckConfig', 'get', data)
}
//网点巡检配置修改
export function editInspection(data) {
    return request('/setting/orgCheckConfig/update', 'post', data)
}

//反馈处理配置详情
export function feedBackDetail(data) {
    return request('/setting/feedbackConfig', 'get', data)
}
//反馈处理配置修改
export function editFeedBack(data) {
    return request('/setting/feedbackConfig/update', 'post', data)
}
//网点月考核配置详情
export function siteAssessment(data) {
    return request('/setting/branchAssessStandard', 'get', data)
}
//网点月考核修改
export function editSiteAssessment(data) {
    return request('/setting/branchAssessStandard/update', 'post', data)
}

//物料配置添加 （修改）
export function addMaterial(data) {
    return request('/setting/tools/add', 'post', data)
}
//物料配置删除
export function delMaterial(data) {
    return request('/setting/tools/delete', 'get', data)
}
//物料配置列表
export function materialList(data) {
    return request('/setting/tools/list', 'get', data)
}
//物料批次配置（添加）
export function addMaterialBatch(data) {
    return request('/setting/toolsBatch/add', 'post', data)
}
//物料批次配置（删除）
export function delMaterialBatch(data) {
    return request('/setting/toolsBatch/delete', 'get', data)
}
// 物料批次配置（列表）
export function materialBatchList(data) {
    return request('/setting/toolsBatch/list', 'get', data)
}
// 物料批次配置（修改）
export function editMaterialBatch(data) {
    return request('/setting/toolsBatch/update', 'post', data)
}








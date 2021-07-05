import request from '@/utils/requests'
import da from "element-ui/src/locale/lang/da";

/*
* <================================================员工管理模块===============================================>
* */

//员工添加
export function addEmployee(data) {
    return request('/employee/add', 'post', data)
}
//员工删除
export function delEmployee(data) {
    return request('/employee/delete', 'get', data)
}
//员工详情
export function employeeDetail(data) {
    return request('/employee/detail', 'get', data)
}
//员工列表
export function employeeList(data) {
    return request('/employee/list', 'get', data)
}
//员工修改
export function editEmployee(data) {
    return request('/employee/update', 'post', data)
}
//性别
export function getSex() {
    return request('/employee/gender/list', 'get')
}
//身份
export function getIdentity() {
    return request('/employee/type/list', 'get')
}
//获取所属项目列表
export function belongsProject() {
    return request('/common/project/list', 'post')
}
// 省市区联动获取
export function provincePackage(data) {
    return request('/common/address/list', 'get', data)
}

/*
* <================================================巡检考核列表===============================================>
* */
//巡检考核列表
export function getInspectionList() {
    return request('/employeeAssess/areaLeader/workInfo/list', 'get')
}
//巡检考核详情
export function getInspectionDetails(data) {
    return request('/employeeAssess/areaLeader/workInfo/detail', 'get', data)
}

/*
* <================================================物料管理===============================================>
* */
//物料申请列表
export function applyMaterial(data) {
    return request('/tools/toolsApply/list', 'get', data)
}

//物料申请详情
export function detailMaterial(data) {
    return request('/tools/apply/detail', 'get', data)
}

//物料审核状态
export function materialStatus() {
    return request('/tools/toolsApplyStatus/list', 'get')
}

//物料核算单列表
export function materialCheckReal(data) {
    return request('/tools/toolsCheckRecord/list', 'get', data)
}

//物料核算单详情

export function materialCheckDetail(data) {
    return request('/tools/toolsCheckRecord/detail', 'get', data)
}
//物料核算单 审核状态

export function materialCheckStatus() {
    return request('/tools/toolsCheckRecordStatus/list', 'get')
}

//网点物料列表
export function getBranchesList(data) {
    return request('/tools/orgBranchToolsInfo/list', 'get', data)
}

//区域物料列表
export function getAreaMaterialList(data) {
    return request('/tools/areaToolsInfo/list', 'get', data)
}

//物料批次
export function getMaterialBatch(data) {
    return request('/tools/toolsBatch/list', 'get', data)
}


//巡检考核列表
export function getInspectionAssessmentList(data) {
    return request('/employeeAssess/areaLeader/workInfo/list', 'get', data)
}

//巡检考核详情
export function getInspectionAssessmentDetail(data) {
    return request('/employeeAssess/areaLeader/workInfo/detail', 'get', data)
}

// 保洁考核列表
export function assessmentCleaningList(data) {
    return request('/employeeAssess/cleaner/workInfo/list', 'get', data)
}

//保洁考核详情
export function assessmentCleaningDetail(data) {
    return request('/employeeAssess/cleaner/workInfo/detail', 'get', data)
}

//员工考勤列表
export function attendanceList(data) {
    return request('/employeeAssess/attendanceRecord/list', 'get', data)
}

//员工月度考评列表
export function monthlyReviewList(data) {
    return request('/employeeAssess/cleanerAssess/list', 'get', data)
}

//员工月度考评详情
export function monthlyReviewDetail(data) {
    return request('/employeeAssess/cleanerAssess/detail', 'get', data)
}
//员工考评配置
export function staffAppraisalSetting() {
    return request('/employeeAssess/cleanerAssess/config/detail', 'get')
}
//员工考评配置修改
export function editStaffAppraisalSetting(data) {
    return request('/employeeAssess/cleanerAssess/config/update', 'post', data)
}

//临时排班记录
export function temporarySchedulingList(data) {
    return request('/taskRequest/list', 'get', data)
}
//所属项目
export function belongProject() {
    return request('/common/project/list', 'post')
}
//请假申请记录列表
export function getOffTheList(data) {
    return request('/taskRequest/workOffApply/list', 'get', data)
}
//请假申请详情
export function getOffDetail(data) {
    return request('/taskRequest/workOffApply/detail', 'get', data)
}

//请假状态
export function getOffStatus() {
    return request('/taskRequest/workOffApply/status/list', 'get')
}

//请假类型
export function getOffType() {
    return request('/taskRequest/workOffApply/type/list', 'get')
}

// 物料申请导出
export function _exporToolsApplyList(data) {
    return request('tools/toolsApply/list/export', 'get',data);
}

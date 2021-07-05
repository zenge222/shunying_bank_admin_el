import request from '@/utils/requests'
import api from '@/api/apiConfig'

// 用户列表
export function _menuUserList(data) {
    return request('menuSetting/admin/list', 'get', data)
}

// 部门列表
export function _departmentList(data) {
    return request('menuSetting/department/list', 'get', data)
}

// 部部门详情
export function _departmentDetail(id) {
    return request('menuSetting/department/detail' + '?id=' + id, 'get')
}

// 部门删除
export function _departmentDelete(id) {
    return request('menuSetting/department/delete' + '?id=' + id, 'get')
}

// 部门添加（修改）
export function _departmentAddEdit(data) {
    return request('menuSetting/department/add', 'post', data)
}

// 菜单添加（修改）
export function _menuAddEdit(data) {
    return request('menuSetting/menu/add', 'post', data)
}

// 菜单列表(全部)
export function _menuList() {
    return request('menuSetting/menu/list', 'get')
}

// 菜单删除
export function _menuDelete(id) {
    return request('menuSetting/menu/delete' + '?id=' + id, 'get')
}

// 菜单删除
export function _roleList(data) {
    return request('menuSetting/role/list', 'get', data)
}

// 菜单添加（修改）
export function _roleAddEdit(data) {
    return request('menuSetting/role/add', 'post', data)
}

// 角色删除
export function _roleDelete(id) {
    return request('menuSetting/role/delete' + '?id=' + id, 'get')
}

// 用户删除
export function _userDelete(id) {
    return request('menuSetting/admin/delete' + '?id=' + id, 'get')
}

// 用户添加（修改）
export function _userAddEdit(data) {
    return request('menuSetting/admin/add', 'post', data)
}

// 密码修改
export function _changePassword(data) {
    return request('menuSetting/admin/password', 'get', data)
}

// 固定资产盘点-盘点人列表
export function _areaManagerList() {
    return request('equipment/areaManager/list', 'get')
}

// 固定资产盘点-记录情况
export function _propertyCheckRecordList() {
    return request('equipment/propertyCheckRecord/status', 'get')
}

// 固定资产盘点-列表
export function _checkRecordList(data) {
    return request('equipment/propertyCheckRecord/list', 'get', data)
}

// 固定资产盘点-详情
export function _checkRecordDetail(id) {
    return request('equipment/propertyCheckRecord/detail' + '?id=' + id, 'get')
}

// 设备信息-类型
export function _equipmentTypeList() {
    return request('equipment/type', 'get')
}

// 设备信息-责任人
export function _dutyPersonList() {
    return request('equipment/duty/person', 'get')
}

// 设备信息-状态
export function _equipmentStatusList() {
    return request('equipment/status', 'get')
}

// 设备信息-列表
export function _equipmentList(data) {
    return request('equipment/list', 'get', data)
}

// 所属项目
export function _belongProject() {
    return request('common/project/list', 'post')
}

// 根据项目id获取网点
export function _orgBranchList(id) {
    return request('common/orgBranch/list' + '?projectId=' + id, 'get')
}

// 设备信息-新增（修改）
export function _equipmentAddEdit(data) {
    return request('equipment/add', 'post', data)
}

// 设备信息-删除
export function _equipmentDel(id) {
    return request('equipment/delete' + '?id=' + id, 'get')
}

// 机器保养检查-列表
export function _mechanicCheckList(data) {
    return request('equipment/equipmentMaintainRecord/list', 'get', data)
}


// 设备报修-状态
export function _equipmentReportStatusList() {
    return request('equipment/equipmentReport/status', 'get')
}

// 设备报修-列表
export function _equipmentReportList(data) {
    return request('equipment/equipmentReport/list', 'get', data)
}

// 设别报废-状态
export function _equipmentScrapRecordStatusList() {
    return request('equipment/equipmentScrapRecord/status', 'get')
}

// 设备设别报废-列表
export function _equipmentScrapRecordList(data) {
    return request('equipment/equipmentScrapRecord/list', 'get', data)
}


// 获取指定用户菜单
export function _userMenus(id) {
    return request('menuSetting/user/menu' + '?id=' + id, 'get')
}

// 自定义工作-列表
export function _intervalTaskList(data) {
    return request('intervalTask/intervalTask/list', 'get', data)
}

// 自定义工作-添加（编辑）
export function _intervalTaskAddEdit(data) {
    return request('intervalTask/intervalTask/add', 'get', data)
}

// 自定义工作-删除
export function _intervalTaskDel(id) {
    return request('intervalTask/delete' + '?id=' + id, 'get')
}

// 自定义工作-详情
export function _intervalTaskDetail(id) {
    return request('intervalTask/intervalTask/detail' + '?id=' + id, 'get')
}

// 保洁员-列表
export function _intervalTaskCleanerList() {
    return request('intervalTask/cleaner/list', 'get')
}

// 人员-添加
export function _intervalTaskCleanerAddEdit(data) {
    return request('intervalTask/intervalTaskCleaner/add', 'get', data)
}

// 人员-删除
export function _intervalTaskCleanerUpdate(data) {
    return request('intervalTask/intervalTaskCleaner/update', 'get', data)
}

// 工作项-添加
export function _intervalTaskItemAdd(data) {
    return request('intervalTask/intervalTaskItem/add', 'post', data)
}

// 工作项-删除
export function _intervalTaskItemUpdate(data) {
    return request('intervalTask/intervalTaskItem/update', 'get', data)
}












































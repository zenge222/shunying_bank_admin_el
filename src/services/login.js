import request from '@/utils/requests'
import api from '@/api/apiConfig'

// 登录
// export function _login(data) {
//     return request(api.getTopInfo, 'get', data);
// }

export function _login(data) {
    return request('common/login', 'get', data);
}

export function _logout() {
    return request('project/list', 'get')
}





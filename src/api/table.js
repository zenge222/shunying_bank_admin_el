import service from '@/utils/request'

export function getList(data) {
    return service({
        url: '/addValueService/discount/list',
        method: 'post',
        data
    })
}

export function getApplyRefundIndent(data) {
    return service({
        url: '/applyRefund/Indent/list',
        method: 'post',
        data
    })
}

export function getVipUserList(data) {
    return service({
        url: '/vipManage/user/list',
        method: 'post',
        data
    })
}

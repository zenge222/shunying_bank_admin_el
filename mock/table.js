const Mock = require('mockjs')
const Random = Mock.Random //获取mock.random对象

const data = Mock.mock({
    'items|30': [{
        id: '@id',
        title:Random.csentence(10, 20),
        // 'status|1': ['published', 'draft', 'deleted'],
        // author: 'name',
        // display_time: '@datetime',
        // pageviews: '@integer(300, 5000)',
        dec:Random.csentence(10, 20),
        limit:'@integer(100,200)',
        discount:'@integer(10,20)',
        'type|1': ['直减', '满减'],
        startTime:'@datetime',
        endTime:'@datetime'
    }]
})

const list = Mock.mock({
    'items|120': [{
        id: '@id',
        number: Random.natural(1000000000000, 2000000000000000),//预约编号
        projectContent: Random.csentence(5, 6),//服务项目
        appointServer: Random.cname(),//预约服务师
        linkName: Random.cname(),//联系人姓名
        linkPhone: '13971359714',//联系人电话
        trueName: Random.cname(),//用户真实姓名
        interviewFaceStartTime: Random.date() + ' ' + Random.time(),//面试开始时间
        interviewFaceEndTime: Random.date() + ' ' + Random.time(),//面试结束时间
        interviewFaceAddress: Random.csentence(7, 10),//面试地点
        applyTime: Random.date(),//申请时间
        statusIndent: '已付款'
    }]
})

const userList = Mock.mock({
    'items|120': [{
        id: '@id',
        nickName:Random.cname(),//昵称
        number: Random.natural(1000000000000, 2000000000000000),//身份证号
        telPhone: '13971359714',//联系人电话
        trueName: Random.cname(),//用户真实姓名
        signTime: Random.date() + ' ' + Random.time(),//申请时间
    }]
})
module.exports = [
    {
        url: '/addValueService/discount/list',
        type: 'post',
        response: config => {
            let obj = config.body
            let tableData = data.items.slice(obj.page,obj.pageSize)
            return {
                code: 20000,
                data: {
                    total: data.items.length,
                    items: tableData
                }
            }
        }
    },
    {
        url: '/applyRefund/Indent/list',
        type: 'post',
        response:config => {
            let data = config.body
            let tableData = list.items.slice(data.page,data.pageSize)
            return {
                code: 20000,
                data:{
                    total: list.items.length,
                    list: tableData
                }
            }
        }
    },
    {
        url: '/vipManage/user/list',
        type: 'post',
        response:config => {
            let data = config.body
            let tableData = userList.items.slice(data.page,data.pageSize)
            return {
                code: 20000,
                data:{
                    total: userList.items.length,
                    list: tableData
                }
            }
        }
    }
]



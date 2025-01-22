import request from '/src/utils/axios/request.js'

// 项目主管顶部展示请求
export function PMTopInfo(params) {
    return request({
        url: '/project/analysis/project/purchase/top',
        method: 'get',
        params
    })
}

// 项目类型统计
export function PMProjectType(params) {
    return request({
        url: 'project/analysis/project/purchase',
        method: 'get',
        params
    })
}

//分组柱状图
export function PMProjectGroup(params) {
    return request({
        url: '/project/analysis/project/purchase/type',
        method: 'get',
        params
    })
}

//表格数据

export function PMProjectTable(params) {
    return request({
        url: '/project/analysis/project/purchase/table',
        method: 'get',
        params
    })
}

// 首页库存
export function WareHouseIndex() {
    return request({
        url: '/project/warehouse/statistic/byProject',
        method: 'get'
    })
}

import request from '/src/utils/axios/request.js'


// 顶部5个统计方块数据
export function statistics(query) {
  return request({
    url: '/project/analysis/first/page',
    method: 'get',
    params: query
  })
}

// 支出统计
export function managerCost(query) {
  return request({
    url: '/project/analysis/manager/cost',
    method: 'get',
    params: query
  })
}

// 收支统计
export function firstInOut(query) {
  return request({
    url: '/project/analysis/first/in/out',
    method: 'get',
    params: query
  })
}


// 商机统计
export function businessSale(query) {
  return request({
    url: '/project/analysis/business/sale',
    method: 'get',
    params: query
  })
}

// 报表分析总查询
export function analystList(query) {
  return request({
    url: '/project/project/analyst',
    method: 'get',
    params: query
  })
}

// 折线图
export function getLineAnasylt(query) {
  return request({
    url: '/project/project/getLine',
    method: 'get',
    params: query
  })
}

// 导出
export function getExcelAnasylt(query) {
  return request({
    url: '/project/project/getExcelAnalyst',
    method: 'get',
    params: query
  })
}

// 项目条形图
export function getBarAnasylt(query) {
  return request({
    url: '/project/project/getBar',
    method: 'get',
    params: query
  })
}

// 总计条形图
export function getBarTotalAnasylt(query) {
  return request({
    url: '/project/project/getBarTotal',
    method: 'get',
    params: query
  })
}

// 区域分析
export function areaList(query) {
  return request({
    url: '/project/project/getArea',
    method: 'get',
    params: query
  })
}

// 项目时间分析
export function projectAnalyst(query) {
  return request({
    url: '/project/project/export/projectAnalyst',
    method: 'get',
    params: query
  })
}

// 项目人工分析
export function AnalystProjectLabor(query) {
  return request({
    url: '/project/labor/analystLabor',
    method: 'get',
    params: query
  })
}

// 项目人工总金额
export function AnalystProjectLaborTotal(query) {
  return request({
    url: '/project/labor/analystTotalLabor',
    method: 'get',
    params: query
  })
}

// 项目人工柱状图
export function AnalystProjectLaborPie(query) {
  return request({
    url: '/project/labor/analystLaborPie',
    method: 'get',
    params: query
  })
}

// 项目资金计划收入
export function AnalystProjectFundIn(query) {
  return request({
    url: '/project/income/analystFundIn',
    method: 'get',
    params: query
  })
}

// 项目资金计划支出
export function AnalystProjectFundOut(query) {
  return request({
    url: '/project/outcome/analystFundOut',
    method: 'get',
    params: query
  })
}

// 项目资金计划饼状图
export function AnalystProjectFundPie(query) {
  return request({
    url: '/project/fund/analystFund',
    method: 'get',
    params: query
  })
}

// 项目资金计划总计
export function AnalystProjectFundTotal(query) {
  return request({
    url: '/project/fund/analystFundTotal',
    method: 'get',
    params: query
  })
}

// 项目实际收款
export function AnalystProjectPaymentIn(query) {
  return request({
    url: '/project/real/analystReal',
    method: 'get',
    params: query
  })
}

// 项目支出
export function AnalystProjectPaymentOut(query) {
  return request({
    url: '/project/project/analyst/realOut',
    method: 'get',
    params: query
  })
}

// 项目收支总计
export function AnalystProjectPaymentTotal(query) {
  return request({
    url: '/project/project/analyst/total',
    method: 'get',
    params: query
  })
}

// 区域借款
export function AnalystProjectLoan(query) {
  return request({
    url: '/project/loan/total/loanAnalyst',
    method: 'get',
    params: query
  })
}

// 项目类型统计
export function ProjectType(query) {
  return request({
    url: '/project/project/analyst/project/type',
    method: 'get',
    params: query
  })
}

// 项目区域统计
export function ProjectRegion(query) {
  return request({
    url: '/project/project/analyst/project/region',
    method: 'get',
    params: query
  })
}

// 当前收支情况
export function analysisInOutCome(query) {
  return request({
    url: '/project/project/analysis/income',
    method: 'get',
    params: query
  })
}

// 收款情况：已收款、未收款
export function analysisInComeLeft(query) {
  return request({
    url: '/project/project/analysis/income/left',
    method: 'get',
    params: query
  })
}

// 公司总计人工情况饼图
export function companyLaborPie(query) {
  return request({
    url: '/project/project/company/area/pie',
    method: 'get',
    params: query
  })
}

// 公司总计人工情况柱状图
export function companyLaborBie(query) {
  return request({
    url: '/project/project/company/area/bie',
    method: 'get',
    params: query
  })
}

// 公司总计人工情况饼图表格
export function companyLaborTablePie(query) {
  return request({
    url: '/project/project/company/area/labor/table/pie',
    method: 'get',
    params: query
  })
}

// 公司总计人工情况柱状图表格
export function companyLaborTableBie(query) {
  return request({
    url: '/project/project/company/area/labor/table/bie',
    method: 'get',
    params: query
  })
}

// 公司总计资金计划饼装
export function companyPlanTablePie(query) {
  return request({
    url: '/project/project/company/fund/pie',
    method: 'get',
    params: query
  })
}

// 公司总计 计划实际收支情况，表格
export function companyPlanTable(query) {
  return request({
    url: '/project/project/company/plan/table',
    method: 'get',
    params: query
  })
}

// 公司总计 计划实际收支情况，柱状
export function companyPlanBie(query) {
  return request({
    url: '/project/project/company/plan/table/bie',
    method: 'get',
    params: query
  })
}

export function exportAllOut(id) {
  return request({
    url: '/project/project/export/project/allOut/' + id,
    method: 'get'
  })
}
// 主体分析
export function subject(query) {
  return request({
    url: '/project/contract/subject/analysis',
    method: 'get',
    params: query
  })
}

// 主体分析导出
export function subjectExport(query) {
  return request({
    url: '/project/contract/subject/analysis/export',
    method: 'get',
    params: query
  })
}

// 根据主体名称查询合同
export function subjectCtc(query) {
  return request({
    url: '/project/contract/subject/FindSubjectCtc',
    method: 'get',
    params: query
  })
}

// 根据主体名称查询导出合同
export function subjectCtcExport(query) {
  return request({
    url: '/project/contract/subject/FindSubjectCtc/export',
    method: 'get',
    params: query
  })
}

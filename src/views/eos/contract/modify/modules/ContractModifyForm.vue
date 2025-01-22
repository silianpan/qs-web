<!-- 合同管理表单 -->
<template>
  <div>
    <a-steps v-if="initformData.changeType === '合同变更'" class="contract-modify-step" :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <!-- 合同 -->
    <s-form ref="initformTable" single :formItems="initformItems" :formData="initformData" />
    <s-form v-show="current === 0" ref="formTable" single :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules"> </s-form>
    <div class="s-mt-2 s-mb-2" v-if="initformData.changeType === '合同变更' ? true : false">
      <div class="border">
        <!-- 阶段 -->
        <s-table v-show="current === 1" ref="table" size="default" rowKey="name" :columns="columns" :data="loadData" :showPagination="false"> </s-table>
      </div>
    </div>
    <div v-show="current === 2" style="margin-bottom: 40px">
      <!-- 清单 -->
      <!-- <h2 class="title">合同工程量清单</h2> -->
      <s-table v-show="current === 2" ref="fundsTable" size="default" :rowKey="record => (record.id ? record.id : record.oid)" :columns="contractDetailsColumns" :data="contractDetailsLoadData" :showPagination="false"> </s-table>
    </div>
    <div v-if="initformData.changeType === '合同变更'" class="steps-action">
      <a-button v-if="current > 0" style="margin-left: 8px" @click="current--"> 上一步 </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="current++"> 下一步 </a-button>
      <a-button v-if="current == steps.length - 1" type="primary" @click="handleSubmit"> 保存草稿 </a-button>
      <a-button v-if="current == steps.length - 1" ghost type="primary" @click="handleApply"> 提交申请 </a-button>
    </div>
    <div class="zfBtn" style="text-align: end; margin-top: 30px" v-if="initformData.changeType === '合同作废'">
      <a-button type="primary" @click="handleSubmit"> 保存草稿 </a-button>
      <a-button ghost type="primary" @click="handleApply"> 提交申请 </a-button>
    </div>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { listProjectSimple, treePlanProject } from '/src/api/eos/project/project.js'
import { SForm, STable, Ellipsis } from '/src/components/index.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import { getContractList, contractSaveChange, submitApplyContractModify } from '/src/api/eos/contract/contractModify.js'
import { getContract, queryContract } from '/src/api/eos/contract/contract.js'

export default {
  name: 'Contract',
  components: {
    SForm,
    STable
  },
  props: {
    // 是否更新表单
    isUpdate: {
      type: Boolean,
      default: false
    },
    // 表单更新数据
    updateRow: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    steps() {
      return this.formData.type === '收入合同'
        ? [
            {
              title: '合同基本信息'
            },
            {
              title: '收款阶段'
            },
            {
              title: '合同清单'
            }
          ]
        : [
            {
              title: '合同基本信息'
            },
            {
              title: '付款阶段'
            },
            {
              title: '合同清单'
            }
          ]
    }
  },
  data() {
    return {
      current: 0,
      formData: {},
      // 合同阶段列
      columns: [
        {
          title: '#',
          dataIndex: 'sn',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.sn} placeholder="请输入" min={0} precision={0} />
          }
        },
        {
          title: '阶段名称',
          dataIndex: 'name',
          align: 'center',
          width: 160,
          customRender: (text, record, index) => {
            return (
              <a-input v-model={record.name} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-input>
            )
          }
        },
        {
          title: '阶段内容',
          dataIndex: 'content',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.content} autoSize={{ minRows: 3 }} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },
        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                onBlur={() => {
                  if (this._.isNil(this.formData.sum) || this.formData.sum === 0) {
                    this.$message.error('请填写合同金额')
                    return
                  }
                  this.contractStages[index].percent = (record.money / this.formData.sum) * 100
                }}
                v-model={record.money}
                placeholder="请输入"
                min={0}
                precision={2}
              />
            )
          }
        },
        {
          title: '比例(%)',
          dataIndex: 'percent',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                onBlur={() => {
                  if (this._.isNil(this.formData.sum) || this.formData.sum === 0) {
                    this.$message.error('请填写合同金额')
                    return
                  }
                  this.contractStages[index].money = (record.percent / 100) * this.formData.sum
                }}
                v-model={record.percent}
                placeholder="请输入"
                min={0}
                precision={2}
              />
            )
          }
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          align: 'center',
          width: 260,
          customRender: (text, record, index) => {
            return text ? (
              <a-date-picker value={moment(text)} onChange={(date, dateString) => (record.endDate = date.format('YYYY-MM-DD HH:mm:ss'))} placeholder="截止日期" />
            ) : (
              <a-date-picker onChange={(date, dateString) => (record.endDate = date.format('YYYY-MM-DD HH:mm:ss'))} placeholder="截止日期" />
            )
          }
        }
      ],
      // 合同阶段
      contractStages: [],
      loadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.contractStages,
            totalCount: this.contractStages.length
          }
        })
      },
      dictKeys: [dictConfig.CONTRACT_TYPE],
      merchantList: [],
      projectList: [],
      contractList: [],
      initformItems: [
        [
          {
            type: 'radio',
            label: '变更类型',
            prop: 'changeType',
            colspan: 4,
            options: [
              {
                dictValue: '合同变更',
                dictLabel: '合同变更'
              },
              {
                dictValue: '合同作废',
                dictLabel: '合同作废'
              }
            ],
            compProps: {
              on: {
                change: e => {
                  this.formData = {}
                  this.initformData = {
                    changeType: e.target.value
                  }
                  this.formData.changeType = e.target.value
                  if (e.target.value === '合同变更') {
                    this.formItems = this.formItemsModifyForm
                  } else {
                    this.formItems = [
                              [
                                {
                                  type: 'inputTextArea',
                                  prop: 'changeReason',
                                  label: '变更原因',
                                  colspan: 8,
                                  formItemProps: {
                                    props: {
                                      labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                                      wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
                                    }
                                  }
                                }
                              ]
                    ]
                  }
                }
              }
            },
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ],
        [
          {
            type: 'treeSelect',
            label: '所属项目',
            prop: 'projectId',
            options: () => this.projectList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            compProps: {
              on: {
                select: value => {
                  // 切换后清空
                  delete this.initformData.id
                  /* 根据项目ID查合同 */
                  getContractList({ projectId: value }).then(res => {
                    this.contractList = res.data
                  })
                }
              }
            }
          },
          {
            type: 'select',
            label: '合同名称',
            prop: 'id',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.contractList,
            compProps: {
              on: {
                select: value => {
                  const filterContract = this.contractList.filter(item => item.id === value)[0]
                  if (this.formData.changeType === '合同变更') {
                    this.formData = { ...filterContract, ...this.initformData }
                    this.formData.signingDate = !this.isEmpty(this.formData.signingDate) ? moment(this.formData.signingDate) : ''
                    this.formData.endDate = !this.isEmpty(this.formData.endDate) ? moment(this.formData.endDate) : ''
                    this.formData.startDate = !this.isEmpty(this.formData.startDate) ? moment(this.formData.startDate) : ''
                    getContract(value).then(res => {
                      this.contractStages = res.data.sealContractStageList
                      this.billQuantities = res.data.sealAmountLists
                      this.$refs.fundsTable.refresh()
                      this.$refs.table.refresh()
                    })
                  } else {
                    this.formData.name = filterContract.name
                    this.formData.id = filterContract.id
                    this.formData.code = filterContract.code
                    this.formData.sum = filterContract.sum
                  }
                }
              }
            }
          }
        ]
      ],
      initformData: {
        changeType: ''
      },
      formItems: [],
      /* 合同变更 */
      formItemsModifyForm: [
        [
          {
            type: 'radio',
            prop: 'contractProp',
            label: '合同性质',
            options: () => [
              { label: '项目建设', value: '项目建设' },
              { label: '公司运营', value: '公司运营' }
            ],
            valueAlias: 'value',
            labelAlias: 'label'
          },
          {}
        ],
        // [
        //   {
        //     type: 'text',
        //     prop: 'code',
        //     label: '合同编号',
        //     colspan: 4
        //   },
        //   {
        //     type: 'text',
        //     prop: 'nickName',
        //     label: '申请人',
        //     colspan: 4
        //   }
        // ],
        [
          {
            type: 'input',
            label: '合同名称',
            prop: 'name',
            colspan: 4
          },
          // {
          //   type: 'text',
          //   label: '合同类型',
          //   prop: 'type',
          //   colspan: 4
          // }
          {
            type: 'radio',
            label: '合同类型',
            prop: 'type',
            options: () => [
              { label: '收入合同', value: '收入合同' },
              { label: '支出合同', value: '支出合同' }
            ],
            valueAlias: 'value',
            labelAlias: 'label',
            defaultValue: () => this.formData.type,
            colspan: 4
          }
        ],
        [
          {
            type: 'inputNumber',
            label: '金额(元)',
            prop: 'sum',
            colspan: 4,
            compProps: {
              props: {
                min: 0,
                precision: 2
              }
            }
          },
          {
            type: 'select',
            prop: 'firstParty',
            label: '甲方',
            options: () => this.merchantList,
            valueAlias: 'name',
            labelAlias: 'name',
            colspan: 4,
            allowClear: true,
            renderSuffix: text => {
              return (
                <a-button
                  style="height:auto;border:none"
                  type="link"
                  onClick={() =>
                    handleMerchantEdit(text, this.merchantList, () => {
                      this.getMerchantList()
                    })
                  }
                >
                  添加
                </a-button>
              )
            }
          }
        ],
        [
          {
            type: 'select',
            prop: 'secondParty',
            label: '乙方',
            options: () => this.merchantList,
            valueAlias: 'name',
            labelAlias: 'name',
            colspan: 4,
            allowClear: true,
            renderSuffix: text => {
              return (
                <a-button
                  style="height:auto;border:none"
                  type="link"
                  onClick={() =>
                    handleMerchantEdit(text, this.merchantList, () => {
                      this.getMerchantList()
                    })
                  }
                >
                  添加
                </a-button>
              )
            }
          },
          {
            type: 'datePicker',
            prop: 'signingDate',
            label: '签订日期',
            colspan: 4
          }
        ],
        // [
        //   {
        //     type: 'datePicker',
        //     prop: 'startDate',
        //     label: '生效日期',
        //     colspan: 4
        //   },
        //   {
        //     type: 'datePicker',
        //     prop: 'endDate',
        //     label: '完成日期',
        //     colspan: 8
        //   }
        // ],
        [
          {
            type: 'inputTextArea',
            prop: 'remark',
            label: '备注',
            colspan: 8,
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ],
        [
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
            colspan: 8,
            customDefaultFileList: () => {
              return this.formData.attachment
            },
            handleChange: ret => {
              this.formData.attachment = JSON.stringify(ret)
            },
            compProps: {
              props: {
                multiple: true
              }
            }
          },
          {}
        ],
        [
          {
            type: 'inputTextArea',
            prop: 'changeReason',
            label: '变更原因',
            colspan: 8,
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ]
      ],
      formRules: {
        nickname: { required: true, message: '请输入申请人', trigger: 'blur' },
        name: { required: true, message: '请输入', trigger: 'blur' },
        type: { required: true, message: '请选择', trigger: 'change' },

        sum: { required: true, message: '请输入', trigger: 'blur' },
        firstParty: { required: true, message: '请选择', trigger: 'change' },
        secondParty: { required: true, message: '请选择', trigger: 'change' }
      },
      contractDetailsColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '清单类型',
          dataIndex: 'type',
          align: 'center'
          // customRender: (text, record, index) => {
          //   return <a-input v-model={record.type} placeholder="请输入"></a-input>
          // }
        },
        {
          title: '名字',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.name} placeholder="请输入"></a-input>
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: 150,
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.description} autoSize={{ minRows: 3 }} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.unit} placeholder="请输入"></a-input>
          }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                onBlur={() => {
                  this.billQuantities[index].totalPrice = record.amount * record.price
                }}
                v-model={record.amount}
                placeholder="请输入"
                min={0}
                precision={2}
              />
            )
          }
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                onBlur={() => {
                  this.billQuantities[index].totalPrice = record.price * record.amount
                }}
                v-model={record.price}
                placeholder="请输入"
                min={0}
                precision={2}
              />
            )
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.totalPrice} placeholder="请输入" min={0} precision={2} />
          }
        }
      ],
      billQuantities: [],
      contractDetailsLoadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.billQuantities
          }
        })
      }
    }
  },
  created() {
    this.getMerchantList()
    treePlanProject({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    // 合同的初始化操作 在没有选项目的时候就用这些数据作为合同数据
    queryContract({ contractProp: '公司运营' }).then(res => {
      this.contractList = res.data
    })
  },
  methods: {
    getMerchantList() {
      listMerchant().then(res => {
        this.merchantList = res.rows
      })
    },
    // 过滤sn和刷新
    filterAndRefresh(sn) {
      this.contractStages = this.$refs.table.localDataSource.filter(item => {
        return item.sn !== sn
      })
      this.$refs.table.refresh(true)
    },
    /* 新增或修改 */
    async handleSubmit(callbackFunc) {
      this.formData.signingDate = this.formData.signingDate ? moment(this.formData.signingDate).format('YYYY-MM-DD HH:mm:ss') : null
      this.formData.startDate = this.formData.startDate ? moment(this.formData.startDate).format('YYYY-MM-DD HH:mm:ss') : null
      this.formData.endDate = this.formData.endDate ? moment(this.formData.endDate).format('YYYY-MM-DD HH:mm:ss') : null
      this.formData.contractStageList = this.contractStages
      this.formData.amountList = this.billQuantities
      let formData = this.formData
      if (this.initformData.changeType === '合同作废') {
        this.initformData.changeReason = formData.changeReason
        formData = this.initformData
      }
      const res = await contractSaveChange(formData)
      if (callbackFunc instanceof Function) {
        callbackFunc(res)
      } else {
        this.$message.success(res.msg)
        this.$emit('ok')
        this.$emit('close')
      }
      // if (res.code === 200 && res.msg === '操作成功') {
      //   this.$message.success('保存成功!')
      //   this.$emit('ok')
      //   this.$emit('close')
      // }
    },
    // 直接提交申请
    async handleApply() {
      await this.handleSubmit(async res => {
        // 直接提交流程
        await submitApplyContractModify({
          tenantAppId: this.$store.getters.tenantAppId,
          menuId: this.$route.meta.moduleId,
          dataId: res.data
        })
        this.$message.success(res.msg, 3)
        this.$emit('ok')
        this.$emit('close')
      })
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.contract-modify-step {
  margin-bottom: 24px;
}
.title {
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 20px;
}
</style>

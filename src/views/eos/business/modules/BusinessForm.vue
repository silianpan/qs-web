<!-- 商机管理表单 -->
<template>
  <s-form ok okText="保存" formTitle="商机信息" single :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <a-button class="s-mb-6 s-mt-6" ghost type="primary" @click="handleAddLinkMan">新增重点干系人</a-button>
      <s-table ref="tableLinkMan" size="default" :rowKey="(_, index) => index" :data="loadDataLinkMan" :columns="linkManColumns" :showPagination="false" />

      <a-button class="s-mb-6 s-mt-6" ghost type="primary" @click="handleAddStage">新增跟踪阶段</a-button>
      <s-table ref="tableStage" size="default" :rowKey="(_, index) => index" :data="loadDataStage" :columns="stageColumns" :showPagination="false" />
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import { SForm, STable } from '/src/components/index.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { addBusiness, updateBusiness, deleteBusinessUser, deleteBusinessStage, getBusiness } from '/src/api/eos/business/business.js'

export default {
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
  name: 'BusinessForm',
  components: {
    SForm,
    STable
  },
  data() {
    return {
      merchantList: [],
      linkManList: [],
      stageList: [],
      loadDataLinkMan: () => {
        return new Promise(resolve => resolve({ data: this.linkManList }))
      },
      loadDataStage: () => {
        return new Promise(resolve => resolve({ data: this.stageList }))
      },
      dictKeys: [],
      // 表单数据
      formData: {
        createBy: this.$store.getters.userName,
        code: moment().format('YYYYMMDDHHmmss')
      },
      formItems: [
        [
          {
            type: 'input',
            label: '商机名称',
            prop: 'name',
            colspan: 12
          },
          {
            type: 'text',
            label: '编号',
            prop: 'code',
            colspan: 12
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '商机描述',
            prop: 'remark',
            colspan: 12
          },
          {
            type: 'select',
            label: '业主单位',
            prop: 'ownerUnit',
            colspan: 12,
            options: () => this.merchantList,
            valueAlias: 'name',
            labelAlias: 'name',
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
            },
            compProps: {
              on: {
                select: value => {
                  delete this.formData.ownerUnit
                  this.$set(this.formData, 'ownerUnit', value)
                }
              }
            }
          }
        ],
        [
          {
            type: 'inputNumber',
            label: '预估金额(元)',
            prop: 'amount',
            colspan: 12
          },
          {
            type: 'radio',
            label: '是否招投标',
            prop: 'bid',
            colspan: 12,
            options: [
              { dictLabel: '是', dictValue: '是' },
              { dictLabel: '否', dictValue: '否' }
            ]
          }
        ],
        [
          {
            type: 'select',
            label: '资金来源',
            prop: 'fundSource',
            colspan: 12,
            options: [
              { dictLabel: '客户自筹资金', dictValue: '客户自筹资金' },
              { dictLabel: '中央财政预算投资', dictValue: '中央财政预算投资' },
              { dictLabel: '地方财政预算投资', dictValue: '地方财政预算投资' },
              { dictLabel: '银行贷款投资', dictValue: '银行贷款投资' },
              { dictLabel: '利用外资', dictValue: '利用外资' },
              { dictLabel: '社会融资', dictValue: '社会融资' },
              { dictLabel: '其他', dictValue: '其他' }
            ]
          },
          {
            type: 'input',
            label: '预期利润率',
            prop: 'profitRate',
            colspan: 12
          }
        ],
        [
          {
            type: 'inputNumber',
            label: '垫资金额(元)',
            prop: 'loaningScale',
            colspan: 12
          },
          {
            type: 'input',
            label: '垫资时长',
            prop: 'loaningTime',
            colspan: 12
          }
        ],
        [
          {
            type: 'upload',
            label: '上传附件',
            prop: 'attachment',
            colspan: 24,
            customDefaultFileList: () => this.updateRow && this.updateRow.attachment,
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
        ]
      ],
      formRules: {
        name: { required: true, message: '请输入', trigger: 'blur' },
        code: { required: true, message: '请输入', trigger: 'blur' }
        // ownerUnit: { required: true, message: '请选择', trigger: 'blur' },
        // amount: { required: true, message: '请输入', trigger: 'blur' },
        // bid: { required: true, message: '请选择', trigger: 'blur' },
        // fundSource: { required: true, message: '请选择', trigger: 'blur' },
        // profitRate: { required: true, message: '请输入', trigger: 'blur' }
      },
      // 重点干系人
      linkManColumns: [
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.name} placeholder="输入姓名" />
          }
        },
        {
          title: '联系方式',
          dataIndex: 'link',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.link} placeholder="输入联系方式" />
          }
        },
        {
          title: '角色',
          dataIndex: 'role',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.role} placeholder="输入角色" />
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.remark} placeholder="输入备注" />
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 80,
          customRender: (text, record, index) => {
            return <a-button type="danger" ghost icon="delete" onClick={() => this.handleDeleteLinkMan(record, index)} />
          }
        }
      ],
      // 跟踪阶段
      stageColumns: [
        // {
        //   title: '阶段名称',
        //   dataIndex: 'name',
        //   align: 'center',
        //   customRender: (text, record) => {
        //     return <a-input v-model={record.name} placeholder="输入阶段名称" />
        //   }
        // },
        {
          title: '活动时间',
          dataIndex: 'recordTime',
          align: 'center',
          customRender: (text, record) => {
            return text ? (
              <a-date-picker value={moment(text)} onChange={(date, dateString) => (record.recordTime = dateString)} placeholder="选择日期" />
            ) : (
              <a-date-picker onChange={(date, dateString) => (record.recordTime = dateString)} placeholder="选择日期" />
            )
          }
        },
        {
          title: '状态',
          dataIndex: 'state',
          align: 'center',
          customRender: (text, record) => {
            return (
              <a-select v-model={record.state} style={{ width: '120px' }}>
                <a-select-option value={'需求'}>需求</a-select-option>
                <a-select-option value={'方案'}>方案</a-select-option>
                <a-select-option value={'报价'}>报价</a-select-option>
                <a-select-option value={'招标'}>招标</a-select-option>
                <a-select-option value={'放弃'}>放弃</a-select-option>
              </a-select>
            )
          }
        },
        {
          title: '活动事件',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record) => {
            return <a-textarea v-model={record.remark} placeholder="输入备注" />
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 80,
          customRender: (text, record, index) => {
            return <a-button type="danger" ghost icon="delete" onClick={() => this.handleDeleteBusinessStage(record, index)} />
          }
        }
      ]
    }
  },
  mounted() {
    // 查询客商
    this.getMerchantList()
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      // 查询明细
      getBusiness(this.updateRow.id).then(res => {
        this.formData = { ...res.data }
        this.linkManList = res.data.sealBusinessUsers || []
        this.stageList = res.data.sealBusinessStages || []
        this.$refs.tableLinkMan.refresh(true)
        this.$refs.tableStage.refresh(true)
      })
    }
  },
  methods: {
    getMerchantList() {
      listMerchant().then(res => {
        this.merchantList = res.rows
      })
    },
    handleDeleteBusinessStage(record, index) {
      if (record.id) {
        deleteBusinessStage(record.id).then(_ => {
          this.$message.success('删除成功')
        })
      }
      this.stageList.splice(index, 1)
    },
    handleDeleteLinkMan(record, index) {
      if (record.id) {
        deleteBusinessUser(record.id).then(_ => {
          this.$message.success('删除成功')
        })
      }
      this.linkManList.splice(index, 1)
    },
    handleAddStage() {
      this.stageList.push({
        recordTime: moment()
      })
    },
    handleAddLinkMan() {
      this.linkManList.push({})
    },
    async handleSubmit() {
      let errorMsg = ''
      this.linkManList.forEach(item => {
        if (this.isEmpty(item.name)) {
          errorMsg += '请填写干系人姓名。'
        }
      })
      const submitStageList = [...this.stageList]
      submitStageList.forEach(item => {
        // if (this.isEmpty(item.name)) {
        //   errorMsg += '请填写阶段名称。'
        // }
        if (this.isEmpty(item.state)) {
          errorMsg += '请选择阶段状态。'
        }
        if (this.isEmpty(item.recordTime)) {
          errorMsg += '请选择活动时间。'
        } else {
          item.recordTime = moment(item.recordTime).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      if (!this.isEmpty(errorMsg)) {
        return this.$message.error(errorMsg)
      }
      const sealBusiness = { ...this.formData, sealBusinessUsers: this.linkManList, sealBusinessStages: submitStageList }
      if (this.isUpdate && !this.isEmpty(this.updateRow)) {
        try {
          const modify = await updateBusiness(sealBusiness)
          this.$emit('ok')
          this.$emit('close')
          if (modify.code === 200) return this.$message.success(modify.msg)
        } catch (error) {
          this.$message.error(error.message)
        }
      } else {
        try {
          const success = await addBusiness(sealBusiness)
          this.$emit('ok')
          this.$emit('close')
          if (success.code === 200) return this.$message.success(success.msg)
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.s-border-zero {
  font-size: 14px;
  font-weight: bold;
  color: rgb(0, 55, 235);
}
</style>

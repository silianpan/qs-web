<!-- 借款表单 -->
<template>
  <s-form ref="formTable" ok single okText="保存草稿" hasApplyBtn @apply="handleApply" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <p style="color: #348ee4; font-size: 18px; font-weight: bold; margin-top: 1em">借款总金额：{{ toThousandFilter(totalSum) }}</p>
      <a-button ghost type="primary" icon="plus" @click="handleAdd" style="margin: 5px 0">新增明细</a-button>
      <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :showPagination="false">
        <span slot="action" slot-scope="text, record, index">
          <a-popconfirm title="确认删除该行吗?" @confirm="handleDelete(record, index)" ok-text="确认" cancel-text="取消">
            <a href="javascript:;" style="color: red">删除</a>
          </a-popconfirm>
        </span>
      </s-table>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm, STable } from '/src/components/index.js'
import { addLoan, updateLoan, getLoan, delLoanDetail, submitApply } from '/src/api/eos/repayment/loan.js'
import { listProject } from '/src/api/eos/project/project.js'

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
    },
    /* 调整申请不能修改类型 */
    disType: {
      type: Boolean,
      default: false
    }
  },
  name: 'Loan',
  components: {
    SForm,
    STable
  },
  data() {
    return {
      // 总计
      totalSum: 0,
      dictKeys: [dictConfig.PROJECT_REGION, dictConfig.PROJECT_BORROWINGS_TYPE, dictConfig.LOAN_TYPE],
      dictMap: {},
      // 项目
      projectList: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'JKSQ' + moment().format('YYYYMM-DDHHmmss'),
        sealLoanDetails: []
      },
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '项目编号',
            colspan: 4
          },
          {
            type: 'text',
            prop: 'nickname',
            label: '立项人',
            colspan: 4
          }
        ],
        [
          {
            type: 'radio',
            label: '借款类型',
            options: _ => this.dictMap[dictConfig.PROJECT_BORROWINGS_TYPE] || [],
            labelAlias: 'dictLabel',
            valueAlias: 'dictValue',
            prop: 'type',
            colspan: 4,
            compProps: {
              props: {
                disabled: this.disType
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
            type: 'inputTextArea',
            label: '借款事由',
            prop: 'remark',
            colspan: 4,
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
            colspan: 24,
            customDefaultFileList: () => this.updateRow && this.updateRow.attachment,
            handleChange: ret => {
              this.formData.attachment = JSON.stringify(ret)
            },
            compProps: {
              props: {
                multiple: true
              }
            },
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
        // // projectId: { required: true, message: '请输入', trigger: 'change' },
        // date: { required: true, message: '请选择', trigger: 'change' }
      },
      columns: [
        // customRender 字段必须和 dataIndex 一样
        {
          title: '名称',
          dataIndex: 'loanName',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.loanName} placeholder="请输入" />
          }
        },
        {
          title: '金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.sum} placeholder="请输入" min={0} precision={0} />
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input v-model={record.remark} autoSize={{ minRows: 3 }} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-input>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.formData.sealLoanDetails,
            totalCount: this.formData.sealLoanDetails.length
          }
        })
      }
    }
  },
  methods: {
    // 保存
    async handleSubmit(callbackFunc) {
      const loanVo = { ...this.formData }
      loanVo.sealLoanDetails = this.formData.sealLoanDetails
      loanVo.sealLoanDetails.forEach(item => {
        if (typeof item.id === 'string') {
          delete item.id
        }
      })
      let res = null
      try {
        if (this.isUpdate && !this.isEmpty(this.updateRow)) {
          res = await updateLoan(loanVo)
        } else {
          // 新增
          res = await addLoan(loanVo)
        }
        if (callbackFunc instanceof Function) {
          callbackFunc(res)
        } else {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        }
      } catch {
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      }
    },
    // 直接提交
    handleApply() {
      try {
        this.handleSubmit(async res => {
          // 直接提交流程
          await submitApply({
            tenantAppId: this.$store.getters.tenantAppId,
            menuId: this.$route.meta.moduleId,
            dataId: res.data
          })
          this.$message.success(res.msg, 3)
          this.$emit('ok')
          this.$emit('close')
        })
      } catch {
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      }
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    // 新增行
    handleAdd() {
      const newData = {
        loanName: ``,
        sum: ``,
        remark: ``
      }
      this.formData.sealLoanDetails.push(newData)
    },
    // 删除行
    handleDelete(val, index) {
      this.formData.sealLoanDetails.splice(index, 1)
      if (val.id) {
        delLoanDetail(val.id).then(res => {
          this.$message.success(res.msg)
        })
      }
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    /* 查询项目 */
    listProject().then(res => {
      this.projectList = res.rows
    })
  },
  mounted() {
    // 修改
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      getLoan(this.updateRow.id).then(res => {
        this.formData = res.data
        this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
        this.$refs.table.refresh(true)
      })
    }
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        this.totalSum = 0
        if (newValue.sealLoanDetails && newValue.sealLoanDetails.length > 0) {
          newValue.sealLoanDetails.forEach(e => {
            if (!this.isEmpty(e.sum)) {
              this.totalSum = this.totalSum + e.sum
            }
          })
        }
      },
      deep: true
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
.title {
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 24px;
  margin: 20px 0;
}
</style>

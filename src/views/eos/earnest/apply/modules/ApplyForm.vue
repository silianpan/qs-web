<!-- 保证金申请表单 -->
<template>
  <s-form
    ref="formTable"
    single
    ok
    okText="保存草稿"
    hasApplyBtn
    @apply="handleApply"
    :queryDictKeys="dictKeys"
    :formItems="formItems"
    :formData="formData"
    :rules="this.formData.depositType === '履约保证金' ? formRules2 : formRules1"
    @submit="handleSubmit"
    @cancel="handleCancel"
  ></s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm } from '/src/components/index.js'
import { addApply, updateApply, submitApply } from '/src/api/eos/earnest/earnestMoney.js'
import { listBid } from '/src/api/eos/bid/bid.js'
import { handleMerchantEdit } from '../../../config/busUtil'
import BidForm from '../../../bid/modules/BidForm'

export default {
  name: 'EarnestApplyForm',
  components: {
    SForm
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
  data() {
    return {
      dictKeys: [dictConfig.SEAL_PROJECT_EARNESTMONEY_TYPE],
      dictMap: {},
      bidList: [],
      formData: {
        createBy: this.$store.getters.userName,
        code: 'CODE' + moment().format('YYYYMM-DDHHmmss'),
        createTime: this.$store.getters.createTime,
        nickname: this.$store.getters.nickname
      },
      formItems: [
        [
          {
            type: 'text',
            label: '申请编号：',
            prop: 'code',
            colspan: 4
          },
          {
            type: 'text',
            label: '申请人：',
            prop: 'nickname',
            colspan: 4
          }
        ],
        [
          {
            type: 'select',
            label: '保证金类型',
            prop: 'depositType',
            options: () => this.dictMap[dictConfig.SEAL_PROJECT_EARNESTMONEY_TYPE],
            colspan: 4
          },
          {
            type: 'select',
            prop: 'bidId',
            label: '关联的招投标',
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.bidList,
            renderSuffix: _ => {
              return (
                <a-button
                  style="height:auto;border:none"
                  type="link"
                  onClick={() => {
                    this.addNewZTB()
                  }}
                >
                  添加
                </a-button>
              )
            }
          }
        ],
        [
          {
            type: 'inputNumber',
            label: '保证金金额(元)',
            prop: 'depositMoney',
            colspan: 4
          },
          {
            type: 'datePicker',
            label: '预计退还时间',
            prop: 'returnTime',
            colspan: 4
          }
        ],
        [
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
            colspan: 8,
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
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
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
      formRules1: {
        projectId: { required: true, message: '请选择', trigger: 'change' },
        depositType: { required: true, message: '请选择', trigger: 'change' },
        depositMoney: { required: true, message: '请输入', trigger: 'blur' },
        returnTime: { required: true, message: '请选择', trigger: 'change' },
        remark: { required: false, message: '请输入', trigger: 'blur' },
        bidId: { required: true, message: '请选择', trigger: 'blur' }
      },
      formRules2: {
        projectId: { required: true, message: '请选择', trigger: 'change' },
        depositType: { required: true, message: '请选择', trigger: 'change' },
        depositMoney: { required: true, message: '请输入', trigger: 'blur' },
        returnTime: { required: true, message: '请选择', trigger: 'change' },
        remark: { required: false, message: '请输入', trigger: 'blur' }
      }
    }
  },
  created() {
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
    }
    listBid().then(res => {
      this.bidList = res.rows
    })
  },
  methods: {
    async handleSubmit(callbackFunc) {
      const fd = { ...this.formData }
      // 更新或添加
      let res = null
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        res = await updateApply(fd)
      } else {
        res = await addApply(fd)
      }
      if (callbackFunc instanceof Function) {
        callbackFunc(res)
      } else {
        this.$message.success(res.msg)
        this.$emit('ok')
        this.$emit('close')
      }
    },
    // 直接提交
    async handleApply() {
      await this.handleSubmit(async res => {
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
    },
    handleCancel() {
      this.$emit('close')
    },
    addNewZTB() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增招标信息',
          width: '45%',
          maskClosable: true
        },
        content: {
          template: BidForm,
          on: {
            ok: () => {
              listBid().then(res => {
                this.bidList = res.rows
              })
            }
          }
        }
      })
    }
  }
}
</script>

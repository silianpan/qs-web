<!-- 保证金退还表单 -->
<template>
  <s-form ok single :okText="'保存'" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
</template>

<script>
import moment from 'moment'
import { SForm } from '/src/components/index.js'
import { addReturn, updateReturn } from '/src/api/eos/earnest/earnestReturn.js'
import { listApplySimple } from '/src/api/eos/earnest/earnestMoney.js'
import ApplySelect from './ApplySelect.vue'
export default {
  name: 'ReturnForm',
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
      dictKeys: [],
      applyList: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'CODE' + moment().format('YYYYMM-DDHHmmss'),
        createTime: this.$store.getters.createTime
      },
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '退还单号',
            colspan: 4
          },
          {
            type: 'text',
            prop: 'nickname',
            label: '申请人',
            colspan: 4
          },
          {
            type: 'text',
            prop: 'createTime',
            label: '申请时间',
            colspan: 4
          }
        ],
        [
          {
            type: 'select',
            label: '保证金申请单',
            prop: 'applyId',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'code',
            options: () => this.applyList,
            open: false,
            compProps: {
              on: {
                focus: e => {
                  this.handleAssociated()
                }
              }
            }
          },
          {
            type: 'input',
            label: '退还金额(元)',
            prop: 'returnMoney',
            colspan: 4
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
      formRules: {
        applyId: { required: true, message: '请选择', trigger: 'change' },
        returnMoney: { required: true, message: '请输入', trigger: 'blur' },
        remark: { required: false, message: '请输入', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
    }
    listApplySimple({ state: '0' }).then(res => {
      this.applyList = res.rows
    })
  },
  methods: {
    handleSubmit() {
      const fd = { ...this.formData }
      // 更新或添加
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        updateReturn(fd).then(res => {
          this.$message.success('修改成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        addReturn(fd).then(res => {
          this.$message.success('新增成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    handleCancel() {
      this.$emit('close')
    },
    handleAssociated() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '保证金申请列表',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: ApplySelect,
          props: {
            selectType: 'radio'
          },
          on: {
            ok: (Rows, Keys) => {
              this.$set(this.formData, 'sealDepositApply.code', Rows[0].code)
              this.$set(this.formData, 'applyId', Keys[0])
            }
          }
        }
      })
    }
  }
}
</script>

<!-- 库房管理表单 -->
<template>
  <s-form ok :okText="'保存'" single :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
</template>

<script>
import moment from 'moment'
import { SForm } from '/src/components/index.js'
import { addWarehouse, updateWarehouse } from '/src/api/eos/warehouse/warehouse.js'

export default {
  name: 'WarehouseForm',
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
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'QS' + moment().format('YYYYMM-DDHHmmss')
      },
      formItems: [
        [
          {
            type: 'text',
            label: '库房编号',
            prop: 'code'
          },
          {
            type: 'text',
            label: '申请人',
            prop: 'nickname'
          }
        ],
        [
          {
            type: 'input',
            label: '库房名称',
            prop: 'name'
          },
          {
            type: 'input',
            label: '库房地址',
            prop: 'address'
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark'
          },
          {}
        ]
      ],
      formRules: {
        name: { required: true, message: '请输入', trigger: 'blur' },
        address: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
    }
  },
  methods: {
    handleSubmit() {
      const fd = { ...this.formData }
      // 更新或添加
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        updateWarehouse(fd).then(res => {
          this.$message.success('修改成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        addWarehouse(fd).then(res => {
          this.$message.success('新增成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>

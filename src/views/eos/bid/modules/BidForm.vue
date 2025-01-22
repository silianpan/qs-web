<!-- 招投标管理表单 -->
<template>
  <s-form single ok okText="保存" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel" />
</template>

<script lang="jsx">
import moment from 'moment'
import { SForm } from '/src/components/index.js'
import { addBid, updateBid } from '/src/api/eos/bid/bid.js'
import { listBusiness } from '/src/api/eos/business/business.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'

export default {
  name: 'BidForm',
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
      merchantList: [],
      businessList: [],
      formData: {
        createBy: this.$store.getters.userName
      },
      formItems: [
        [
          {
            type: 'input',
            label: '标（包）名称',
            prop: 'name'
          }
        ],
        [
          {
            type: 'input',
            label: '标（包）编号',
            prop: 'code'
          }
        ],
        [
          {
            type: 'select',
            label: '所属商机',
            prop: 'businessId',
            labelAlias: 'name',
            valueAlias: 'id',
            options: () => this.businessList
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '描述',
            prop: 'description'
          }
        ],
        [
          {
            type: 'datePicker',
            label: '开标日期',
            prop: 'openDate'
          }
        ],
        [
          {
            type: 'select',
            label: '代理机构',
            prop: 'agency',
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
            }
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
          }
        ]
      ],
      formRules: {
        name: { required: true, message: '请输入', trigger: 'blur' },
        code: { required: true, message: '请输入', trigger: 'blur' },
        openDate: { required: true, message: '请选择', trigger: 'change' },
        agency: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  created() {
    this.getMerchantList()
    listBusiness({ pageSize: 999 }).then(res => {
      this.businessList = res.rows
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.openDate = moment(this.formData.openDate)
    }
  },
  methods: {
    getMerchantList() {
      listMerchant().then(res => {
        this.merchantList = res.rows
      })
    },
    handleSubmit() {
      const fd = { ...this.formData }
      fd.openDate = moment(fd.openDate).format('YYYY-MM-DD HH:mm:ss')
      // 更新或添加
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        updateBid(fd).then(res => {
          this.$message.success('修改成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        addBid(fd).then(res => {
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

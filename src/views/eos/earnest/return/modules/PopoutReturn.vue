<!-- 保证金退还弹窗 -->
<template>
  <div>
    <a-row class="s-mt-6 s-mb-6" type="flex" justify="start" :gutter="16"> </a-row>
    <s-form ref="formTable" ok :okText="'保存'" layout="vertical" :formItems="columns" :formData="formData" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
  </div>
</template>

<script lang='jsx'>
import moment from 'moment'
import { SForm } from '/src/components/index.js'
import { addReturn } from '/src/api/eos/earnest/earnestReturn.js'

export default {
  components: {
    SForm
  },
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        createBy: this.$store.getters.userName,
        code: 'BZJTH' + moment().format('YYYYMM-DDHHmmss'),
        reTurnType: '全部退还',
        createTime: this.$store.getters.createTime
      },
      columns: [],
      formItems: [
        [
          {
            type: 'radio',
            prop: 'reTurnType',
            options: () => [
              { label: '全部退还', value: '全部退还' },
              { label: '部分退还', value: '部分退还' }
            ],
            labelAlias: 'label',
            valueAlias: 'value',
            compProps: {
              on: {
                change: e => {
                  const isBudget = e.target.value
                  if (isBudget === '全部退还') {
                    this.formData.returnMoney = this.record.depositMoney
                    this.columns = this.formItems.slice(0, 1).concat([this.formItems[this.formItems.length - 1]])
                  } else {
                    this.columns = this.formItems
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
          type: 'input',
          prop: 'returnMoney',
          label: '退还金额',
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
        ]
      ]
    }
  },
  mounted() {
    this.formData.applyId = this.record.id
    this.formData.returnMoney = this.record.depositMoney
    this.columns = this.formItems.slice(0, 1).concat([this.formItems[this.formItems.length - 1]])
  },
  methods: {
    handleSubmit() {
        addReturn(this.formData).then(res => {
          this.$message.success('新增成功', 3)
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

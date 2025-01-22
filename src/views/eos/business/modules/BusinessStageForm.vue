<!-- 跟踪表单 -->
<template>
  <div>
    <a-steps :current="current" @change="handleStepChange">
      <a-step title="需求" />
      <a-step title="方案" />
      <a-step title="报价" />
      <a-step title="招标" />
      <a-step title="放弃" />
    </a-steps>
    <s-form style="margin-top: 20px" single ok :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<script>
import moment from 'moment'
import { SForm } from '/src/components/index.js'
import { getBusiness, addBusinessStage } from '/src/api/eos/business/business.js'

export default {
  components: {
    SForm
  },
  props: {
    businessCode: {
      type: String,
      required: true
    },
    formId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      current: 0,
      currentStateMap: {
        需求: 0,
        方案: 1,
        报价: 2,
        招标: 3,
        放弃: 4,
        '': 0
      },
      currentStateMapNum: {
        0: '需求',
        1: '方案',
        2: '报价',
        3: '招标',
        4: '放弃'
      },
      formData: {
        recordTime: moment()
      },
      formRules: {
        recordTime: { required: true, message: '请选择', trigger: 'blur' },
        remark: { required: true, message: '请输入', trigger: 'blur' }
      },
      formItems: [
        [
          {
            type: 'datePicker',
            label: '活动时间',
            prop: 'recordTime',
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
            label: '阶段附件',
            prop: 'attachment',
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
            label: '活动事件',
            prop: 'remark',
            compProps: {
              props: {
                autoSize: { minRows: 10 }
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
      ]
    }
  },
  mounted() {
    // 查询明细
    getBusiness(this.formId).then(res => {
      const stageList = res.data.sealBusinessStages
      if (!this.isEmpty(stageList)) {
        const currentState = stageList[stageList.length - 1].state
        this.current = this.currentStateMap[currentState]
        this.formData.state = currentState
      } else {
        this.formData.state = '需求'
      }
    })
  },
  methods: {
    handleStepChange(current) {
      this.formData.state = this.currentStateMapNum[current]
      this.current = current
    },
    handleCancel() {
      this.$emit('close')
    },
    handleSubmit() {
      // 新增商机跟踪商机状态
      addBusinessStage({
        ...this.formData,
        businessCode: this.businessCode,
        recordTime: moment(this.formData.recordTime).format('YYYY-MM-DD HH:mm:ss')
      }).then(res => {
        this.$message.success('保存成功')
        this.$emit('saveSuccess')
        this.handleCancel()
      })
    }
  }
}
</script>

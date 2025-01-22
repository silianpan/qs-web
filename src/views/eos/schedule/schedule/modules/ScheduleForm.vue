<!-- 进度计划表单 -->
<template>
  <div>
    <s-form single ok :okText="'保存'" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
    <a-table :pagination="false" ref="table" rowKey="level" :columns="PhaseColumns" :data-source="PhaseData" :expanded-row-keys.sync="expandedRowKeys">
      <span slot="action" slot-scope="text, record, index">
        <a-button type="link" icon="plus" @click="addPhaseChildren(text, record)"></a-button>
        <!-- <a-popconfirm title="是否删除? (注:不可撤回!)" ok-text="确定" cancel-text="取消" @confirm="antdconfirm(text, record)">

        </a-popconfirm> -->
        <a-button style="color: red" type="link" icon="delete" @click="deletePhaseChildren(text, record, index)" />
      </span>
    </a-table>
    <!-- 阶段明细 第一层级 -->
    <a-button ghost type="primary" icon="plus" style="margin-top: 20px" @click="addPhase">新增阶段</a-button>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { SForm } from '/src/components/index.js'
import { treePlanProject } from '/src/api/eos/project/project.js'
import { addSchedule, deleteScheduleStage } from '/src/api/eos/schedule/schedule.js'
// import CircularJSON from 'circular-json'

export default {
  name: 'Schedule',
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
        nickName: this.$store.getters.nickname,
        code: 'JDJH' + moment().format('YYYYMM-DDHHmmss')
      },
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '计划编号',
            colspan: 4
          },
          {
            type: 'text',
            prop: 'nickName',
            label: '创建人'
          }
        ],
        [
          {
            type: 'treeSelect',
            label: '项目',
            prop: 'projectId',
            colspan: 8,
            options: () => this.projectList,
            valueAlias: 'id',
            labelAlias: 'label',
            compProps: {
              props: {}
            }
          },
          {}
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
        projectId: { required: true, message: '请选择', trigger: 'change' }
      },
      /* 阶段明细 title */
      PhaseColumns: [
        {
          title: '#',
          dataIndex: 'level'
        },
        {
          title: '阶段(必填)',
          dataIndex: 'name',
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.name} placeholder="阶段···" rows={2}>
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },
        {
          title: '描述',
          dataIndex: 'note',
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.note} placeholder="描述···" rows={2}>
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },
        {
          title: '计划开始日期(必填)',
          dataIndex: 'beginDate',
          customRender: (text, record, index) => {
            return text ? (
              <a-date-picker value={moment(text)} onChange={(date, dateString) => this.beginDate(date, dateString, record)} />
            ) : (
              <a-date-picker onChange={(date, dateString) => this.beginDate(date, dateString, record)} />
            )
          }
        },
        {
          title: '计划完成日期(必填)',
          dataIndex: 'endDate',
          customRender: (text, record, index) => {
            return text ? <a-date-picker value={moment(text)} onChange={(date, dateString) => this.endDate(date, dateString, record)} /> : <a-date-picker onChange={(date, dateString) => this.endDate(date, dateString, record)} />
          }
        },
        {
          title: '预估工作量(人/天)',
          dataIndex: 'workload',
          customRender: (text, record, index) => {
            return (
              <a-textarea
                v-model={record.workload}
                placeholder="工作量"
                rows={1}
                onBlur={e => {
                  if (e.target.value) {
                    const reg = /^[0-9]+(.[0-9]{1,2})?$/
                    if (!reg.test(e.target.value)) {
                      record.workload = ''
                      return this.$message.error('请输入数字,最多保留两位小数!')
                    }
                  }
                }}
              >
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      /* 阶段明细 */
      PhaseData: [],
      /* 所有展开的行key */
      expandedRowKeys: [],
      projectList: []
    }
  },
  methods: {
    onOk() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    onCancel() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    handleSubmit() {
      const ScheduleVo = {
        ...this.formData,
        stageList: [...this.$refs.table.dataSource]
      }
      for (let i = 0; i < ScheduleVo.stageList.length; i++) {
        const s = ScheduleVo.stageList[i]
        if (this.isEmpty(s.name) || this.isEmpty(s.beginDate) || this.isEmpty(s.endDate)) {
          this.$message.error('必填项未填，不能保存!')
          return
        }
      }
      // JSON格式转化：
      const menuNode = JSON.stringify(ScheduleVo)
      addSchedule(menuNode).then(res => {
        this.$emit('ok')
        this.$emit('close')
      })
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    /* 添加阶段明细  只添加第一级 */
    addPhase() {
      if (this.PhaseData.length < 1) {
        this.PhaseData.push({
          level: this.PhaseData.length + 1 + '',
          name: '',
          note: '',
          beginDate: '',
          endDate: '',
          workload: ''
        })
      } else if (this.PhaseData[this.PhaseData.length - 1]) {
        const per = this.PhaseData[this.PhaseData.length - 1]
        if (!this.isEmpty(per.name) && !this.isEmpty(per.beginDate) && !this.isEmpty(per.endDate)) {
          this.PhaseData.push({
            level: this.PhaseData.length + 1 + '',
            name: '',
            note: '',
            beginDate: '',
            endDate: '',
            workload: ''
          })
        } else {
          return this.$message.error('必填项未填，不能新增!')
        }
      }
    },
    /* 添加子明细阶段 */
    addPhaseChildren(text, record) {
      if (this.isEmpty(record.name) || this.isEmpty(record.beginDate) || this.isEmpty(record.endDate)) {
        return this.$message.error('必填项未填，不能新增!')
      } else {
        /* 添加子阶段时自动展开当前行 */
        this.expandedRowKeys = [...this.expandedRowKeys, record.level]
        if (this.isEmpty(record.children)) {
          record.children = []
        }
        /* 添加子阶段 */
        record.children.push({
          level: record.level + '.' + (record.children.length + 1),
          name: '',
          note: '',
          beginDate: '',
          endDate: '',
          workload: ''
        })
      }
    },
    /* 删除前询问是否删除 */
    antdconfirm(text, record, index) {
      this.deletePhaseChildren(text, record, index)
    },
    /* 删除子阶段 */
    deletePhaseChildren(text, record, index) {
      if (!this.isEmpty(record.id)) {
        if (this.isEmpty(record.children)) {
          deleteScheduleStage(record.id).then(res => {
            this.PhaseData = [...this.deleteFomeItem(record.id, this.PhaseData, 'id')]
            this.orderFormItem(this.PhaseData, null, 0, 'level')
          })
        } else {
          return this.$message.error('该项存在子项，无法删除!')
        }
      } else {
        if (this.isEmpty(record.children)) {
          this.PhaseData = [...this.deleteFomeItem(record.level, this.PhaseData, 'level')]
          /* 重新排序 */
          this.orderFormItem(this.PhaseData, null, 0, 'level')
        } else {
          return this.$message.error('该项存在子项，无法删除!')
        }
      }
    },
    /* 开始时间回调 */
    beginDate(date, dateString, record) {
      record.beginDate = dateString
    },
    /* 结束时间回调 */
    endDate(date, dateString, record) {
      record.endDate = dateString
    },
    /**
     * 递归删除明细
     * idName：要删除的字段
     */
    deleteFomeItem(deleteId, PhaseData, idName = 'id') {
      for (let i = 0; i < PhaseData.length; i++) {
        const C = PhaseData[i]
        if (C[idName] === deleteId) {
          return PhaseData.filter(item => deleteId !== item[idName])
        }
        if (!this.isEmpty(C.children)) {
          C.children = this.deleteFomeItem(deleteId, C.children, idName)
        }
      }
      return PhaseData
    },
    /**
     * 递归排序
     * orderCol: 排序字段
     */
    orderFormItem(PhaseData, parentLevel, indexStart = 0, orderCol = 'level') {
      for (let i = indexStart; i < PhaseData.length; i++) {
        const item = PhaseData[i]
        const orderLevel = parentLevel ? parentLevel + '.' + (i + 1) : i + 1 + ''
        item[orderCol] = orderLevel
        if (!this.isEmpty(item.children)) {
          this.orderFormItem(item.children, item[orderCol], 0, orderCol)
        }
      }
    }
  },
  async created() {
    /* 修改 */
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.PhaseData = this.updateRow.stageList
      this.formData.nickName = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
    }
    const { data } = await treePlanProject()
    this.projectList = data
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

<!-- 进度执行表单 -->
<template>
  <div>
    <s-form single ok ref="formTable" :okText="'保存'" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
    <s-table ref="table" rowKey="key" :columns="ProgressColumns" :data="loadData" :showPagination="false">
      <span slot="action" slot-scope="text, record">
        <a-button style="color: red" type="link" icon="delete" @click="deleteProgressFill(text, record)" />
      </span>
    </s-table>
    <!-- 阶段明细 第一层级 -->
    <a-button ghost type="primary" style="margin-top: 20px" icon="plus" @click="addProgressFill">新增汇报</a-button>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { SForm, STable } from '/src/components/index.js'
import { processProject, addProcess, delProcess, ProjectScheduleList } from '/src/api/eos/schedule/process.js'
import { uuidv4 } from '/src/utils/common/util.js'

export default {
  name: 'Process',
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
  data() {
    return {
      dictKeys: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickName: this.$store.getters.nickname,
        code: 'JDZX' + moment().format('YYYYMM-DDHHmmss')
      },
      formItems: [
        [
          {
            type: 'text',
            label: '汇报编号',
            prop: 'code'
          },
          {
            type: 'text',
            label: '汇报人',
            prop: 'nickName'
          }
        ],
        [
          {
            type: 'datePicker',
            label: '汇报周期(开始)',
            prop: 'startDate',
            colspan: 4
          },
          {
            type: 'datePicker',
            label: '汇报周期(结束)',
            prop: 'endDate',
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
        projectId: { required: true, message: '请输入', trigger: 'change' },
        startDate: { required: true, message: '请输入', trigger: 'change' },
        endDate: { required: true, message: '请输入', trigger: 'change' }
      },
      /* 进度汇报 title */
      ProgressColumns: [
        {
          title: '开始日期',
          dataIndex: 'beginDate',
          align: 'center',
          customRender: (text, record, index) => {
            return text ? (
              <a-date-picker value={moment(text)} onChange={(date, dateString) => this.beginDate(date, dateString, record)} />
            ) : (
              <a-date-picker onChange={(date, dateString) => this.beginDate(date, dateString, record)} />
            )
          }
        },
        {
          title: '完成日期',
          dataIndex: 'endDate',
          align: 'center',
          customRender: (text, record, index) => {
            return text ? <a-date-picker value={moment(text)} onChange={(date, dateString) => this.endDate(date, dateString, record)} /> : <a-date-picker onChange={(date, dateString) => this.endDate(date, dateString, record)} />
          }
        },
        {
          title: '项目名称',
          dataIndex: 'projectId',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-select v-model={record.projectId} onSelect={value => this.projectSelect(value, record)} allowClear placeholder="请选择" style="min-width:200px">
                {this.projectList.map(item => {
                  return <a-select-option key={item.id}>{item.name}</a-select-option>
                })}
              </a-select>
            )
          }
        },
        {
          title: '所属阶段',
          dataIndex: 'stageId',
          align: 'center',
          customRender: (text, record) => {
            const replaceFields = { title: 'name', key: 'id', value: 'id' }
            return (
              <a-tree-select
                onChange={(value, label, extra) => this.threeSelect(record, value, label, extra)}
                style="width:200px"
                replaceFields={replaceFields}
                v-model={record.stageId}
                tree-data={record.treeData}
                placeholder="选择阶段"
              />
            )
          }
        },
        {
          title: '实际工作量(人/天)',
          dataIndex: 'workload',
          align: 'center',
          customRender: (text, record) => {
            return <a-input-number v-model={record.workload} min={0} precision={2} />
          }
        },
        {
          title: '工作描述',
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
          title: '操作',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载明细数据
      loadData: param => {
        return new Promise(resolve => {
          resolve({
            data: [...this.ProgressData]
          })
        })
      },
      /* 进度汇报明细 */
      ProgressData: [],
      /* 项目列表 */
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
      const data = {
        ...this.formData,
        endDate: moment(this.formData.endDate).format('YYYY-MM-DD'),
        startDate: moment(this.formData.startDate).format('YYYY-MM-DD'),
        sealProjectProcesses: this.$refs.table.localDataSource
      }
      addProcess(data).then(res => {
        this.$emit('ok')
        this.$emit('close')
      }).catch(reason=>{
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      })
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    /* 新增进度汇报 */
    addProgressFill() {
      if (this.ProgressData.length === 0) {
        this.ProgressData = [
          ...this.ProgressData,
          {
            key: this.ProgressData.length + 1,
            projectId: '',
            beginDate: '',
            endDate: '',
            stageId: '',
            workload: '',
            note: ''
          }
        ]
      } else {
        for (let i = 0; i < this.ProgressData.length; i++) {
          const p = this.ProgressData[i]
          if (this.isEmpty(p.projectId)) {
            return this.$message.error('必填项未填，不能新增!')
          }
        }
        this.ProgressData = [
          ...this.ProgressData,
          {
            key: this.ProgressData.length + 1,
            projectId: '',
            beginDate: '',
            endDate: '',
            stageId: '',
            workload: '',
            note: ''
          }
        ]
      }
      this.refresh()
    },
    /* 删除进度汇报明细行 */
    deleteProgressFill(text, record) {
      if (!this.isEmpty(record.id)) {
        delProcess(record.id).then(res => {
          this.ProgressData = this.ProgressData.filter(item => item !== record)
          this.refresh()
        })
      } else {
        this.ProgressData = this.ProgressData.filter(item => item !== record)
        this.refresh()
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
    /* 选中项目回调 */
    projectSelect(pid, record) {
      ProjectScheduleList({ projectId: pid }).then(res => {
        record.treeData = [...res.data]
        this.refresh()
      })
    },
    /* 刷新表格 */
    refresh() {
      this.$refs.table.refresh()
    },
    /* 树形回调 */
    threeSelect(record, value, label, extra) {
      if (extra.triggerNode.$children.length === 0) {
        record.stageId = value
      } else {
        record.stageId = null
        return this.$message.warning('该节点为父节点,请选择子节点!')
      }
    }
  },
  async created() {
    const { data } = await processProject()
    this.projectList = data
    /* 修改 */
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = {
        ...this.updateRow,
        startDate: moment(this.updateRow.startDate),
        endDate: moment(this.updateRow.endDate)
      }
      this.formData.nickName = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      this.ProgressData = [...this.updateRow.sealProjectProcesses]
      this.ProgressData.forEach(item => {
        item.key = uuidv4()
        this.projectSelect(item.projectId, item)
      })
      this.$nextTick(() => {
        this.refresh()
      })
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

<!-- 项目成员表单 -->
<template>
  <s-form ref="formTable" ok okText="保存" single :formTitle="'添加项目成员'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <div class="s-mt-16">
        <a-button class="s-mb-6" type="primary" ghost @click="handleAdd" v-hasPermi="['project:mem:add']">添加项目成员</a-button>
        <s-table ref="table" size="default" rowKey="userId" :columns="columns" :data="loadData" :showPagination="false">
          <span slot="action" slot-scope="text, record, index">
            <a-popconfirm :title="'是否确认删除' + record.nickName" ok-text="是" cancel-text="否" @confirm="handleMemDelete(record, index)">
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
          </span>
        </s-table>
      </div>
    </template>
  </s-form>
</template>

<script>
import moment from 'moment'
import { SForm, STable } from '/src/components/index.js'
import { treeSelect } from '/src/api/eos/project/project.js'
import { addMemApply, updateMemApply, submitApply } from '/src/api/eos/project/memApply.js'
import { listMemAll, delMem, listMemRole } from '/src/api/eos/project/mem.js'
import MemSelect from './MemSelect.vue'
import { log } from '@antv/g2plot/lib/utils'

export default {
  name: 'MemForm',
  components: {
    STable,
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
      // 定义清空状态
      show: false,
      selectedUsers: [],
      projectList: [],
      selectRows: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickName: this.$store.getters.nickname,
        code: 'XMCY-' + moment().format('YYYYMM-DDHHmmss')
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
            prop: 'nickName',
            label: '申请人',
            colspan: 4
          }
        ],
        [
          {
            type: 'treeSelect',
            label: '项目名称',
            prop: 'projectId',
            options: () => this.projectList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            colspan: 4,
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                select: e => {
                  this.selectedUsers = []
                  this.$refs.table.refresh(true)
                  this.$set(this.formData, 'type', null)
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'radio',
            label: '添加成员角色类型',
            prop: 'type',
            options: [
              { dictValue: '销售经理', dictLabel: '销售经理' },
              { dictValue: '项目经理', dictLabel: '项目经理' },
              { dictValue: '普通成员', dictLabel: '普通成员' }
            ],
            colspan: 4,
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                change: e => {
                  listMemRole({
                    role: e.target.value,
                    projectId: this.formData.projectId,
                    state: 0
                  }).then(res => {
                    const userList = []
                    res.data.forEach(item => {
                      const user = {}
                      user.nickName = item.sysUser.nickName
                      user.phonenumber = item.sysUser.phonenumber
                      user.deptName = item.deptName
                      user.role = item.role
                      user.userId = item.userId
                      user.memId = item.id
                      userList.push(user)
                    })
                    this.selectedUsers = userList
                    this.$refs.table.refresh(true)
                  })
                }
              }
            }
          },
          {}
        ]
      ],
      formRules: {
        createBy: { required: true, message: '请填写', trigger: 'blur' },
        code: { required: true, message: '请填写', trigger: 'blur' },
        projectId: { required: true, message: '请选择', trigger: 'change' },
        type: { required: true, message: '请选择', trigger: 'change' }
      },
      columns: [
        {
          title: '#',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '姓名',
          dataIndex: 'nickName',
          align: 'center'
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          align: 'center'
        },
        {
          title: '电话',
          dataIndex: 'phonenumber',
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'role',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.selectedUsers,
            totalCount: this.selectedUsers.length
          }
        })
      }
    }
  },
  created() {
    treeSelect({ state: '0' }).then(res => {
      this.projectList = res.data
    })
  },
  mounted() {
    this.getMems()
  },
  methods: {
    getMems() {
      if (this.isUpdate && !this.isEmpty(this.updateRow) && this.updateRow.id) {
        // 填充表单
        this.formData = { ...this.updateRow }
        this.formData.nickName = this.$store.getters.nickname
        // 禁止更换勾选
        // this.formItems[0][0].compProps.props.disabled = true
        // this.formItems[0][1].compProps.props.disabled = true
        // 查询对应申请单的项目成员
        listMemAll({
          projectId: this.formData.projectId,
          applyId: this.formData.id
        }).then(res => {
          const userList = []
          res.data.forEach(item => {
            const user = {}
            user.nickName = item.sysUser.nickName
            user.phonenumber = item.sysUser.phonenumber
            user.role = item.role
            user.deptName = item.deptName
            user.userId = item.userId
            user.memId = item.id
            userList.push(user)
          })
          this.selectedUsers = userList
          this.$refs.table.refresh(true)
        })
      }
    },
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
    async handleSubmit(callBackFunc) {
      const sealProjectMemList = []
      this.$refs.table.localDataSource.forEach(item => {
        const mem = {}
        mem.applyId = this.formData.id
        mem.role = this.formData.type
        mem.userId = item.userId
        mem.id = item.memId
        sealProjectMemList.push(mem)
      })

      let res = null
      const data = { ...this.formData, sealProjectMemList }
      try{
        res = await addMemApply(data)
        if (callBackFunc instanceof Function) {
          callBackFunc(res)
        } else {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        }
      }catch{
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      }

    },
    // 直接提交申请
    // async handleApply() {
    //   await this.handleSubmit(async res => {
    //     // 直接提交流程
    //     await submitApply({
    //       tenantAppId: this.$store.getters.tenantAppId,
    //       menuId: this.$route.meta.moduleId,
    //       dataId: res.data
    //     })
    //     this.$message.success(res.msg, 3)
    //     this.$emit('ok')
    //     this.$emit('close')
    //   })
    // },
    handleCancel() {
      this.$emit('close')
    },
    handleAdd() {
      if (this.isEmpty(this.formData.projectId)) {
        this.$message.error('请先选择项目！')
        return
      }
      if (this.isEmpty(this.formData.type)) {
        this.$message.error('请先选择添加成员角色类型！')
        return
      }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '选择项目成员',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: MemSelect,
          props: {
            selectType: this.formData.type === '项目经理' ? 'radio' : 'checkbox'
          },
          on: {
            ok: (selectedRows, selectedRowKeys) => {
              const rows = this.selectRows.filter(item => selectedRowKeys.indexOf(item.userId) !== -1)
              if (!this.isEmpty(rows)) {
                const selectUsers = rows.map(({ userId, userName, nickName, dept, phonenumber }) => ({ userId, userName, nickName, dept, phonenumber }))
                selectUsers.forEach(user => {
                  this.selectedUsers.push({ ...user, role: this.formData.type, deptName: user.dept.deptName })
                })
                this.$refs.table.refresh(true)
              }
            },
            rows: (key, row) => {
              for (let i = 0; i < row.length; i++) {
                this.selectRows[this.selectRows.length] = row[i]
              }
              this.selectRows = this.filterArr(this.selectRows)
            }
          }
        }
      })
    },
    // 删除成员
    handleMemDelete(row, index) {
      if (row.memId) {
        delMem(row.memId).then(res => {
          this.$message.success(res.msg)
          // this.getMems()
          this.filterAndRefresh(row.userId)
        })
      } else {
        this.filterAndRefresh(row.userId)
      }
    },
    // 过滤memId和刷新
    filterAndRefresh(userId) {
      this.selectedUsers = this.$refs.table.localDataSource.filter(item => {
        return item.userId !== userId
      })
      this.$refs.table.refresh(true)
    },
    /* 去重 */
    filterArr(row) {
      return row.reduce((acc, current) => {
        const x = acc.find(item => item['userId'] === current['userId'])
        if (!x) {
          return acc.concat([current])
        } else {
          return acc
        }
      }, [])
    }
  }
}
</script>

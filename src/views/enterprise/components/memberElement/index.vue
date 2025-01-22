<template>
  <div>
    <div class="depart-info">
      <div class="depart-name">{{ userTitle }}</div>
      <div class="depart-operate" v-if="title === '全部成员'">
        <div class="edit-name-tip">
          <a-switch size="small" defaultChecked />
          <span>允许成员修改姓名</span>
        </div>
      </div>
      <div class="depart-operate" v-if="deptId && title !== '全部成员' && title !== '离职成员'">
        <a-popover trigger="click" v-model="visible">
          <template slot="content">
            <div class="editNameInput">
              <a-input placeholder="修改名称" v-model="editNameVal" />
            </div>
            <div class="editNameBtn">
              <a-button @click="editDepName(0)"> 取消 </a-button>
              <a-button type="primary" @click="editDepName(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link">修改名称</a-button>
        </a-popover>
        <a-divider type="vertical" />
        <a-popover trigger="click" v-model="setDepLeaderVisible">
          <template slot="content">
            <div class="setDepTree">
              <SelectDepartmentElement ref="treeRef" :treeData="setDepTreeData" :replaceFields="replaceFields" @returnData="returnData" />
            </div>
            <div class="editNameBtn">
              <a-button @click="setDepLeaderDirector(0)"> 取消 </a-button>
              <a-button type="primary" @click="setDepLeaderDirector(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link" @click="initsetDepTreeDataAll">设置部门分管领导</a-button>
        </a-popover>
        <a-divider type="vertical" />
        <a-divider type="vertical" />
        <a-popover trigger="click" v-model="setDepVisible">
          <template slot="content">
            <div class="setDepTree">
              <SelectDepartmentElement ref="treeRef" :treeData="setDepTreeData" :replaceFields="replaceFields" @returnData="returnData" />
            </div>
            <div class="editNameBtn">
              <a-button @click="setDepDirector(0)"> 取消 </a-button>
              <a-button type="primary" @click="setDepDirector(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link" @click="initsetDepTreeDataAll">设置部门主管</a-button>
        </a-popover>
        <a-divider type="vertical" />
        <a-popover trigger="click" v-model="DepVisible">
          <template slot="content">
            <div class="editNameInput">
              <a-input placeholder="添加子部门" v-model="addDepchildVal" />
            </div>
            <div class="editNameBtn">
              <a-button @click="addDepchild(0)"> 取消 </a-button>
              <a-button type="primary" @click="addDepchild(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link">添加子部门</a-button>
        </a-popover>
        <a-popover trigger="click">
          <template slot="content">
            <div class="editNameBtn">
              <a-button @click="deleteDept(false)"> 取消 </a-button>
              <a-button type="primary" @click="deleteDept(true)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link">删除部门</a-button>
        </a-popover>
      </div>
    </div>
    <div class="member-btn-pane">
      <div class="btn-group" v-if="title === '离职成员' ? false : true">
        <a-button ghost type="primary" @click="inviteMembers"> 邀请成员 </a-button>
        <a-popover placement="bottom" trigger="click" v-model="adjusDepVisible">
          <template slot="content">
            <div class="setDepTree">
              <SelectDepartmentElement :multiple="false" :treeData="adjusDepTreeData" :replaceFields="adjusReplaceFields" @returnData="returnAdjusData" />
            </div>
            <div class="editNameBtn">
              <a-button @click="adjusting(0)"> 取消 </a-button>
              <a-button type="primary" @click="adjusting(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button ghost type="primary" @click="initAdjusDepTreeData">调整部门</a-button>
        </a-popover>
        <a-button ghost type="primary" @click="mitosis"> 转为离职 </a-button>
      </div>
      <div class="earch-input">
        <a-input-search placeholder="搜索成员" size="small" style="width: 200px" allow-clear @search="onSearch" />
      </div>
    </div>
    <div class="member-table-content">
      <!-- <div class="member-prompt-container">
        <div class="member-prompt-item">
          <span>有<span class="prompt-num">0</span>名成员未加入</span>
          <span class="invite-member-action">全部再次邀请</span>
        </div>
      </div> -->
      <div class="member-table">
        <!-- 数据表格 -->
        <s-table ref="table" size="default" rowKey="userId" :columns="columns" :data="loadData" :rowSelection="rowSelection" :customRow="customRow">
          <!-- <span slot="action" slot-scope="text, record, index">
            <a-button type="link" @click="makeInvite(text, record, index)"> 再次邀请 </a-button>
            <a-button type="link" @click="rowClick(text, record, index)"> 编辑 </a-button>
          </span> -->
        </s-table>
      </div>
    </div>
    <!-- 邀请成员弹窗 -->
    <a-modal v-model="isIMmodal" title="邀请成员" width="600px" :footer="null" destroyOnClose>
      <a-menu v-model="current" mode="horizontal">
        <a-menu-item key="手动添加成员">手动添加成员 </a-menu-item>
        <a-menu-item key="批量导入成员">批量导入成员 </a-menu-item>
        <a-menu-item key="公开链接邀请">公开链接邀请 </a-menu-item>
      </a-menu>
      <div class="modelContent">
        <div v-if="current[0] === '手动添加成员'">
          <div class="manual-tip">
            <li class="tip-item">成员加入时无法更改您输入的内容，请输入正确的信息</li>
            <li class="tip-item">按输入的联系方式发送邀请；同时输入手机和邮箱，只发送手机邀请</li>
          </div>
          <div class="member-info-form">
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              <a-form-model-item label="姓名" prop="nickName">
                <a-input v-model="form.nickName" />
              </a-form-model-item>
              <!-- <a-form-model-item label="编号" prop="numberID">
                <a-input v-model="form.numberID" />
              </a-form-model-item> -->
              <a-form-model-item label="手机" prop="phonenumber">
                <div class="p-a-c">
                  <countryCodeSelector :countryCode.sync="countryCode" />
                  <a-input v-model="form.phonenumber" />
                </div>
              </a-form-model-item>
              <a-form-model-item label="邮箱" prop="email">
                <a-input v-model="form.email" />
              </a-form-model-item>
            </a-form-model>
          </div>
          <div class="dept-item">
            <div class="item-label">部门：</div>
            <div class="item-content">
              <SelectDepartmentElement :multiple="false" :treeData="treeData" @returnData="returnData" />
            </div>
          </div>
          <div class="btn-group">
            <a-button type="primary" @click="onSubmit"> 邀请 </a-button>
            <a-button @click="resetForm">清空</a-button>
          </div>
        </div>
        <div v-if="current[0] === '批量导入成员'">
          <div class="manual-tip">
            <li class="tip-item">请下载<span class="Download_tem" @click="downloadTem">通讯录模板</span>，按格式修改后导入</li>
            <li class="tip-item">每次最多导入200名成员,已经在通讯录内或信息有误的成员不导入</li>
          </div>
          <div class="upload-wrapper">
            <SUpload :uploadData="uploadData" btn="批量导入成员" />
          </div>
        </div>
        <div v-if="current[0] === '公开链接邀请'">
          <div class="public-link-panel">
            <div class="public-link-operate">
              <p class="link-msg">邀请链接开启邀请链接后，只需访问此链接，即可加入您的企业</p>
              <div class="switch">
                <a-switch v-model="checked" checked-children="开" un-checked-children="关" />
              </div>
            </div>
            <div class="public-link-address" v-if="checked">
              <p class="link-msg">链接地址</p>
              <div class="input-wallperpar">
                <a-input v-model="defaultValue" ref="inputRef" :read-only="true">
                  <div class="copy" slot="addonAfter" @click="copyInputVal">复制</div>
                </a-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { STable, SUpload } from '/src/components/index.js'
import downloadUtil from '/src/utils/common/download.js'
import { previewDoc } from '/src/components/Office/office.js'
import {
  addRole,
  getUserList,
  getDismissList,
  editDeptName,
  getTreeMenu,
  addSystemDepchild,
  queryUserList,
  addDeptPrincipal,
  adjustDeptUser,
  addUserDismiss,
  addDeptPrincipalLeader,
  deptLeaderList,
  deptPrincipalList
} from '/src/api/enterprise/index.js'
import { delDept } from '/src/api/system/dept.js'
import { excelImport } from '/src/api/system/user.js'
import SelectDepartmentElement from '../selectDepartmentElement/index.vue'
import countryCodeSelector from '/src/components/CountryCodeSelector/index.vue'
import Details from './details.vue'

export default {
  components: { STable, SelectDepartmentElement, SUpload, countryCodeSelector },
  props: {
    title: {
      type: String,
      default: '',
      require: true
    },
    deptId: {
      type: Number,
      default: null
    },
    treeNodeData: {
      type: Object,
      require: false,
      default: () => {}
    }
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      /* 查询参数 */
      UserListParams: {
        // isAsc: 'desc',
        // orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        this.UserListParams = Object.assign(this.UserListParams, param)
        if (this.title === '离职成员') {
          return getDismissList(this.UserListParams).then(res => {
            return {
              data: res.rows,
              totalCount: res.total,
              pageNum: param.pageNum,
              pageSize: param.pageSize
            }
          })
        } else {
          return getUserList(this.UserListParams).then(res => {
            return {
              data: res.rows,
              totalCount: res.total,
              pageNum: param.pageNum,
              pageSize: param.pageSize
            }
          })
        }
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'nickName',
          align: 'center'
        },
        {
          title: '手机',
          dataIndex: 'phonenumber',
          align: 'center'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'roles',
          align: 'center',
          customRender: (text, record) => {
            if (text.length > 1) {
              let roles = ''
              text.forEach((item, index) => {
                roles += item.roleName + ','
              })
              return roles
            } else if (text.length === 1) {
              return text[0].roleName
            } else {
              return ''
            }
          }
        },
        {
          title: '部门角色',
          dataIndex: 'userDept',
          align: 'center',
          customRender: (text, record) => {
            let principals = '成员'
            if (text.length > 0) {
              text.forEach((item, index) => {
                if (item.principal === 0) {
                  principals = '主管'
                }
              })
            }
            return principals
          }
        }
        // {
        //   title: '',
        //   width: 160,
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      /* 标题 */
      userTitle: '',
      /* 修改名称气泡弹窗 */
      visible: false,
      /* 添加子部门气泡 */
      DepVisible: false,
      /* 设置部门主管 */
      setDepVisible: false,
      /* 设置部门分管领导 */
      setDepLeaderVisible: false,
      /* 修改名称val */
      editNameVal: '',
      /* 添加子部门 */
      addDepchildVal: '',
      /* 部门ID */
      selectTreeNodeId: null,
      /* 部门分管领导  */
      PrincipalLeaderName: '',
      /* 邀请成员弹窗 */
      isIMmodal: false,
      current: ['手动添加成员'],
      /* 表单 */
      form: {},
      /* 表单规则 */
      rules: {
        nickName: [{ required: true, message: '输入名称', trigger: 'blur' }],
        phonenumber: [{ required: true, message: '输入手机号', trigger: 'blur' }]
      },
      /* 部门树 */
      treeData: [],
      /* 上传 */
      uploadData: {
        compProps: {
          props: {
            multiple: false,
            // name只能叫file Excelfile
            name: 'file',
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
            // 上传之前回调，判断上传类型
            beforeUpload: file => {
              return new Promise((resolve, reject) => {
                if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'sheet,application/vnd.ms-excel') {
                  this.$message.warning('请选择xlsx类型文件')
                  return reject
                }
                return resolve()
              })
            },
            remove: file => {}
          },
          on: {
            // 上传文件改变时的状态
            change: ({ file, fileList, event }) => {
              if (file.status === 'done') {
                // 导入成员
                const url = file.response.url
                excelImport({ url: url }).then(res => {
                  if (res.code === 200) {
                    this.isIMmodal = false
                    this.$message.success('导入成功')
                    this.$refs.table.refresh()
                  }
                })
              }
            },
            // 点击图片预览回调
            preview: this.handlePreview
          }
        }
      },
      /* 是否开启链接 */
      checked: false,
      /* 链接地址 */
      defaultValue: 'aaaaaaaaaaaaaaaaaaa',
      /* 区号 */
      countryCode: 86,
      /* 部门成员树 */
      setDepTreeData: [],
      /* 部门成员树匹配字段 */
      replaceFields: { title: 'nickName', key: 'userId', value: 'userId' },
      /* 部门树返回的数据 */
      rData: [],
      /* 调整部门 */
      adjusDepVisible: false,
      /* 调整部门树 */
      adjusDepTreeData: [],
      adjusReplaceFields: { children: 'children', title: 'label', key: 'id', value: 'id' },
      /* 调整部门返回数据 */
      adjus_rData: []
      /* 单选 */
    }
  },
  methods: {
    /* 表格多选 */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /* 搜索成员 */
    onSearch(val) {
      this.UserListParams.nickName = val
      this.$refs.table.refresh()
    },
    /* 修改部门名称 */
    editDepName(v) {
      if (v === 1) {
        if (!this.editNameVal) {
          return this.$message.error('输入要修改的名称')
        } else {
          editDeptName({ deptId: this.selectTreeNodeId, deptName: this.editNameVal })
            .then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('saveSuccess')
                this.updateUserTitle(this.editNameVal, this.selectTreeNodeId)
                return this.$message.success('修改成功')
              }
            })
            .catch(err => {
              this.visible = false
              return this.$message.error(err)
            })
        }
      } else {
        this.editNameVal = ''
        this.visible = false
      }
    },
    /* 初始化部门成员树 */
    initsetDepTreeData() {
      queryUserList({ deptId: this.selectTreeNodeId })
        .then(res => {
          this.setDepTreeData = res.rows
        })
        .catch(err => {
          this.setDepVisible = false
          return this.$message.error(err)
        })
    },
    /* 初始化成员树 */
    initsetDepTreeDataAll() {
      queryUserList()
        .then(res => {
          this.setDepTreeData = res.rows
        })
        .catch(err => {
          this.setDepVisible = false
          return this.$message.error(err)
        })
    },
    /* 设置部门主管 */
    setDepDirector(v) {
      if (v === 1) {
        if (this.rData.length !== 0) {
          addDeptPrincipal({ deptId: this.selectTreeNodeId, userIds: this.rData.join(',') }).then(res => {
            if (res.code === 200) {
              this.setDepVisible = false
              this.$message.success('设置成功')
              this.updateUserTitle(this.editNameVal, this.selectTreeNodeId)
              this.$refs.table.refresh()
            }
          })
        } else {
          return this.$message.error('输入要设置的部门主管')
        }
      } else {
        this.setDepVisible = false
      }
    },
    /* 设置部门分管领导 */
    setDepLeaderDirector(v) {
      if (v === 1) {
        if (this.rData.length !== 0) {
          addDeptPrincipalLeader({ deptId: this.selectTreeNodeId, userIds: this.rData.join(',') }).then(res => {
            if (res.code === 200) {
              this.setDepLeaderVisible = false
              this.$message.success('设置成功')
              this.updateUserTitle(this.editNameVal, this.selectTreeNodeId)

              this.$refs.table.refresh()
            }
          })
        } else {
          return this.$message.error('输入要设置的部门分管领导')
        }
      } else {
        this.setDepLeaderVisible = false
      }
    },
    /* 添加子部门 */
    addDepchild(v) {
      if (v === 1) {
        if (!this.addDepchildVal) {
          return this.$message.error('输入要添加的子部门')
        } else {
          addSystemDepchild({ parentId: this.selectTreeNodeId, deptName: this.addDepchildVal })
            .then(res => {
              if (res.code === 200) {
                this.DepVisible = false
                this.$emit('saveSuccess')
                return this.$message.success('添加成功')
              }
            })
            .catch(err => {
              this.DepVisible = false
              return this.$message.error(err)
            })
        }
      } else {
        this.addDepchildVal = ''
        this.DepVisible = false
      }
    },
    /* 删除部门 */
    deleteDept(isDelete) {
      if (isDelete) {
        if (this.selectTreeNodeId === null) {
          return this.$message.warning('请选择部门后删除')
        }
        delDept(this.selectTreeNodeId)
          .then(res => {
            if (res.code === 200) {
              this.DepVisible = false
              this.$emit('saveSuccess')
              return this.$message.success('删除成功')
            }
          })
          .catch(err => {
            this.DepVisible = false
            return this.$message.error(err)
          })
      } else {
        this.DepVisible = false
      }
    },
    updateUserTitle(deptName, deptId) {
      this.userTitle = deptName
      let leader = ''
      let principal = ''
      if (!this.isEmpty(deptId)) {
        deptLeaderList({ deptId: deptId }).then(res => {
          const leaderName = res.data.map(e => e.nickName).join(',')
          leader = ' 分管领导: ' + leaderName
          this.userTitle = this.userTitle + leader
        })
        deptPrincipalList({ deptId: deptId }).then(res => {
          const principalName = res.data.map(e => e.nickName).join(',')
          principal = ' 部门主管：' + principalName
          this.userTitle = this.userTitle + principal
        })
      }
    },
    /* 邀请成员 */
    inviteMembers() {
      this.isIMmodal = true
      /* 部门 */
      getTreeMenu().then(res => {
        this.treeData = res.data
      })
    },
    /* 邀请成员提交 */
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = { ...this.form, countryCode: this.countryCode, deptId: this.rData }
          addRole(params).then(res => {
            if (res.code === 200) {
              this.form = {}
              this.countryCode = 86
              this.isIMmodal = false
              this.$refs.table.refresh()
              return this.$message.success('新增成功')
            }
          })
        } else {
          return false
        }
      })
    },
    /* 重置表单 */
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    /* 调整部门 */
    adjusting(v) {
      if (v === 1) {
        if (this.selectedRowKeys.length === 0) {
          return this.$message.warning('选择需要调整的部门成员')
        }
        adjustDeptUser({ deptId: this.adjus_rData, userIds: this.selectedRowKeys.join(',') }).then(res => {
          if (res.code === 200) {
            this.$message.success('调整成功')
            this.adjusDepVisible = false
            this.selectedRowKeys = []
            this.$refs.table.refresh()
          }
        })
      } else {
        this.adjusDepTreeData = []
        this.adjusDepVisible = false
      }
    },
    /* 转为离职 */
    mitosis() {
      if (this.selectedRowKeys.length === 0) {
        return this.$message.warning('选择需要转为离职的成员')
      }
      addUserDismiss({ userIds: this.selectedRowKeys.join(',') }).then(res => {
        if (res.code === 200) {
          this.selectedRowKeys = []
          return this.$message.success('设置成功')
        }
      })
    },
    /* 再次邀请 */
    makeInvite(text, record, index) {},
    /* 下载模板 */
    downloadTem() {
      downloadUtil.resource('/profile/template/通讯录批量导入模板.xlsx')
    },
    // 查看图片
    async handlePreview(file) {
      previewDoc(file.name, file.url)
    },
    /* 复制链接 */
    copyInputVal() {
      this.$refs.inputRef.select()
      document.execCommand('Copy') // 执行浏览器复制命令
      return this.$message.success('复制成功')
    },
    /* 部门树选中返回的数据 */
    returnData(d) {
      this.rData = d
    },
    /* 初始化调整部门树 */
    initAdjusDepTreeData() {
      getTreeMenu().then(res => {
        this.adjusDepTreeData = res.data
      })
    },
    /* 调整部门返回数据回调 */
    returnAdjusData(d) {
      this.adjus_rData = d
    },
    /* 编辑 */
    rowClick(record) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: record.nickName,
          width: '25%',
          maskClosable: true
        },
        content: {
          template: Details,
          props: {
            row: record
          },
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    customRow(record, index) {
      return {
        style: {
          cursor: 'pointer'
        },
        on: {
          click: e => this.rowClick(record)
        }
      }
    }
  },
  watch: {
    title(data) {
      if (data === '离职成员' || data === '全部成员') {
        this.userTitle = data
        this.$emit('clearDeptId') // 清除部门ID
        delete this.UserListParams.deptId
        this.$refs.table.refresh()
      } else {
        this.updateUserTitle(data, this.deptId)
      }
    },
    deptId(data) {
      if (this.title !== '全部成员' && this.title !== '离职成员') {
        this.UserListParams.deptId = data
        this.$refs.table.refresh()
      }
    },
    /* 树节点Data */
    treeNodeData: {
      handler(v) {
        this.selectTreeNodeId = v.eventKey
        this.editNameVal = v.title
      },
      immediate: true
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created() {},
  mounted() {
    this.userTitle = this.title
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>

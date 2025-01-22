<template>
  <div class="setting-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px" label-position="top">
      <el-form-item label="名称" prop="flowName">
        <el-input v-model="formData.flowName" placeholder="请输入审批名称" clearable :style="{ width: '100%' }"> </el-input>
      </el-form-item>
      <el-form-item label="模板图标" prop="icon">
        <img :src="activeIconSrc" style="width: 28px; height: 28px; vertical-align: middle" />
        <el-button plain size="mini" @click="dialogVisible = true" style="margin-left: 10px">选择图标</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择图标" :visible.sync="dialogVisible" width="612px">
      <img v-for="(icon, index) in iconList" :key="index" :src="icon.src" class="icon-item" :class="{ active: selectedIcon === icon.id }" @click="selectedIcon = icon.id" />
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogVisible = false
            selectedIcon = activeIcon
          "
          size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="
            dialogVisible = false
            activeIcon = selectedIcon
          "
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['tabName', 'initiator', 'conf'],
  data() {
    const req = import.meta.globEager('/src/assets/img/lowCode/approverIcon/*.png')
    const iconList = Object.keys(req).map((t, idx) => ({ src: req[t].default, id: idx }))
    return {
      dialogVisible: false,
      activeIcon: this.conf.flowImg ? this.conf.flowImg : iconList[0].id,
      selectedIcon: iconList[0].id,
      formData: {
        flowName: '',
        flowImg: '',
        flowGroup: undefined,
        flowRemark: undefined,
        initiator: null
      },
      rules: {
        flowName: [
          {
            required: true,
            message: '请输入审批名称',
            trigger: 'blur'
          }
        ],
        flowGroup: [
          {
            required: true,
            message: '请选择选择分组',
            trigger: 'change'
          }
        ]
      },
      iconList
    }
  },
  computed: {
    activeIconSrc() {
      const icon = this.iconList.find(t => t.id === this.activeIcon)
      return icon ? icon.src : ''
    }
  },
  created() {
    if (typeof this.conf === 'object' && this.conf !== null) {
      Object.assign(this.formData, this.conf)
    }
  },
  methods: {
    // 给父级页面提供得获取本页数据得方法
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ target: this.tabName })
            return
          }
          this.formData.flowImg = this.activeIcon
          resolve({ formData: this.formData, target: this.tabName }) // TODO 提交表单
        })
      })
    }
  },
  watch: {
    initiator: {
      handler(val) {
        this.formData.initiator = val
      },
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.icon-item{
  width 40px
  height 40px
  margin: 6px
  position relative
  cursor pointer
  opacity .5

  &.active{
    opacity 1
  }
  &:hover{
    opacity 1
  }
}

.setting-container{
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  padding: 16px;

  ::v-deep .el-form--label-top .el-form-item__label{
    padding-bottom: 0;
  }
}
</style>
>

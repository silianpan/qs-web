<!-- 出库申请明细表单 -->
<template>
  <s-form-table ok :okText="'保存'" :queryDictKeys="dictKeys" :formTitle="'出库申请明细表单'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:theader>
      <a-row class="s-mt-6 s-mb-6" type="flex" justify="start" :gutter="16">
        <a-col>编号：{{ formData.code }}</a-col>
        <a-col>申请人：{{ $store.getters.nickname }}</a-col>
      </a-row>
    </template>
  </s-form-table>
</template>

<script>
import moment from 'moment'
import { SFormTable } from '/src/components/index.js'
import { addWarehouseOutDetail, updateWarehouseOutDetail } from '/src/api/eos/warehouse/warehouseOutDetail'

export default {
  name: 'WarehouseOutDetailForm',
  components: {
    SFormTable
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
        code: 'CODE' + moment().format('YYYYMM-DDHHmmss')
      },
      formItems: [
        [
          {
            type: 'input',
            label: '版本',
            prop: 'version',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '租户',
            prop: 'tenantId',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '库房id(一次只能出库一个库房的)',
            prop: 'warehouseId',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '名称',
            prop: 'name',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '描述',
            prop: 'description',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '所属合同id',
            prop: 'contractId',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '单位',
            prop: 'unit',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '数量',
            prop: 'amount',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '单价(预估)',
            prop: 'price',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '总价(预估)',
            prop: 'totalPrice',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '规格型号',
            prop: 'spec',
            colspan: 4
          }
        ],
        [
          {
            type: 'datetime',
            label: '计划到货日期',
            prop: 'planDate',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '供货商',
            prop: 'supplier',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '实际品牌(询价)',
            prop: 'actualBrand',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '实际价格(询价)',
            prop: 'actualPrice',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '实际总价(询价)',
            prop: 'actualPriceTotal',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '价格对比(询价)',
            prop: 'priceDiff',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '出库数量',
            prop: 'outNum',
            colspan: 4
          }
        ]
      ],
      formRules: {
        version: { required: true, message: '请输入', trigger: 'blur' },
        tenantId: { required: true, message: '请输入', trigger: 'blur' },
        warehouseId: { required: true, message: '请输入', trigger: 'blur' },
        name: { required: true, message: '请输入', trigger: 'blur' },
        description: { required: true, message: '请输入', trigger: 'blur' },
        contractId: { required: true, message: '请输入', trigger: 'blur' },
        unit: { required: true, message: '请输入', trigger: 'blur' },
        amount: { required: true, message: '请输入', trigger: 'blur' },
        price: { required: true, message: '请输入', trigger: 'blur' },
        totalPrice: { required: true, message: '请输入', trigger: 'blur' },
        spec: { required: true, message: '请输入', trigger: 'blur' },
        planDate: { required: true, message: '请输入', trigger: 'blur' },
        supplier: { required: true, message: '请输入', trigger: 'blur' },
        actualBrand: { required: true, message: '请输入', trigger: 'blur' },
        actualPrice: { required: true, message: '请输入', trigger: 'blur' },
        actualPriceTotal: { required: true, message: '请输入', trigger: 'blur' },
        priceDiff: { required: true, message: '请输入', trigger: 'blur' },
        outNum: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
    }
  },
  methods: {
    handleSubmit() {
      const fd = { ...this.formData }
      // 更新或添加
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        updateWarehouseOutDetail(fd).then(res => {
          this.$message.success('修改成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        addWarehouseOutDetail(fd).then(res => {
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

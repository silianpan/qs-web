<!-- 商机跟踪 -->
<template>
  <!-- <a-timeline>
    <a-timeline-item v-for="item in stageList" :key="item.id">
      <icon-font slot="dot" type="iconfont-shuju_shangji_shangjimingcheng_huaban1" style="font-size: 24px" />
      <template>
        <a-tag color="blue">{{ item.state }}</a-tag>
        <a-tag color="blue">{{ item.name }}</a-tag>
        <span>{{ item.remark }}</span>
      </template>
    </a-timeline-item>
  </a-timeline> -->
  <!-- <div class="stepList">
    <div status="finish" v-for="(item, index) in stageList" :key="item.id" class="stepItem">
      <div class="left">
        <icon-font slot="icon" type="iconfont-tuandui3" style="font-size: 20px" />
      </div>
      <div class="centerList">
        <a-tag class="s-mg-4" color="#519a73">{{ item.state }}</a-tag>
        <template v-if="item.name">
          <div class="s-mg-4" style="font-size: 14px; color: #f9906f">{{ `${item.name} ${timeFrom(new Date(item.recordTime).getTime())}` }}</div>
          <div class="s-mg-4 columnStyle" style="font-size: 16px; color: #9890e3">
            <Ellipsis :length="20" tooltip>{{ item.remark }}</Ellipsis>
          </div>
        </template>
      </div>
      <div class="line-box" v-if="stageList.length !== index + 1">
        <div class="line"></div>
      </div>
    </div>
  </div> -->
  <a-steps direction="vertical" :current="0" class="custom-step-height">
    <a-step v-for="(item, index) in [...stageList].reverse()" :key="item.id" :status="index !== 0 ? 'finish' : 'process'">
      <icon-font v-if="index === 0" slot="icon" style="color: orange; font-size: 32px" type="iconfont-shuju_shangji_shangjimingcheng_huaban1" />
      <template #title>
        <a-tag :color="index === 0 ? 'orange' : 'blue'">{{ item.state }}</a-tag>
        <a-tag :color="index === 0 ? 'orange' : 'blue'">{{ timeFrom(new Date(item.recordTime).getTime()) }}</a-tag>
      </template>
      <span style="color: #333333" slot="subTitle">{{ item.name }}</span>
      <span slot="description">{{ item.remark }}</span>
    </a-step>
  </a-steps>
</template>

<script>
import { timeFrom } from '/src/utils/common/seal.js'
export default {
  props: {
    stageList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      timeFrom
    }
  }
}
</script>

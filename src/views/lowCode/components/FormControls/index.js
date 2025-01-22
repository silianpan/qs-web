import Amount from './Amount/index.vue'
import Calculation from './Calculation/index.vue'
import TimeDuration from './TimeDuration/index.vue'
import DateDuration from './DateDuration/index.vue'
import OrgTransfer from './OrgTransfer/index.vue'
import OrgSelect from './OrgSelect/index.vue'
import InputTable from './InputTable/index.vue'
const components = [Amount, Calculation, TimeDuration, DateDuration, OrgTransfer, OrgSelect, InputTable]

const install = function (Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install
}

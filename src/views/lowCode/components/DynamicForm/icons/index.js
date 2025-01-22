import Vue from 'vue'
import SvgIcon from '../components/SvgIcon' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// const req = import.meta.globEager('./svg/*.svg')
// const svgList = Object.keys(req).map((t, idx) => ({ src: req[t].default, id: idx }))

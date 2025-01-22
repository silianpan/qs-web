import dayjs from 'dayjs/esm/index.js'
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter'
import advancedFormat from 'dayjs/esm/plugin/advancedFormat'
import customParseFormat from 'dayjs/esm/plugin/customParseFormat'
import weekday from 'dayjs/esm/plugin/weekday'
import weekYear from 'dayjs/esm/plugin/weekYear'
import weekOfYear from 'dayjs/esm/plugin/weekOfYear'
import isMoment from 'dayjs/esm/plugin/isMoment'
import localeData from 'dayjs/esm/plugin/localeData'
import localizedFormat from 'dayjs/esm/plugin/localizedFormat'
import badMutable from 'dayjs/esm/plugin/badMutable'
import 'dayjs/esm/locale/en'
import 'dayjs/esm/locale/zh-cn'

// ### extend
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(weekYear)
dayjs.extend(weekOfYear)
dayjs.extend(isMoment)
dayjs.extend(localeData)
dayjs.extend(localizedFormat)
dayjs.extend(badMutable)

// ### locale
// dayjs.locale('en')
dayjs.locale('zh-cn')

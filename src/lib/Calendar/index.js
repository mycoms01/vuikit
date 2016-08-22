import render from './render'
import momentMixin from '../mixins/moment'
import {
  validDate,
  getCalendarMatrix,
  listWeekDays,
  listYears,
  listMonths,
  isToday,
  isBetween
} from '../../helpers/dates'

export default {
  name: 'VkCalendar',
  mixins: [momentMixin],
  render,
  props: {
    // currently displayed year
    year: {
      type: Number,
      default () {
        return (new Date()).getFullYear() // this year
      }
    },
    // currently displayed month
    month: {
      type: Number, // from 0 to 11
      default () {
        return (new Date()).getMonth() // this month
      }
    },
    // the minimum month that can be displayed
    // supports all moment.js formats
    min: {
      type: [String, Number, Object, Array],
      default: '1980-01-01',
      validator: validDate
    },
    // the maximum month that can be displayed
    // supports all moment.js formats
    max: {
      type: [String, Number, Object, Array],
      default: '2050-12-31',
      validator: validDate
    },
    locale: {
      type: Object,
      default: () => ({})
    },
    fieldComponent: {
      type: [Object, Boolean],
      default: false
    },
    fieldProps: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    selectedYear: {
      get () {
        return this.year
      },
      set (year) {
        const date = this.$moment().set({ year, month: this.month })
        this.$emit('change', date)
      }
    },
    selectedMonth: {
      get () {
        return this.month
      },
      set (month) {
        const date = this.$moment().set({ year: this.year, month })
        this.$emit('change', date)
      }
    },
    listWeekDays,
    date () {
      return this.$moment().set({ year: this.year, month: this.month })
    },
    weeks () {
      return getCalendarMatrix(this.date)
    },
    yearsList () {
      return listYears(this.minMoment, this.maxMoment)
    },
    monthsList () {
      return listMonths(this.date.year(), this.minMoment, this.maxMoment)
    },
    prevMonth () {
      return this.date.clone().subtract(1, 'month')
    },
    nextMonth () {
      return this.date.clone().add(1, 'month')
    },
    minMoment () {
      return Number.isInteger(this.min)
        ? this.$moment().add(-this.min - 1, 'days')
        : this.$moment(this.min || this.$options.props.min.default)
    },
    maxMoment () {
      return Number.isInteger(this.max)
        ? this.$moment().add(this.max, 'days')
        : this.$moment(this.max || this.$options.props.max.default)
    }
  },
  methods: {
    isToday,
    isDisplayable (moment) {
      return isBetween(moment, this.minMoment, this.maxMoment)
    },
    isInCurrentMonth (moment) {
      return moment.isSame(this.date, 'month')
    }
  }
}

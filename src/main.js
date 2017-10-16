// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import global_ from './components/global'
import * as uiv from 'uiv'
import Multiselect from 'vue-multiselect'
import locale from 'uiv/src/locale/lang/zh-CN'
import _class from './class.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import './assets/css/public.css'

Vue.config.productionTip = false
Vue.prototype.$ajax = axios
Vue.prototype.GLOBAL = global_
Vue.prototype._class = _class
/* eslint-disable no-new */
Vue.use(uiv, {locale})
Vue.component('multiselect', Multiselect)
Vue.component('page-limit', {
  template: '<div style="margin-top:20px"><slot name="pagedata" :data="getPageData()" :pageOption="paginationOption"></slot></div>',
  props: ['data','option','limitSize'],
  data () {
    return {
      paginationOption: {
        limitSize: 10,
        page: 1,
        totalPage: 1,
        maxSize: 8,
        size: 'md',
        boundaryLinks: true
      }
    }
  },
  mounted () {
    this.$watch('data', function (newVal, oldVal) {
      this.init()
    })
  },
  methods: {
    init: function () {
      this.paginationOption = Object.assign({}, this.paginationOption, this.option)
      this.paginationOption.limitSize = this.limitSize || this.paginationOption.limitSize
      if (Array.isArray(this.data)) {
        var p = Math.floor(this.data.length / this.paginationOption.limitSize)
        this.paginationOption.totalPage = p == 0?1:p
      }
    },
    getPageData: function () {
      if (!this.data)
      return false
      var arr = [], pageArr = []
      for (var k = 0; k < this.paginationOption.limitSize; k++) {
        if (this.data[(this.paginationOption.page - 1) * this.paginationOption.limitSize + k]) {
          arr.push(this.data[(this.paginationOption.page - 1) * this.paginationOption.limitSize + k])
        } else {
          break
        }
      }
      return arr
    }
  }
})
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data () {
    return {
      userinfo: {
        realname: '游客'
      }
    }
  },
  mounted () {
    window.$vue = this
  }
})

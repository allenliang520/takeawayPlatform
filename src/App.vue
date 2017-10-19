<template>
  <div id="app" v-if='pageShow'>
    <Topbar></Topbar>
    <router-view></router-view>
    <modal v-model="modalOpen" :title="modalConfig.title" :size="modalConfig.size" :backdrop="modalConfig.backdrop" :footer="modalConfig.footer" :header="modalConfig.header" :cancel-text="modalConfig['cancel-text']" :ok-text="modalConfig['ok-text']" :transition-duration="modalConfig['transition-duration']" :keyboard="modalConfig.keyboard">
      <div v-text="modalConfig.text"></div>
      <div slot="footer">
        <button type="button" class="btn btn-default" v-text="modalConfig['cancel-text']" v-if="modalConfig.cancelBtn" @click="modalConfig.closeFn(0)"></button>
        <button type="button" class="btn btn-primary" v-text="modalConfig['ok-text']" v-if="modalConfig.okBtn" @click="modalConfig.closeFn(1)"></button>
      </div>
    </modal>
    <modal v-model="msgOpen" :title="msgConfig.title" :size="msgConfig.size" :backdrop="msgConfig.backdrop" :footer="msgConfig.footer" :header="msgConfig.header" :cancel-text="msgConfig['cancel-text']" :ok-text="msgConfig['ok-text']" :transition-duration="msgConfig['transition-duration']" :keyboard="msgConfig.keyboard">
      <div v-text="msgConfig.text"></div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import Topbar from './components/topbar'
import Cms from '@/components/Cms/Cms'
export default {
  name: 'app',
  components: { Topbar },
  data () {
    return {
      pageShow: false,
      userinfo: {},
      modalOpen: false,
      modalConfig: {},
      msgOpen: false,
      msgConfig: {
        title: '',
        size: 'sm',
        backdrop: true,
        footer: false,
        header: false,
        'cancel-text': 'Cancel',
        'ok-text': 'Ok',
        'transition-duration': 150,
        keyboard: true,
        text: ''
      },
      menuList: [],
      menuRouter: []
    }
  },
  methods: {
    modalShow: function (option) {
      console.log(this)
      var defaultOption = {
        title: '',
        size: 'sm',
        backdrop: true,
        footer: true,
        header: true,
        cancelBtn: true,
        okBtn: true,
        'cancel-text': 'Cancel',
        'ok-text': 'Ok',
        'transition-duration': 150,
        keyboard: true,
        text: '',
        okFn: function () {},
        cancelFn: function () {},
        mustFn: function () {},
        closeFn: function (t) {
          if (t === 0) {
            this.modalConfig.cancelFn()
          } else if (t === 1) {
            this.modalConfig.okFn()
          }
          this.modalOpen = false
        }.bind(this)
      }
      typeof option === 'object' ? this.modalConfig = Object.assign({}, defaultOption, option) : this.modalConfig.text = option
      this.modalOpen = true
    },
    msgShow: function (option) {
      this.msgConfig.text = option
      this.msgOpen = true
    },
    addMenu: function (menu) {
      var imp = {}
      menu.forEach(function (t) {
        t.children.forEach(function (n) {
          var o = {}
          o.name = t.classKey + n.key
          o.path = o.name
          o.classKey = t.classKey
          o.key = n.key
          if (n.params) {
            for (var k = 0; k < n.params.length; k++) {
              o.path += (k === 0 ? '?' : '&') + '' + n.params[k]
            }
          }
          imp[t.classKey + n.key] = resolve => require(['@/components/Cms/' + t.classKey + '/' + n.key], resolve)
          o.component = imp[t.classKey + n.key]
          this.menuRouter.push(o)
        }, this)
      }, this)
      var o2 = [{
        path: '/cms',
        name: 'cms',
        component: Cms,
        children: this.menuRouter
      }]
      this.$router.addRoutes(o2)
      this.showMenu = true
    },
    getMenu: function () {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchAllUserMenu'
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.$set(this, 'menuList', res.data.data)
              this.addMenu(res.data.data)
            }
          }
          .bind(this)
        )
    }
  },
  mounted () {
    Vue.prototype.modalShow = this.modalShow
    Vue.prototype.msgShow = this.msgShow
    this.$ajax(
      {
        method: 'get',
        url: '/uc/getUserinfo'
      }
    ).then(
      function (res) {
        if (res.data.code === 0) {
          this.GLOBAL.userinfo = res.data.data
          this.userinfo = res.data.data
          this.getMenu()
        } else {
          if (this.$route.name !== 'Login') {
            this.$router.push({name: 'Login', query: {to: this.$route.path, query: encodeURI(JSON.stringify(this.$route.query))}})
          } else {
            this.$router.push({name: 'Login', query: this.$route.query})
          }
        }
        this.pageShow = true
      }
        .bind(this)
      )
  }
}
</script>

<style>
#app {}
#app .modal .modal-header button.close{display: none}
</style>

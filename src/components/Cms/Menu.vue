<template>
    <div>
        <nav class="">
            <ul class="nav">
                <li  v-for="m in menuList" :class="{'active':m.classKey == $route.params.classKey}">
                  <a href="javascript:;" class="menuClass">
                    {{m.className}}
                  </a>
                  <ul class="nav">
                    <li class="" v-for="c in m.children" :class="{'active':c.key == $route.params.key || c.actKey == $route.params.key}" v-if="c.show">
                      <router-link :to="{name:m.classKey+c.key,params:{classKey:m.classKey,key:c.key}}">
                        {{c.name}}
                      </router-link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="javascript:;" class="menuClass" @click="refresh()">
                    缓存刷新
                  </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
  name: 'menu',
  data () {
    return {
      menuList: this.$parent.menuList
    }
  },
  mounted () {
  },
  methods: {
    refresh: function () {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/refresh'
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.modalShow({
                backdrop: false,
                cancelBtn: false,
                text: res.data.message,
                okFn: function () {
                  window.location.reload(true)
                }
              })
            } else {
              this.msgShow(res.data.message)
            }
          }
          .bind(this)
        )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#menu{position: relative;top: 00px;left: 0px;min-height: 100%;padding-bottom: 9999em;margin: 20px 0 -9999em 0; }
.nav>li a{font-size: 14px;padding: 4px 20px;}
.nav>li .menuClass{border-left: 2px solid transparent;background-color: transparent;}
.nav>li.active .menuClass{  padding-left: 18px;  font-weight: bold;  color: #563d7c; border-color: #563d7c;}
.nav>li li a{padding-left: 28px;color: #767676;border-left: 2px solid transparent;font-size: 13px;}
.nav>li.active li.active a{color: #563d7c; border-color: #563d7c;background-color: #eee}
.nav>li.active li.active a:hover{color: #563d7c;border-left: 2px solid; border-color: #563d7c;background-color: #eee;padding-left: 28px;}
.nav>li li a:hover{border-left: 1px solid #563d7c;padding-left: 29px;}
</style>

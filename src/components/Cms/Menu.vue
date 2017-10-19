<template>
    <div>
        <nav class="">
            <ul class="nav">
                <li  v-for="m in menuList" :class="{'active': $route.name.indexOf(m.classKey) >= 0}" v-if="m.children && m.children.length>0">
                  <a href="javascript:;" class="menuClass">
                    {{m.className}}
                  </a>
                  <ul class="nav">
                    <li class="" v-for="c in m.children" :class="{'active':m.classKey+c.key == $route.name || m.classKey+c.activeKey == $route.name}" v-if="c.show == 'true' || c.show == true">
                      <router-link :to="{name:m.classKey+c.key}">
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
  name: 'cms-menu',
  data () {
    return {
      menuList: this.$parent.$parent.menuList
    }
  },
  mounted () {
    this.$watch('$parent.$parent.menuList', function (nv, ov) {
      this.$set(this, 'menuList', nv)
    })
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

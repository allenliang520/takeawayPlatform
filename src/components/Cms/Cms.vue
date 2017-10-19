<template>
  <div id="cms">
    <div class="container">
      <div id="menu" class="col-xs-2">
        <cms-menu v-if="showMenu"></cms-menu>
      </div>
      <div id="main" class="col-xs-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Cms/Menu'
export default {
  name: 'cms',
  components: {
    'cms-menu': Menu
  },
  data () {
    return {
      showMenu: true
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#cms{padding-top: 55px;min-height: 683px;overflow: hidden;}
#cms #main,#cms #menu{margin-top: 20px;}
</style>

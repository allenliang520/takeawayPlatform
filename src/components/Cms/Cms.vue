<template>
  <div id="cms">
    <div class="container">
      <div id="menu" class="col-xs-2">
        <router-view name="menu"></router-view>
      </div>
      <div id="main" class="col-xs-10" v-if="this.$route.name == (this.$route.params.classKey+this.$route.params.key)">
        <router-view name="main"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import MenuObj from '@/menu.config'
export default {
  name: 'cms',
  data () {
    return {
      menuList: MenuObj.menuList
    }
  },
  mounted () {
    if (this.$route.name !== (this.$route.params.classKey + this.$route.params.key)) {
      this.$router.push({name: (this.$route.params.classKey + this.$route.params.key), params: {classKey: this.$route.params.classKey, key: this.$route.params.key}})
    }
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

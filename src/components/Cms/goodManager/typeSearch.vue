<template>
  <div id="search">
    <router-link class="btn btn-default" :to="{name:'goodManagertypeAdd',params:{classKey:'goodManager',key:'typeAdd'}}">
      添加分类
    </router-link>
    <table class="table table-striped table-hover ">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in typeList" :key="o.id">
          <td>{{o.id}}</td>
          <td>{{o.name}}</td>
          <td>
            <router-link class="btn btn-default btn-sm" :to="{name:'goodManagertypeAdd',query:{id:o.id}}">
              编辑
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      typeList: []
    }
  },
  mounted () {
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllGoodsType'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.typeList = res.data.data
          }
        }
        .bind(this)
      )
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>

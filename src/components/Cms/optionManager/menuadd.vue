<template>
  <div id="add">
    <div class="container-fluid">
      <form class="form-horizontal" @submit.prevent="submitPost">
        <div class="form-group">
          <label class="col-sm-2 control-label">名称:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="menuData.name" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">key:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="menuData.key" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">侧边栏显示:</label>
          <div class="col-sm-10">
            <select name="" id="" class="form-control"  v-model="menuData.show">
              <option value="true">是</option>
              <option value="false">否</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">classKey:</label>
          <div class="col-sm-10">            
            <select name="" id="" class="form-control"  v-model="menuData.classKey">
              <option v-for="o in menuList.menuClass" :key="o.id" :value="o.classKey" v-text="o.name"></option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">activeKey:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="menuData.activeKey">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">状态:</label>
          <div class="col-sm-10">
            <select name="" id="" class="form-control" v-model="menuData.status">
              <option value="0">无效</option>
              <option value="1">有效</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-default">保存</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add',
  data () {
    return {
      menuList: [],
      menuData: {
        name: '',
        key: '',
        show: 'true',
        classKey: '',
        activeKey: '',
        params: '',
        status: 1
      }
    }
  },
  mounted () {
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllMenu?status=-1'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.menuList = res.data.data
          }
        }
        .bind(this)
      )
    if (this.$route.query.id) {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchMenu?id=' + this.$route.query.id
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.menuData = res.data.data
              this.menuData.id = this.$route.query.id
            }
          }
          .bind(this)
        )
    }
  },
  methods: {
    submitPost: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/cms/saveMenu',
          data: this.menuData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.$parent.msgShow(res.data.message)
            this.$router.push({name: 'optionManagermenusearch'})
          } else {
            this.$parent.msgShow(res.data.message)
          }
        }
        .bind(this)
      )
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

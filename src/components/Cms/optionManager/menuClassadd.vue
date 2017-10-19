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
      menuData: {
        name: '',
        key: ''
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchMenuClass?id=' + this.$route.query.id
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
          url: '/cms/saveMenuClass',
          data: this.menuData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.$parent.msgShow(res.data.message)
            this.$router.push({name: 'optionManagermenuClasssearch'})
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

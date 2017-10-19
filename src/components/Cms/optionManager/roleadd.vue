<template>
  <div id="add">
    <div class="container-fluid">
      <form class="form-horizontal" @submit.prevent="submitPost">
        <div class="form-group">
          <label class="col-sm-2 control-label">名称:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="roleData.name" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">状态:</label>
          <div class="col-sm-10">
            <select name="" id="" class="form-control" v-model="roleData.status">
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
      roleData: {
        name: '',
        status: 1
      }
    }
  },
  mounted () {
    console.log(this.$route)
    if (this.$route.query.id) {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchRole?id=' + this.$route.query.id
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.roleData = res.data.data
              this.roleData.id = this.$route.query.id
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
          url: '/cms/saveRole',
          data: this.roleData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.$parent.msgShow(res.data.message)
            this.$router.push({name: 'optionManagerrolesearch'})
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

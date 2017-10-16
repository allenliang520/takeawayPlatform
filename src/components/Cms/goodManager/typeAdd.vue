<template>
  <div id="add">
    <div class="container-fluid">
      <form class="form-horizontal" @submit.prevent="submitPost">
        <div class="form-group">
          <label class="col-sm-2 control-label">名称:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="goodData.name" required>
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
      shopsList: [],
      goodData: {
        name: ''
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchGoodsType?id=' + this.$route.query.id
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.goodData = res.data.data
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
          url: '/cms/saveGoodsType',
          data: this.goodData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.msgShow(res.data.message)
            this.$router.push({name: 'goodManagertypeSearch', params: {classKey: 'goodManager', key: 'typeSearch'}})
          } else {
            this.msgShow(res.data.message)
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

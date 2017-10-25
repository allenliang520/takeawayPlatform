<template>
  <div id="add">
    <div class="container-fluid">
      <form class="form-horizontal" @submit.prevent="submitPost">
        <div class="form-group">
          <label class="col-sm-2 control-label">名称:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="shopData.name" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">地址:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="shopData.address" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">电话:</label>
          <div class="col-sm-10">
            <div v-for="(o,index) in shopData.phone" :key="index">
              <div class="input-group">
                <input type="text" class="form-control" v-model="shopData.phone[index]">
                <div class="input-group-btn">
                  <button type="button" class="btn btn-default" v-if="shopData.phone.length>1" @click="removePhone(index)">Remove</button>
                  <button type="button" class="btn btn-default" v-if="index==shopData.phone.length-1" @click="addPhone()">Add</button>
                </div>
              </div>
              <br>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">状态:</label>
          <div class="col-sm-10">
            <select name="" id="" class="form-control" v-model="shopData.status">
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
      shopData: {
        name: '',
        address: '',
        status: 1,
        phone: ['']
      }
    }
  },
  mounted () {
    console.log(this.$route)
    if (this.$route.query.id) {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchShop?id=' + this.$route.query.id
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.shopData = res.data.data
            }
          }
          .bind(this)
        )
    }
  },
  methods: {
    addPhone: function () {
      this.shopData.phone.push('')
    },
    removePhone: function (index) {
      this.shopData.phone.splice(index, 1)
    },
    submitPost: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/cms/saveShop',
          data: this.shopData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.$parent.msgShow(res.data.message)
            this.$router.push({name: 'shopManagersearch'})
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

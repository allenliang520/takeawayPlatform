<template>
  <div id="add">
    <div class="container-fluid">
      <form class="form-horizontal" @submit.prevent="submitPost">
        <div class="form-group">
          <label class="col-sm-2 control-label">权限:</label>
          <div class="col-sm-10">
            <div class="col-sm-4" v-for="o in menuList" :key="o.id">
              <div class="checkbox">
                <input type="checkbox" value="" :checked="isCheck(o.id)" @click="idsToggle(o.id)">
                <span @click="idsToggle(o.id)">{{o.name}}</span>
              </div>
            </div>
          </div>
          <div class="col-sm-10 col-sm-offset-2" style="margin-top:20px">
              <div class="btn btn-sm btn-default" @click="idsAll()">全选</div>
              <div class="btn btn-sm btn-default" @click="idsNo()">全不选</div>
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
      reData: {
        menuIds: []
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
            this.menuList = res.data.data.menus
          }
        }
        .bind(this)
      )
    if (this.$route.query.id) {
      this.reData.roleId = this.$route.query.id
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchRolesResources?roleId=' + this.$route.query.id
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.reData = res.data.data
            }
          }
          .bind(this)
        )
    } else {
      this.$router.push({name: 'optionManagerrolesearch'})
    }
  },
  methods: {
    isCheck: function (id) {
      if (this.reData.menuIds.indexOf(id) >= 0) {
        return true
      }
      return false
    },
    idsToggle: function (id) {
      if (!this.isCheck(id)) {
        this.reData.menuIds.push(id)
      } else {
        this.$delete(this.reData.menuIds, this.reData.menuIds.searchIndex(id))
      }
    },
    idsAll: function () {
      this.reData.menuIds = []
      this.menuList.forEach(function (element) {
        this.reData.menuIds.push(element.id)
      }, this)
    },
    idsNo: function () {
      this.reData.menuIds = []
    },
    submitPost: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/cms/saveRoleResources',
          data: this.reData
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

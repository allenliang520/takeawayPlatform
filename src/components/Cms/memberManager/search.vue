<template>
  <div id="search">
    <page-limit :data="userList" >
      <template slot="pagedata" scope="props">        
        <table class="table table-striped table-hover ">
          <thead>
            <tr>
              <th>#</th>
              <th>用户名</th>
              <th>真名</th>
              <th>电话</th>
              <th>QQ</th>
              <th>角色</th>
              <th>状态</th>
              <th>注册时间</th>
              <th>最近登录时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in props.data" :key="o.id">
              <td>{{o.id}}</td>
              <td>{{o.username}}</td>
              <td>{{o.realname}}</td>
              <td>{{o.tel}}</td>
              <td>{{o.qq}}</td>
              <td>{{o.rolename}}</td>
              <td :class="{'text-danger':o.status==0,'text-success':o.status==1}">{{o.status==0?'无效':'有效'}}</td>
              <td>{{o.createtime}}</td>
              <td>{{o.logintime}}</td>
              <td>
                <button class="btn btn-default btn-sm" v-if="o.status==1" @click="statusCheck(o,0)">无效</button>
                <button class="btn btn-default btn-sm" v-if="o.status==0" @click="statusCheck(o,1)">生效</button>
                <div class="btn btn-default btn-sm" v-if="o.roleId != 1 && $parent.$parent.userinfo.roleId == 1" @click="showModal(o)">设置</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pageLimitCon">
          <pagination class="text-center" v-model="props.pageOption.page" :total-page="props.pageOption.totalPage" :boundary-links="props.pageOption.boundaryLinks" :max-size="props.pageOption.maxSize"  :size="props.pageOption.size" ></pagination>
          <div class="limitSize">
            <span>每页显示</span>
            <input type="text" class="form-control input-sm" v-model="props.pageOption.limitSize" style="display: inline-block;width: 40px;text-align: center;">
            <span>条</span>
          </div>
        </div>
      </template>
    </page-limit>
    <modal id="user" v-model="modalOpen" :title="modalConfig.title" :size="modalConfig.size" :backdrop="modalConfig.backdrop" :footer="modalConfig.footer" :header="modalConfig.header" :cancel-text="modalConfig['cancel-text']" :ok-text="modalConfig['ok-text']" :transition-duration="modalConfig['transition-duration']" :keyboard="modalConfig.keyboard">
      <div>        
        <form class="form-horizontal" @submit.prevent="submitPost">
          <div class="form-group">
            <label class="col-sm-2 control-label">角色:</label>
            <div class="col-sm-10">            
            <select name="" id="" class="form-control"  v-model="userData.roleId">
              <option v-for="o in roleList" :key="o.id" :value="o.id" v-text="o.name"></option>
            </select>
            </div>
          </div>
        </form>
      </div>
      <div slot="footer">
        <button type="button" class="btn btn-default" v-text="modalConfig['cancel-text']" v-if="modalConfig.cancelBtn" @click="modalConfig.closeFn(0)"></button>
        <button type="button" class="btn btn-primary" v-text="modalConfig['ok-text']" v-if="modalConfig.okBtn" @click="modalConfig.closeFn(1)"></button>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      modalOpen: false,
      modalConfig: {},
      userList: [],
      roleList: [],
      userData: {}
    }
  },
  mounted () {
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllUser'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.userList = res.data.data
          }
        }
        .bind(this)
      )
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllRole'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.roleList = res.data.data
          }
        }
        .bind(this)
      )
  },
  methods: {
    showModal: function (user) {
      var option = {
        title: '设置 ' + user.username + ' 角色',
        size: 'lg',
        backdrop: true,
        footer: true,
        header: true,
        cancelBtn: true,
        okBtn: true,
        'cancel-text': 'Cancel',
        'ok-text': 'Ok',
        'transition-duration': 150,
        keyboard: true,
        text: '',
        okFn: this.setUserRole,
        cancelFn: function () {},
        mustFn: function () {},
        closeFn: function (t) {
          if (t === 0) {
            this.modalConfig.cancelFn()
          } else if (t === 1) {
            this.modalConfig.okFn()
          }
          this.modalOpen = false
        }.bind(this)
      }
      typeof option === 'object' ? this.modalConfig = Object.assign({}, this.modalConfig, option) : this.modalConfig.text = option
      this.userData.id = user.id
      this.userData.username = user.username
      this.userData.roleId = user.roleId
      this.modalOpen = true
    },
    setUserRole: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/cms/setUserRole',
          data: {
            roleId: this.userData.roleId,
            id: this.userData.id
          }
        }
        ).then(
          function (res) {
            console.log(res)
            if (res.data.code === 0) {
              this.userList.searchByKey('id', this.userData.id).roleId = this.userData.roleId
              this.userList.searchByKey('id', this.userData.id).rolename = this.roleList.searchByKey('id', this.userData.roleId).name
            }
            this.modalOpen = false
            this.msgShow(res.data.message)
          }
          .bind(this)
        )
    },
    statusCheck: function (o, t) {
      this.modalShow({
        backdrop: true,
        text: '确定设置 ' + o.name + ' ' + (t === 0 ? '无效?' : '有效?'),
        okFn: function () {
          this.setUserStatus(o, t)
        }.bind(this)
      })
    },
    setUserStatus: function (o, t) {
      console.log(o)
      this.$ajax(
        {
          method: 'post',
          url: '/cms/setUserStatus',
          data: {
            status: t,
            id: o.id
          }
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              o.status = t
            }
            this.msgShow(res.data.message)
          }
          .bind(this)
        )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>

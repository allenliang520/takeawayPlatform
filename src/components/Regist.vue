<template>
  <div class="regist container-fluid">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <div class="registCon container-fluid">
          <form action="" @submit.prevent="submit">
            <h3 class="">Sign up</h3>
            <div class="form-group" :class="{'has-error':checkStatus.username==1,'has-success':checkStatus.username==2}">
              <input type="text" class="input-lg form-control" placeholder="Username" v-model="registData.username" @blur="checkStatus.username=!registData.username?1:2" required>
            </div>
            <div class="form-group" :class="{'has-error':checkStatus.password==1,'has-success':checkStatus.password==2}">
              <input type="password" class="input-lg form-control" placeholder="Password"  v-model="registData.password" @blur="checkStatus.password=!registData.password?1:2" required>
            </div>
            <div class="form-group" :class="{'has-error':checkStatus.realname==1,'has-success':checkStatus.realname==2}">
              <input type="text" class="input-lg form-control" placeholder="Real name" v-model="registData.realname" required @keyup="checkStatus.realname=!registData.realname?1:2" >
            </div>
            <div class="form-group" :class="{'has-error':checkStatus.tel==1,'has-success':checkStatus.tel==2}">
              <input type="phone" class="input-lg form-control" placeholder="Telephone" v-model="registData.tel" required @keyup="telcheck" maxlength="11">
            </div>
            <div class="form-group">
              <input type="text" class="input-lg form-control" placeholder="QQ" v-model="registData.qq">
            </div>
            <div class="form-group">
              <router-link to="Login" class="btn btn-default btn-lg btn-default " type="button" >
                 Back
              </router-link>
              <button class="btn btn-default btn-lg btn-primary " type="submit">Regist</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'regist',
  data () {
    return {
      registData: {
        username: '',
        password: '',
        realname: '',
        tel: '',
        qq: ''
      },
      checkStatus: {
        username: 0,
        password: 0,
        realname: '',
        tel: 0
      }
    }
  },
  methods: {
    telcheck: function () {
      if (this.registData.tel.length !== 11) {
        this.checkStatus.tel = 1
      } else if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.registData.tel)) {
        this.checkStatus.tel = 2
      } else {
        this.checkStatus.tel = 1
      }
    },
    submit: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/uc/toRegist',
          data: this.registData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.GLOBAL.userinfo = res.data.data
            this.$parent.userinfo = res.data.data
            this.$router.push('/')
            this.$parent.msgShow(res.data.message)
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
.registCon{
  margin-top: 20%;
}
</style>

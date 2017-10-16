<template>
  <div class="login container-fluid">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <div class="loginCon container-fluid">
          <form action="" @submit.prevent="submit">
            <h3 class="">Login in</h3>
            <div class="form-group" :class="{'has-error':checkStatus.username==1,'has-success':checkStatus.username==2}">
              <input type="text" class="input-lg form-control" placeholder="Username" v-model="loginData.username" @blur="checkStatus.username=!loginData.username?1:2">
            </div>
            <div class="form-group" :class="{'has-error':checkStatus.password==1,'has-success':checkStatus.password==2}">
              <input type="password" class="input-lg form-control" placeholder="Password"  v-model="loginData.password" @blur="checkStatus.password=!loginData.password?1:2">
            </div>
            <div class="form-group">
              <router-link to="Regist" class="btn btn-default btn-lg btn-default " type="button" >
                 Sign up
              </router-link>
              <button class="btn btn-default btn-lg btn-primary " type="submit">Login</button>
              <button class="btn btn-default btn-lg btn-primary hidden" type="button" @click="test">test</button>              
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginData: {
        username: '',
        password: ''
      },
      checkStatus: {
        username: 0,
        password: 0
      }
    }
  },
  methods: {
    check: function () {
      return true
    },
    submit: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/uc/toLogin',
          data: this.loginData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.GLOBAL.userinfo = res.data.data
            this.$parent.userinfo = res.data.data
            this.$router.push('/')
          } else {
            this.$parent.msgShow(res.data.message)
          }
        }
        .bind(this)
      )
      return false
    },
    test: function () {
      this.$ajax(
        {
          method: 'get',
          url: '/ajax/'
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginCon{
  margin-top: 20%;
}
</style>

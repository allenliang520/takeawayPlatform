<template>
  <div class="profile container-fluid">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <div class="profileCon container-fluid">
          <form action="" @submit.prevent="submit">
            <h3 class="">Profile</h3>
            <div class="form-group" :class="{'has-error':checkStatus.realname==1,'has-success':checkStatus.realname==2}">
              <input type="text" class="input-lg form-control" placeholder="Real name" v-model="profileData.realname" required @keyup="checkStatus.realname=!profileData.realname?1:2" >
            </div>
            <div class="form-group" :class="{'has-error':checkStatus.tel==1,'has-success':checkStatus.tel==2}">
              <input type="phone" class="input-lg form-control" placeholder="Telephone" v-model="profileData.tel" required @keyup="telcheck" maxlength="11">
            </div>
            <div class="form-group">
              <input type="text" class="input-lg form-control" placeholder="QQ" v-model="profileData.qq">
            </div>
            <div class="form-group">
              <button class="btn btn-default btn-lg btn-primary " type="submit">Save</button>         
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
      profileData: {
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
  mounted () {
    this.profileData.realname = this.$parent.userinfo.realname
    this.profileData.tel = this.$parent.userinfo.tel
    this.profileData.qq = this.$parent.userinfo.qq
  },
  methods: {
    telcheck: function () {
      if (this.profileData.tel.length !== 11) {
        this.checkStatus.tel = 1
      } else if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.profileData.tel)) {
        this.checkStatus.tel = 2
      } else {
        this.checkStatus.tel = 1
      }
    },
    submit: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/c/saveProfile',
          data: this.profileData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.GLOBAL.userinfo = res.data.data
            this.$parent.userinfo = res.data.data
            this.$router.push('/')
            this.$parent.msgShow(res.data.message)
          } else if (res.data.code === -99) {
            this.$parent.msgShow(res.data.message)
            this.$router.push('Login')
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
.profileCon{
  margin-top: 20%;
}
</style>

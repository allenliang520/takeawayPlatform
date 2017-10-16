<template>
    <div id="topbar">
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <ul class="nav pull-right">
                    <li role="presentation" class="active">                        
                        <router-link to="/">
                        Home
                        </router-link>
                    </li>
                    <li role="presentation" v-if="!$parent.userinfo.realname">
                        <router-link to="/Login">
                         Login In
                        </router-link>
                    </li>
                    <dropdown tag="li" role="presentation" :menu-right='true' v-if="$parent.userinfo.realname">
                        <a data-role="trigger" href="javascript:;" class="dropdown-toggle" type="button">
                            <span v-text="$parent.userinfo.realname"></span>
                            <span class="caret"></span>
                        </a>
                        <template slot="dropdown">
                            <li>
                                <router-link to="/cms/">
                                Manage
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/Profile">
                                Profile
                                </router-link>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li @click="loginOut">
                                <a href="#">Login Out</a>
                            </li>
                        </template>    
                    </dropdown>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
  name: 'topbar',
  data () {
    return {
      userinfo: {
        realname: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    loginOut: function () {
      this.$ajax(
        {
          method: 'post',
          url: '/uc/loginOut'
        }
      ).then(
        function (req, data) {
          this.$parent.userinfo = {}
        }.bind(this)
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
#topbar .nav>li{display: inline-block;}
#topbar .nav>li>a{padding: 15px}
</style>

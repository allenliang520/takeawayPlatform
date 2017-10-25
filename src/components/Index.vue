<template>
  <div id="index">
    <div id="dmContent">
      <div class="con">
        <div class="videoConver" @dblclick="fullVideo"></div>
        <video :src="ioData.videoData.src" :controls="ioData.videoData.control" id="video" ></video>
        <div class="dm-row" v-for="(row,index) in ioData.msgGet" :key="index">
          <span class="dm-p dm-run" v-for="(p,index) in row" :key="index" v-if="p.text" v-text="p.user.realname + ': ' + p.text" ></span>
          <span class="dm-p dm-run" v-for="(p,index) in row" :key="index" v-if="!p.text" v-text="'Welcome '+p.user.realname + ' login'" ></span>
        </div>
      </div>
    </div>
    <div id="dmControl">
      <div class="con">
        <div class="container-fluid">
          <form action="" @submit.prevent="ioMsgPost">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Say something..." v-model="ioData.controlData.text">
            <div class="input-group-btn">
              <button class="btn btn-default" type="submit" >Send</button>
              <button class="btn btn-default" type="button" @click="nextVideo" v-if="$parent.userinfo.username=='admin'">Next</button>
              <button class="btn btn-default" type="button" @click="fullVideo">
                <span class="glyphicon glyphicon-resize-full"></span>  
              </button>  
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from 'socket.io-client'
export default {
  name: 'hello',
  data () {
    return {
      windowObj: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      io: '',
      ioData: {
        isLogin: false,
        user: {},
        controlData: {
          text: ''
        },
        msgGet: [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ],
        videoList: [],
        videoData: {
          em: document.getElementById('video'),
          name: '',
          src: '',
          control: false
        }
      }
    }
  },
  created () {
    window.onresize = function () {
      this.windowObj.width = window.innerWidth
      this.windowObj.height = window.innerHeight
    }.bind(this)
    this.$ajax(
      {
        methods: 'get',
        url: 'http://172.16.0.21:8081/'
      }
    ).then(function (data) {
      console.log(data)
    })
    if (this.$parent.userinfo.username) {
      this.ioData.user.username = this.$parent.userinfo.username
      this.ioData.user.realname = this.$parent.userinfo.realname
      this.ioData.user.time = this.$parent.userinfo.time
      this.ioData.user.token = this.$parent.userinfo.token
      this.io = socket('http://172.16.0.21:8081', {
        reconnection: false
      })
      this.io.on('connect', function (data) {
        console.log('connect success')
        this.io.emit('login', this.ioData.user)
        this.io.emit('getVideo', this.ioData.user)
        if (this.ioData.user.username === 'admin') {
          this.io.emit('_getVideoList', this.ioData.user)
        }
      }.bind(this)
      )
      this.io.on('login', function (data) {
        console.log(data)
        if (data.user.username === this.ioData.user.username) {
          if (data.code === 0) {
            this.ioData.isLogin = true
            console.log('socket login success')
          } else {
            console.log('socket login failed')
          }
        } else {
          if (data.code === 0) {
            this.ioData.msgGet[Math.floor(Math.random() * this.ioData.msgGet.length)].push(data)
          }
        }
      }.bind(this)
      )
      this.io.on('loginDisconnect', function (data) {
        if (data.code === 0) {
          this.$parent.msgShow('socket连接已断开')
        }
      }.bind(this))
      this.io.on('msgGet', function (data) {
        this.ioData.msgGet[Math.floor(Math.random() * this.ioData.msgGet.length)].push(data)
      }.bind(this))
      this.io.on('getVideoData', function (data) {
        console.log(data)
        this.startVideo(data)
      }.bind(this))
      this.io.on('getVideoList', function (data) {
        console.log(data)
        this.videoList = data
      }.bind(this))
    } else {
      this.$router.push('login')
    }
  },
  methods: {
    connectIo: function () {
      return
    },
    ioMsgPost: function () {
      if (!this.ioData.isLogin) {
        this.$router.push('Login')
        return false
      }
      if (!this.ioData.controlData.text) {
        return false
      }
      this.io.emit('msgPost', {user: this.ioData.user, controlData: this.ioData.controlData})
      this.ioData.controlData.text = ''
      return false
    },
    startVideo: function (data) {
      this.ioData.videoData.em = document.getElementById('video')
      this.ioData.videoData.src = '/static/video/' + data.name
      this.ioData.videoData.em.currentTime = data.currentTime
      this.ioData.videoData.em.load()
      this.ioData.videoData.em.addEventListener('canplay', function () {
        if (data.startTime === 0) {
          this.io.emit('videoStart', {
            name: data.name,
            duration: this.ioData.videoData.em.duration
          })
          this.ioData.videoData.em.play()
        } else {
          this.ioData.videoData.em.play()
        }
      }.bind(this)
      )
      this.ioData.videoData.em.addEventListener('ended', function () {
        this.endVideo()
      }.bind(this)
      )
    },
    endVideo: function () {
      this.ioData.videoData.em.pause()
      this.ioData.videoData.src = ''
      this.io.emit('getVideo', this.ioData.user)
    },
    nextVideo: function () {
      this.io.emit('nextVideo', this.ioData.user)
    },
    fullVideo: function () {
      var element = this.ioData.videoData.em
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    }
  },
  destroyed () {
    if (this.io) {
      this.ioData.videoData.em.pause()
      this.ioData.videoData.src = ''
      this.io.close()
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.videoConver{display: block;height: 100%;width: 100%;position: absolute;z-index: 1;}
#video{display: block;height: 100%;width: 100%;position: absolute;z-index: 0;background-color: #000;}
#dmContent{position: fixed;left: 0;top: 0;height: 100%;width: 100%;padding-top: 55px;box-sizing: border-box}
#dmContent .dm-row{height: 30px;line-height: 30px;padding: 5px 0;position: relative;z-index: 2}
#dmContent .dm-row .dm-p{display: inline-block;line-height: 30px;word-break: keep-all;white-space: nowrap;font-size: 16px; color:#fff; position: absolute;top: 0;left: 100%;}
#dmContent .dm-row .dm-p.dm-run{animation: dm-run 15s linear 0s 1 forwards }
#dmContent .con{position: relative;left: 0;top: 0;height: 100%;width: 100%;}
#dmControl{position: fixed;left: 50%;bottom: 5%;height: 35px;width: 40%;box-sizing: border-box;transform: translateX(-50%);}
video::-webkit-media-controls {
  display:none !important;
}
@keyframes dm-run{
  0%{left: 100%;transform: translate3d(0%,0,0);}
  100%{left: 0%;transform: translate3d(-100%,0,0)}
}
</style>

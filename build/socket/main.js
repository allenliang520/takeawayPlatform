var express = require('express')()
var cors = require('cors')
var http = require('http').Server(express)
var io = require('socket.io')(http)
var _ucclass = require('../usercenter/class')
var _class = require('../public.class')
var memory = require('../public.memory')
var bodyParser = require('body-parser')
var querystring = require('querystring')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var video = require('./video')
var corsConfig = {
    origin: 'http://172.16.0.21:8080',
    credentials: true
}
express.use(bodyParser.json())
express.use(cors(corsConfig))
express.use(cookieParser())
var socketServer = http.listen("8081")
var exp = {}
exp.ioUsers = {}
exp.userCount = 0

io.on('connect', (socket) => {
    socket.on('login', function (data) {
        if (_ucclass.appLoginedCheck(data.username, data.time, data.token)) {
            if (exp.ioUsers[data.username]) {
                exp.ioUsers[data.username].socket.emit("loginDisconnect", { code: 0 })
                exp.ioUsers[data.username].socket.disconnect(true)
            } else {
                exp.ioUsers[data.username] = {}
            }
            exp.ioUsers[data.username].socket = socket
            exp.ioUsers[data.username].userinfo = data
            console.log(`${data.username} login socket`)
            io.sockets.emit("login", { code: 0, user: { username: data.username, realname: data.realname } })
        } else {
            socket.emit("login", { code: -1 })
        }
    })
    socket.on('msgPost', function (data) {
        console.log(`socket get msg from ${data.user.username}: ${data.controlData.text}`)
        if (exp.ioUsers[data.user.username]) {
            var p = {}
            p.user = {
                username: data.user.username,
                realname: data.user.realname
            }
            p.time = (new Date()).getTime()
            p.text = data.controlData.text
            io.sockets.emit("msgGet", p)
        }
    })



    socket.on('_getVideoList', function (data) {
        if (_ucclass.appLoginedCheck(data.username, data.time, data.token)) {
            if (data.username === 'admin') {
                socket.emit("getVideoList", video.list)
            }
        }
    })
    socket.on('getVideo', function (data) {
        if (video.onplay.startTime == 0) {
            video.onplay.currentTime = 0
        } else {
            video.onplay.currentTime = ((new Date()).getTime() - video.onplay.startTime) / 1000
            if (video.onplay.currentTime >= video.onplay.duration) {
                video.onplay.startTime = 0
                video.onplay.currentTime = 0
                video.onplay.duration = 0
                var id = video.list.indexOf(video.onplay.name)
                id = id == (video.list.length - 1) ? 0 : id + 1
                video.onplay.name = video.list[id]
            }
        }
        socket.emit("getVideoData", video.onplay)
    })
    socket.on('videoStart', function (data) {
        video.onplay.startTime = (new Date()).getTime()
        video.onplay.duration = data.duration
        console.log(data)
    })
    socket.on('nextVideo', function (data) {
        if (_ucclass.appLoginedCheck(data.username, data.time, data.token)) {
            if (data.username === 'admin') {
                video.onplay.startTime = 0
                video.onplay.currentTime = 0
                video.onplay.duration = 0
                var id = video.list.indexOf(video.onplay.name)
                id = id == (video.list.length - 1) ? 0 : id + 1
                video.onplay.name = video.list[id]
                io.sockets.emit("getVideoData", video.onplay)
            }
        } else {
            socket.emit("login", { code: -1 })
        }
    })
});

exp.express = express
exp.io = io
module.exports = exp
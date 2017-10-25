var express = require('express')
var memory = require('../public.memory')
var _class = require('../public.class')
var _sqlclass = require('./class')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var FileStore = require('session-file-store')(session)
var cors = require('cors')
var uc = express()
var corsConfig = {
  origin: 'http://172.16.0.21:8081',
  credentials: true
}
uc.use(cors(corsConfig))
uc.use(bodyParser.json())

uc.use(cookieParser())
// uc.use(session({
//   name: 'sessionid',
//   secret: memory.key, // 用来对session id相关的cookie进行签名
//   saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
//   resave: false, // 是否每次都重新保存会话，建议false
//   cookie: {
//     sessionid: 3600 * 1000 // 有效期，单位是毫秒
//   }
// }));
_sqlclass.connetMysql()
_sqlclass.updateUsers()


uc.post('/toLogin', function (req, res) {
  console.log(req)
  var result = _sqlclass.getResult(), body = req.body
  if (!body.username || !body.password) {
    result.code = -2
    result.message = '请输入用户名或密码'
    res.send(result)
    return;
  }
  var user = memory.users.searchByKey('username', body.username),
    loginTime = (new Date()).getTime()
  if (user) {
    if (user.password === _sqlclass.getMd5Password(body.password)) {
      user.loginTime = loginTime
      user.logintime = (new Date()).format('yyyy-MM-dd hh:mm:ss')
      user.token = _sqlclass.getUserToken(user.username, user.loginTime)
      result.code = 0
      result.message = '登陆成功'
      result.data = {}
      result.data.username = user.username;
      result.data.realname = user.realname;
      result.data.tel = user.tel;
      result.data.qq = user.qq;
      result.data.roleId = user.roleId;
      result.data.time = user.loginTime;
      result.data.token = user.token;
      _sqlclass.setLoginSession(req, user)
    } else {
      result.code = -2
      result.message = '用户名或密码错误'
    }
  } else {
    result.code = -1
    result.message = '该用户不存在'
  }
  res.send(result)
})
uc.post('/toRegist', function (req, res) {
  var result = _sqlclass.getResult(), body = req.body
  var user = memory.users.searchByKey('username', body.username)
  if (user) {
    result.code = -2
    result.message = '该用户已存在'
    res.send(result)
    return
  }
  else if (!body.username) {
    result.code = -3
    result.message = '用户名不能为空'
    res.send(result)
    return
  }
  else if (!body.password) {
    result.code = -3
    result.message = '密码不能为空'
    res.send(result)
    return
  }
  else if (!body.realname) {
    result.code = -3
    result.message = '真实姓名不能为空'
    res.send(result)
    return
  }
  else if (!body.tel) {
    result.code = -3
    result.message = '手机号码不能为空'
    res.send(result)
    return
  }
  else {
    var user = {}
    user.username = (body.username)
    user.password = _sqlclass.getMd5Password(body.password)
    user.tel = (body.tel)
    user.realname = (body.realname)
    user.qq = (body.qq) || ''
    user.createtime = (new Date()).format('yyyy-MM-dd hh:mm:ss')
    user.logintime = user.createtime
    _sqlclass.createUser(user, function (status) {
      if (status) {
        user.loginTime = (new Date()).getTime()
        user.id = memory.users.searchByKey('username', user.username)
        user.token = _sqlclass.getUserToken(user.username, user.loginTime)
        result.code = 0
        result.message = 'Sign up success'
        result.data = {}
        result.data.username = user.username;
        result.data.realname = user.realname;
        result.data.tel = user.tel;
        result.data.qq = user.qq;
        result.data.roleId = user.roleId;
        result.data.time = user.loginTime;
        result.data.token = user.token;
        _sqlclass.setLoginSession(req, user)
        res.send(result)
      } else {
        result.code = -1
        result.message = 'Sign up failed'
        res.send(result)
      }
    })
  }
  if (result.code >= -1000)
    res.send(result)
})
uc.post('/saveProfile', function (req, res) {
  var result = _sqlclass.getResult(), username = _sqlclass.loginedCheck(req)
  if (!req.body.tel) {
    result.code = -3
    result.message = '手机号码不能为空'
    res.send(result)
    return
  }
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      var o = {}
      o.username = username
      o.tel = (req.body.tel)
      o.realname = (req.body.realname)
      o.qq = (req.body.qq) || ''
      _sqlclass.saveProfile(o, function (status) {
        if (status) {
          result.code = 0
          result.message = 'Save success'
          user = memory.users.searchByKey('username', username)
          result.data = {}
          result.data.username = user.username;
          result.data.realname = user.realname;
          result.data.tel = user.tel;
          result.data.qq = user.qq;
          result.data.time = req.session.loginTime;
          result.data.token = req.session.token
          res.send(result)
        } else {
          result.code = -1
          result.message = 'Save failed'
          res.send(result)
        }
      })
    } else {
      result.code = -1;
      result.message = '用户不存在'
      res.send(result)
    }
  } else {
    result.code = -99;
    result.message = '登陆已过期'
    res.send(result)
  }
})
uc.post('/loginOut', function (req, res) {
  var result = _sqlclass.getResult()
  _sqlclass.clearLoginSession(req)
  res.send(result)
})
uc.post('/getMd5', function (req, res) {
  var result = _sqlclass.getResult(), body = req.body
  result.data = _sqlclass.getMd5Password(body)
  res.send(result)
})
uc.get('/getUserinfo', function (req, res) {
  var result = _sqlclass.getResult(), username = _sqlclass.loginedCheck(req)
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {

      user.loginTime = req.session.loginTime
      user.token = req.session.token
      result.code = 0;
      result.message = '登陆成功'
      result.data = {}
      result.data.username = user.username
      result.data.realname = user.realname
      result.data.tel = user.tel;
      result.data.qq = user.qq;
      result.data.roleId = user.roleId;
      result.data.time = user.loginTime;
      result.data.token = _sqlclass.getUserToken(user.username, user.loginTime);

    } else {
      result.code = -1;
    }
  } else {
    result.code = -1;
  }
  res.send(result)
})
uc.get('/', function (req, res) {
  var result = _sqlclass.getResult()
  console.log(req.session.loginKey)
  res.send(result)
})
Array.prototype.searchByKey = function (k, v) {
  var o = this
  for (var i = 0; i < o.length; i++) {
    if (o[i][k] == v)
      return o[i]
  }
  return
}
module.exports = uc
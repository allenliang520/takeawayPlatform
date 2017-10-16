var express = require('express')
var memory = require('./public.memory')
var _class = require('./public.class')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var FileStore = require('session-file-store')(session)
var $ajax = express()
$ajax.use(bodyParser.json())

$ajax.use(cookieParser())
$ajax.use(session({
  name: 'sessionid',
  secret: memory.key, // 用来对session id相关的cookie进行签名
  saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
  resave: false, // 是否每次都重新保存会话，建议false
  cookie: {
    sessionid: 3600 * 1000 // 有效期，单位是毫秒
  }
}));
_class.connetMysql()
_class.updateUsers()

$ajax.post('/toLogin', function (req, res) {
  var result = _class.getResult(), body = req.body
  if(!body.username || !body.password){
    result.code=-2
    result.message='请输入用户名或密码'
    res.send(result)
    return;
  }
  var user = memory.users.searchByKey('username', body.username)
  if (user) {
    if (user.password === _class.getMd5Password(body.password)) {
      result.code = 0
      result.message = '登陆成功'
      result.data = {}
      result.data.username = user.username;
      result.data.realname = user.realname;
      result.data.tel = user.tel;
      result.data.qq = user.qq;
      _class.setLoginSession(req, user)
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
$ajax.post('/toRegist', function (req, res) {
  var result = _class.getResult(), body = req.body
  var user = memory.users.searchByKey('username', body.username)
  if (user) {
    result.code = -2
    result.message = '该用户已存在'
    res.send(result)
    return
  } 
  else if (!body.username){
    result.code = -3
    result.message = '用户名不能为空'
    res.send(result)
    return
  }
  else if (!body.password){
    result.code = -3
    result.message = '密码不能为空'
    res.send(result)
    return
  }
  else if (!body.realname){
    result.code = -3
    result.message = '真实姓名不能为空'
    res.send(result)
    return
  }
  else if (!body.tel){
    result.code = -3
    result.message = '手机号码不能为空'
    res.send(result)
    return
  }
  else {
    var user = {}
    user.username = encodeURI(body.username)
    user.password = _class.getMd5Password(body.password)
    user.tel = encodeURI(body.tel)
    user.realname = encodeURI(body.realname)
    user.qq = encodeURI(body.qq) || ''
    _class.createUser(user,function(status){
      if(status){
        result.code = 0
        result.message = 'Sign up success'
        result.data = {}
        result.data.username = user.username;
        result.data.realname = user.realname;
        result.data.tel = user.tel;
        result.data.qq = user.qq;
        _class.setLoginSession(req, user)
        res.send(result)
      }else{
        result.code = -1
        result.message = 'Sign up failed'
        res.send(result)
      }
    })
  }
  if(result.code >=-1000 )
  res.send(result)
})
$ajax.post('/saveProfile', function (req, res) {
  var result = _class.getResult(), username = _class.loginedCheck(req)
  if (!req.body.tel){
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
      o.tel = encodeURI(req.body.tel)
      o.realname = encodeURI(req.body.realname)
      o.qq = encodeURI(req.body.qq) || ''
      _class.saveProfile(o,function(status){
        if(status){
          result.code = 0
          result.message = 'Save success'
          user = memory.users.searchByKey('username', username)
          result.data = {}
          result.data.username = user.username;
          result.data.realname = user.realname;
          result.data.tel = user.tel;
          result.data.qq = user.qq;
          res.send(result)
        }else{          
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
$ajax.post('/loginOut', function (req, res) {
  var result = _class.getResult()
  _class.clearLoginSession(req)
  res.send(result)
})
$ajax.post('/getMd5', function (req, res) {
  var result = _class.getResult(), body = req.body
  result.data = _class.getMd5Password(body)
  res.send(result)
})
$ajax.get('/getUserinfo', function (req, res) {
  var result = _class.getResult(), username = _class.loginedCheck(req)
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      result.code = 0;
      result.message = '登陆成功'
      result.data = {}
      result.data.username = user.username
      result.data.realname = user.realname
      result.data.tel = user.tel;
      result.data.qq = user.qq;
    } else {
      result.code = -1;
    }
  } else {
    result.code = -1;
  }
  res.send(result)
})
$ajax.get('/', function (req, res) {
  var result = _class.getResult()
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
module.exports = $ajax
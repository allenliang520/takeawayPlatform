var crypto = require('crypto')
var mysql = require('../mysql/main')
var memory = require('../public.memory')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var FileStore = require('session-file-store')(session)

var fn = {}

fn.connetMysql = function () {
    mysql.init()
}
fn.createUser = function (user, _fn) {
    mysql.createUser(user, function (data) {
        if (data.status) {
            fn.updateUsers(function () {
                _fn(true)
            })
        } else {
            _fn(false)
        }
    })
}
fn.saveProfile = function (user, _fn) {
    mysql.saveProfile(user, function (data) {
        if (data.status) {
            fn.updateUsers(function () {
                _fn(true)
            })
        } else {
            _fn(false)
        }
    })
}
fn.setUserLogintime = function (user, _fn) {
    mysql.setUserLogintime(user, function (data) {
        if (data.status) {
            fn.updateUsers(function () {
                _fn(true)
            })
        } else {
            _fn(false)
        }
    })
}
fn.loginedCheck = function (req) {
    if (req.session && req.session.username) {
        return req.session.username;
    }
    return false;
}
fn.appLoginedCheck = function (username, loginTime, tocken) {
    var $tocken = fn.getMd5Password(username + loginTime + memory.key)
    if ($tocken === tocken) {
        return true
    }
    return false;
}
fn.setLoginSession = function (req, user) {
    fn.setUserLogintime(user, function () { })
    req.session.username = user.username;
    req.session.tocken = user.tocken;
    console.log("保存登陆session");
}
fn.clearLoginSession = function (req, user) {
    req.session.destroy();
    console.log("清除登陆session");
}
fn.updateUsers = function (_fn) {
    mysql.query("select * from user", function (data) {
        memory.users = data || []
        _fn ? _fn() : 0
    })
}

fn.getResult = function () {
    return { 'code': -1001, 'message': 'erro', 'data': '' }
}

fn.getUserPassword = function (username) {
    var o = users.searchByKey("username", username)
    return o.password
}
fn.getUserToken = function (username, time) {
    var o = fn.getMd5Password(username + time + memory.key)
    return o
}
fn.getMd5Password = function (password) {
    var md5 = crypto.createHash('md5')
    return md5.update(password).digest('hex')
}
Array.prototype.searchByKey = function (k, v) {
    var o = this
    for (var i = 0; i < o.length; i++) {
        if (o[i][k] == v)
            return o[i]
    }
    return
}

module.exports = fn

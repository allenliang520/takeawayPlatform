var crypto = require('crypto')
var mysql = require('../mysql/main')
var memory = require('../public.memory')
var _class = require('../public.class')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var FileStore = require('session-file-store')(session)

var fn = {}
fn.connetMysql = function () {
    mysql.init()
}
fn.getResult = function(){
    return {'code':-1001,'message':'erro','data':''}
}
fn.createShop = function (shop,_fn) {
    mysql.createShop(shop,function(data){
      if(data.status){
          fn.updateShops(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.modifyShop = function (shop,_fn) {
    mysql.modifyShop(shop,function(data){
      if(data.status){
          fn.updateShops(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.updateShops = function (_fn) {
  mysql.query("select * from shop ",function(data){
    data.forEach(function(element) {
        element.phone = _class.splitString(element.phone)
    }, this);
    memory.shops = data || []
    _fn?_fn(data):0
  })
}
fn.setShopStatus = function (shop, _fn) {
    mysql.setShopStatus(shop,function(data){
        if(data.status){
            fn.updateShops(function(){
                _fn(true)
            })
        }else{
            _fn(false)
        }
    })
}

fn.createGoodsType = function (data,_fn) {
    mysql.createGoodsType(data,function(data){
      if(data.status){
          fn.updateGoodsType(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.updateGoodsType = function (_fn) {
  mysql.query("select * from goodsType ",function(data){
    memory.goodsTypes = data || []
    _fn?_fn(data):0
  })
}
fn.modifyGoodsType = function (data,_fn) {
    mysql.modifyGoodsType(data,function(data){
      if(data.status){
          fn.updateGoodsType(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}

fn.createGood = function (data,_fn) {
    mysql.createGood(data,function(data){
      if(data.status){
          fn.updateGoods(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.modifyGood = function (data,_fn) {
    mysql.modifyGood(data,function(data){
      if(data.status){
          fn.updateGoods(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.updateGoods = function (_fn) {
  mysql.query("select * from goods ",function(data){
    data.forEach(function(element) {
        element.userableWeeks = _class.splitString(element.userableWeeks)
    }, this);
    memory.goods = data || []
    _fn?_fn(data):0
  })
}
fn.setGoodStatus = function (data, _fn) {
    mysql.setGoodStatus(data,function(data){
        if(data.status){
            fn.updateGoods(function(){
                _fn(true)
            })
        }else{
            _fn(false)
        }
    })
}
module.exports = fn

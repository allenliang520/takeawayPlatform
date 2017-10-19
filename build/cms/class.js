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
fn.setUserRole = function (data,_fn) {
    var $data = data
    mysql.setUserRole(data,function(data){
      if(data.status){
          memory.users.searchByKey('id', $data.id).roleId = $data.roleId
          _fn(true)
      }else{
          _fn(false)
      }
  })
}
fn.createMenu = function (data,_fn) {
    mysql.createMenu(data,function(data){
      if(data.status){
          fn.updateMenus(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.modifyMenu = function (data,_fn) {
    mysql.modifyMenu(data,function(data){
      if(data.status){
          fn.updateMenus(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.updateMenus = function (_fn) {
    mysql.query("select * from menu ",function(data){
      data.forEach(function(element) {
          element.params = _class.splitString(element.params)
      }, this);
      memory.menus = data || []
      _fn?_fn(data):0
    })
  }
fn.setMenuStatus = function (data, _fn) {
    mysql.setMenuStatus(data,function(data){
        if(data.status){
            fn.updateMenus(function(){
                _fn(true)
            })
        }else{
            _fn(false)
        }
    })
}
fn.createMenuClass = function (data,_fn) {
    mysql.createMenuClass(data,function(data){
        if(data.status){
            fn.updateMenuClass(function(){
                _fn(true)
            })
        }else{
            _fn(false)
        }
    })
}
fn.modifyMenuClass = function (data,_fn) {
    mysql.modifyMenuClass(data,function(data){
      if(data.status){
          fn.updateMenuClass(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.updateMenuClass = function (_fn) {
    mysql.query("select * from menuClass ",function(data){
      memory.menuClass = data || []
      _fn?_fn(data):0
    })
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

fn.createRole = function (data,_fn) {
    mysql.createRole(data,function(data){
      if(data.status){
          fn.updateRoles(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.modifyRole = function (data,_fn) {
    mysql.modifyRole(data,function(data){
      if(data.status){
          fn.updateRoles(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.updateRoles = function (_fn) {
  mysql.query("select * from role ",function(data){
    memory.roles = data || []
    _fn?_fn(data):0
  })
}
fn.setRoleStatus = function (data, _fn) {
    mysql.setRoleStatus(data,function(data){
        if(data.status){
            fn.updateRoles(function(){
                _fn(true)
            })
        }else{
            _fn(false)
        }
    })
}

fn.createRoleResources = function (data,_fn) {
    mysql.createRoleResources(data,function(data){
      if(data.status){
          fn.updateRolesResources(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.modifyRoleResources = function (data,_fn) {
    mysql.modifyRoleResources(data,function(data){
      if(data.status){
          fn.updateRolesResources(function(){
              _fn(true)
          })
      }else{
          _fn(false)
      }
  })
}
fn.updateRolesResources = function (_fn) {
  mysql.query("select * from roleResources ",function(data){
    data.forEach(function(element) {
        element.menuIds = _class.splitString(element.menuIds)
    }, this);
    memory.rolesResources = data || []
    _fn?_fn(data):0
  })
}
module.exports = fn

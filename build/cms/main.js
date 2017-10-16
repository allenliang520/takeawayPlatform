var express = require('express')
var memory = require('../public.memory')
var _class = require('../public.class')
var _sqlclass = require('./class')
var _ucclass = require('../usercenter/class')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var FileStore = require('session-file-store')(session)
var cors = require('cors')
var cms = express()

var corsConfig = {
  origin: 'http://172.16.0.21:8081',
  credentials: true
}
cms.use(cors(corsConfig))
cms.use(bodyParser.json())

cms.use(cookieParser())

_sqlclass.connetMysql()
_sqlclass.updateShops()
_sqlclass.updateGoodsType()
_sqlclass.updateGoods()

cms.get('/refresh', function (req,res) {
  var result = _sqlclass.getResult(), username = _ucclass.loginedCheck(req)
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      _sqlclass.updateShops(function(status){
        if(status){
          _sqlclass.updateGoodsType(function(status){
            if(status){
              _sqlclass.updateGoodsType(function(status){
                if(status){
                  result.code = 0
                  result.message = 'Save success'
                  result.data = memory.shops
                  res.send(result)
                }else{          
                  result.code = -3
                  result.message = 'refresh failed'
                  res.send(result)
                }
              })
            }else{          
              result.code = -2
              result.message = 'refresh failed'
              res.send(result)
            }
          })
        }else{          
          result.code = -4
          result.message = 'refresh failed'
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

cms.post('/saveShop', function (req,res) {
  var result = _sqlclass.getResult(), username = _ucclass.loginedCheck(req)
  if (!req.body.name){
    result.code = -1
    result.message = '店铺名称不能为空'
    res.send(result)
    return
  }else if (!req.body.address){
    result.code = -1
    result.message = '店铺地址不能为空'
    res.send(result)
    return
  }else if(!req.body.id && memory.shops.searchByKey('name', req.body.name)) {
    result.code = -2
    result.message = '店铺已存在'
    res.send(result)
    return
  }
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      var o = {}
      o.name = req.body.name
      o.address = req.body.address
      o.status = encodeURI(req.body.status)
      o.phone = encodeURI(req.body.phone.toString())
      if(req.body.id){
        var shop = memory.shops.searchByKey("id",req.body.id) 
        if(shop){
          o.id = encodeURI(req.body.id)
          _sqlclass.modifyShop(o,function(status){
            if(status){
              result.code = 0
              result.message = 'Save success'
              result.data = memory.shops
              res.send(result)
            }else{          
              result.code = -1
              result.message = 'Save failed'
              res.send(result)
            }
          })   
        }else{
          result.message = "店铺不存在"
          res.send(result)
        }
      }else{
        o.createtime = (new Date()).format('yyyy-MM-dd hh:mm:ss')
        _sqlclass.createShop(o,function(status){
          if(status){
            result.code = 0
            result.message = 'Save success'
            result.data = memory.shops
            res.send(result)
          }else{          
            result.code = -1
            result.message = 'Save failed'
            res.send(result)
          }
        })      
      }
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
cms.get('/searchAllShop', function (req,res) {
  var result = _sqlclass.getResult()
  result.code = 0
  result.message = 'success'
  if(!req.query.status || req.query.status==-1){
    result.data = memory.shops
  }else{
    result.data = _class.filterByKey(memory.shops, 'status' , req.query.status) 
  }
  res.send(result)
})
cms.get('/searchShop', function (req,res) {
  var result = _sqlclass.getResult()
  if(req.query.id){
    var shop = memory.shops.searchByKey("id",req.query.id) 
    if(shop){
      result.code = 0
      result.message = 'success'
      result.data = shop
      res.send(result)
    }else{
      result.message = "店铺不存在"
      res.send(result)
    }
  }else{
    result.message = "缺少店铺ID"
    res.send(result)
  }
})
cms.post('/setShopStatus', function (req,res) {
  var result = _sqlclass.getResult(), username = _ucclass.loginedCheck(req)
  if (!req.body.id){
    result.code = -1
    result.message = '店铺id不能为空'
    res.send(result)
    return
  }else if(req.body.status!=0&&req.body.status!=1) {
    result.code = -2
    result.message = '状态值无效'
    res.send(result)
    return
  }
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      var o = {}
      o.id = req.body.id
      o.status = req.body.status
      _sqlclass.setShopStatus(o,function(status){
        if(status){
          result.code = 0
          result.message = 'success'
          result.data = memory.shops
          res.send(result)
        }else{          
          result.code = -1
          result.message = 'failed'
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


cms.post('/saveGoodsType', function (req,res) {
  var result = _sqlclass.getResult(), username = _ucclass.loginedCheck(req)
  if (!req.body.name){
    result.code = -1
    result.message = '分类名称不能为空'
    res.send(result)
    return
  }else if(!req.body.id && memory.goodsTypes.searchByKey('name', req.body.name)) {
    result.code = -2
    result.message = '该分类已存在'
    res.send(result)
    return
  }
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      var o = {}
      o.name = req.body.name
      if(req.body.id){
        var data = memory.goodsTypes.searchByKey("id",req.body.id) 
        if(data){
          o.id = encodeURI(req.body.id)
          _sqlclass.modifyGoodsType(o,function(status){
            if(status){
              result.code = 0
              result.message = 'Save success'
              result.data = memory.shops
              res.send(result)
            }else{          
              result.code = -1
              result.message = 'Save failed'
              res.send(result)
            }
          })   
        }else{
          result.message = "分类不存在"
          res.send(result)
        }
      }else{
        _sqlclass.createGoodsType(o,function(status){
          if(status){
            result.code = 0
            result.message = 'Save success'
            result.data = memory.shops
            res.send(result)
          }else{          
            result.code = -1
            result.message = 'Save failed'
            res.send(result)
          }
        })      
      }
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
cms.get('/searchAllGoodsType', function (req,res) {
  var result = _sqlclass.getResult()
  result.code = 0
  result.message = 'success'
  result.data = memory.goodsTypes
  res.send(result)
})
cms.get('/searchGoodsType', function (req,res) {
  var result = _sqlclass.getResult()
  if(req.query.id){
    var data = memory.goodsTypes.searchByKey("id",req.query.id) 
    if(data){
      result.code = 0
      result.message = 'success'
      result.data = data
      res.send(result)
    }else{
      result.message = "分类不存在"
      res.send(result)
    }
  }else{
    result.message = "缺少分类ID"
    res.send(result)
  }
})

cms.post('/saveGood', function (req,res) {
  var result = _sqlclass.getResult(), username = _ucclass.loginedCheck(req)
  if (!req.body.name){
    result.code = -1
    result.message = '商品名称不能为空'
    res.send(result)
    return
  }else if(!req.body.id && memory.goods.searchByKey('name', req.body.name)) {
    result.code = -2
    result.message = '商品已存在'
    res.send(result)
    return
  }
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      var o = {}
      o.shopId = req.body.shopId
      o.name = req.body.name
      o.price = req.body.price
      o.startDate = req.body.startDate
      o.endDate = req.body.endDate
      o.userableWeeks = req.body.userableWeeks.toString()
      o.type = req.body.type
      o.status = req.body.status
      if(req.body.id){
        var shop = memory.shops.searchByKey("id",req.body.id) 
        if(shop){
          o.id = encodeURI(req.body.id)
          _sqlclass.modifGood(o,function(status){
            if(status){
              result.code = 0
              result.message = 'Save success'
              res.send(result)
            }else{          
              result.code = -1
              result.message = 'Save failed'
              res.send(result)
            }
          })   
        }else{
          result.message = "店铺不存在"
          res.send(result)
        }
      }else{
        o.createtime = (new Date()).format('yyyy-MM-dd hh:mm:ss')
        _sqlclass.createGood(o,function(status){
          if(status){
            result.code = 0
            result.message = 'Save success'
            res.send(result)
          }else{
            result.code = -1
            result.message = 'Save failed'
            res.send(result)
          }
        })      
      }
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
cms.get('/searchAllGood', function (req,res) {
  var result = _sqlclass.getResult()
  result.code = 0
  result.message = 'success'
  result.data = memory.goods
  if(!req.query.status || req.query.status==-1){
    result.data = result.data
  }else{
    result.data = _class.filterByKey(result.data, 'status' , req.query.status)
  }
  if(!req.query.shopId || req.query.shopId==-1){
    result.data = result.data
  }else{
    result.data = _class.filterByKey(result.data, 'shopId' , req.query.shopId)
  }
  if(!req.query.type || req.query.type==-1){
    result.data = result.data
  }else{
    result.data = _class.filterByKey(result.data, 'type' , req.query.type)
  }
  res.send(result)
})
cms.get('/searchGood', function (req,res) {
  var result = _sqlclass.getResult()
  if(req.query.id){
    var good = memory.goods.searchByKey("id",req.query.id) 
    if(good){
      result.code = 0
      result.message = 'success'
      result.data = good
      res.send(result)
    }else{
      result.message = "商品不存在"
      res.send(result)
    }
  }else{
    result.message = "缺少商品ID"
    res.send(result)
  }
})
cms.post('/setGoodStatus', function (req,res) {
  var result = _sqlclass.getResult(), username = _ucclass.loginedCheck(req)
  if (!req.body.id){
    result.code = -1
    result.message = '商品id不能为空'
    res.send(result)
    return
  }else if(req.body.status!=0&&req.body.status!=1) {
    result.code = -2
    result.message = '状态值无效'
    res.send(result)
    return
  }
  if (username) {
    var user = memory.users.searchByKey('username', username)
    if (user) {
      var o = {}
      o.id = req.body.id
      o.status = req.body.status
      _sqlclass.setGoodStatus(o,function(status){
        if(status){
          result.code = 0
          result.message = 'success'
          res.send(result)
        }else{          
          result.code = -1
          result.message = 'failed'
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


module.exports = cms
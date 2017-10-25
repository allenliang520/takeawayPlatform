var mysql = require('mysql')
var config = require('./mysql.config')
var $mysql = {}
var conn = ""
$mysql.query = function (s, fn) {
    conn.query(s, function (err, data) {
        if (!err) {
            data = data.map(function (item, index) {
                for (var i in item) {
                    item[i] = item[i] === null ? "" : item[i]
                    item[i] = decodeURI(item[i])
                }
                return item;
            })
            fn ? fn(data) : 0
            return true;
        } else {
            console.log("query erro");
            return false;
        }
    })
};
$mysql.update = function (s, fn) {
    conn.query(s, function (err, data) {
        if (!err) {
            $mysql.updateCheck(data, fn)
            return true;
        } else {
            console.log("query erro");
            return false;
        }
    })
};
$mysql.updateCheck = function (data, fn) {
    if (data.changedRows >= 0) {
        data.status = true
        fn ? fn(data) : 0
    }
    else {
        data.status = false
        fn ? fn(data) : 0
    }
}
$mysql.insert = function (s, fn) {
    conn.query(s, function (err, data) {
        if (!err) {
            $mysql.insertCheck(data, fn)
            return true;
        } else {
            console.log("query erro");
            return false;
        }
    })
};
$mysql.insertCheck = function (data, fn) {
    if (data.affectedRows > 0) {
        data.status = true
        fn ? fn(data) : 0
    }
    else {
        data.status = false
        fn ? fn(data) : 0
    }
}
$mysql.createUser = function (user, fn) {
    data.roleId = parseInt(data.roleId)
    var str = 'INSERT INTO `user` ( username , password , realname , tel , qq , roleId , createtime , logintime ) VALUES ( ' + mysql.escape(user.username) + ',' + mysql.escape(user.password) + ',' + mysql.escape(user.realname) + ',' + mysql.escape(user.tel) + ',' + mysql.escape(user.qq) + ',' + mysql.escape(5) + ',' + mysql.escape(user.createtime) + ',' + mysql.escape(user.logintime) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.saveProfile = function (user, fn) {
    var str = 'UPDATE `user` SET realname=' + mysql.escape(user.realname) + ',tel=' + mysql.escape(user.tel) + ',qq=' + mysql.escape(user.qq) + ' WHERE username = ' + mysql.escape(user.username) + ''
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.setUserRole = function (data, fn) {
    data.roleId = parseInt(data.roleId)
    data.id = parseInt(data.id)
    var str = 'UPDATE `user` SET roleId= ' + mysql.escape(data.roleId) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.setUserLogintime = function (data, fn) {
    var str = 'UPDATE `user` SET logintime= ' + mysql.escape(data.logintime) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}

$mysql.createShop = function (shop, fn) {
    data.status = parseInt(data.status)
    var str = 'INSERT INTO `shop` ( name , address , status , phone , createtime ) VALUES ( ' + mysql.escape(shop.name) + ',' + mysql.escape(shop.address) + ',' + mysql.escape(shop.status) + ',' + mysql.escape(shop.phone) + ',' + mysql.escape(shop.createtime) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.setShopStatus = function (shop, fn) {
    data.status = parseInt(data.status)
    data.id = parseInt(data.id)
    var str = 'UPDATE shop SET `status` = ' + mysql.escape(shop.status) + ' WHERE id = ' + mysql.escape(shop.id)
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.modifyShop = function (shop, fn) {
    data.id = parseInt(data.id)
    var str = 'UPDATE shop SET `name` = ' + mysql.escape(shop.name) + ' ,`status` = ' + mysql.escape(shop.address) + ' ,`status` = ' + mysql.escape(shop.status) + ' ,`phone` = ' + mysql.escape(shop.phone) + ' WHERE id = ' + mysql.escape(shop.id)
    console.log(str)
    $mysql.update(str, fn)
}

$mysql.createGoodsType = function (data, fn) {
    var str = 'INSERT INTO `goodsType` ( name ) VALUES ( ' + mysql.escape(data.name) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.modifyGoodsType = function (data, fn) {
    data.id = parseInt(data.id)
    var str = 'UPDATE goodsType SET `name` = ' + mysql.escape(data.name) + '  WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}

$mysql.createGood = function (data, fn) {
    data.shopId = parseInt(data.shopId)
    data.type = parseInt(data.type)
    data.status = parseInt(data.status)
    var str = 'INSERT INTO `goods` ( shopId, name , price , startDate , endDate , userableWeeks , type , status , createtime) VALUES ( ' + mysql.escape(data.shopId) + ',' + mysql.escape(data.name) + ',' + mysql.escape(data.price) + ',' + mysql.escape(data.startDate) + ',' + mysql.escape(data.endDate) + ',' + mysql.escape(data.userableWeeks) + ',' + mysql.escape(data.type) + ',' + mysql.escape(data.status) + ',' + mysql.escape(data.createtime) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.modifyGood = function (data, fn) {
    data.shopId = parseInt(data.shopId)
    data.type = parseInt(data.type)
    data.status = parseInt(data.status)
    data.id = parseInt(data.id)
    var str = 'UPDATE goods SET `name` = ' + mysql.escape(data.name) + ' ,`shopId` = ' + mysql.escape(data.shopId) + ' ,`price` = ' + mysql.escape(data.price) + ' ,`startDate` = ' + mysql.escape(data.startDate) + ' ,`endDate` = ' + mysql.escape(data.endDate) + ' ,`userableWeeks` = ' + mysql.escape(data.userableWeeks) + ' ,`type` = ' + mysql.escape(data.type) + ' ,`status` = ' + mysql.escape(data.status) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.setGoodStatus = function (data, fn) {
    data.status = parseInt(data.status)
    data.id = parseInt(data.id)
    var str = 'UPDATE goods SET `status` = ' + mysql.escape(data.status) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}

$mysql.createRole = function (data, fn) {
    data.status = parseInt(data.status)
    var str = 'INSERT INTO `role` (  name , status , createtime) VALUES ( ' + mysql.escape(data.name) + ',' + mysql.escape(data.status) + ',' + mysql.escape(data.createtime) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.modifyRole = function (data, fn) {
    data.status = parseInt(data.status)
    data.id = parseInt(data.id)
    var str = 'UPDATE  role SET `name` = ' + mysql.escape(data.name) + ' ,`status` = ' + mysql.escape(data.status) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.setRoleStatus = function (data, fn) {
    data.status = parseInt(data.status)
    data.id = parseInt(data.id)
    var str = 'UPDATE role SET `status` = ' + mysql.escape(data.status) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}

$mysql.createRoleResources = function (data, fn) {
    data.roleId = parseInt(data.roleId)
    var str = 'INSERT INTO `roleResources` (  roleId , menuIds , authoritys) VALUES ( ' + mysql.escape(data.roleId) + ',' + mysql.escape(data.menuIds) + ',' + mysql.escape(data.authoritys) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.modifyRoleResources = function (data, fn) {
    data.roleId = parseInt(data.roleId)
    var str = 'UPDATE roleResources SET `menuIds` = ' + mysql.escape(data.menuIds) + ', `authoritys` = ' + mysql.escape(data.authoritys) + ' WHERE roleId = ' + mysql.escape(data.roleId)
    console.log(str)
    $mysql.update(str, fn)
}

$mysql.createMenu = function (data, fn) {
    data.status = parseInt(data.status)
    var str = 'INSERT INTO `menu` ( `key`, name  , `show` , params , authority , classKey , activeKey , status ) VALUES ( ' + mysql.escape(data.key) + ',' + mysql.escape(data.name) + ',' + mysql.escape(data.show) + ',' + mysql.escape(data.params) + ',' + mysql.escape(data.authority) + ',' + mysql.escape(data.classKey) + ',' + mysql.escape(data.activeKey) + ',' + mysql.escape(data.status) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.modifyMenu = function (data, fn) {
    data.status = parseInt(data.status)
    data.id = parseInt(data.id)
    var str = 'UPDATE menu SET `key` = ' + mysql.escape(data.key) + ', `name`=' + mysql.escape(data.name) + ', `show`=' + mysql.escape(data.show) + ', `params`=' + mysql.escape(data.params) + ', `authority`=' + mysql.escape(data.authority) + ', `classKey`=' + mysql.escape(data.classKey) + ', `activeKey`=' + mysql.escape(data.activeKey) + ', `status`=' + mysql.escape(data.status) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.setMenuStatus = function (data, fn) {
    data.status = parseInt(data.status)
    data.id = parseInt(data.id)
    var str = 'UPDATE menu SET `status` = ' + mysql.escape(data.status) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.createMenuClass = function (data, fn) {
    var str = 'INSERT INTO `menuClass` ( `key`, name ) VALUES ( ' + mysql.escape(data.key) + ',' + mysql.escape(data.name) + ')'
    console.log(str)
    $mysql.insert(str, fn)
}
$mysql.modifyMenuClass = function (data, fn) {
    data.id = parseInt(data.id)
    var str = 'UPDATE menuClass SET `key` = ' + mysql.escape(data.key) + ', `name`=' + mysql.escape(data.name) + ' WHERE id = ' + mysql.escape(data.id)
    console.log(str)
    $mysql.update(str, fn)
}
$mysql.init = function () {
    if (!conn) {
        conn = mysql.createConnection(config);
        conn.connect();
    }
    return conn
}
module.exports = $mysql
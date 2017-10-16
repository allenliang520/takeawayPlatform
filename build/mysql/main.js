var mysql = require('mysql')
var config = require('./mysql.config')
var $mysql = {}
var conn= ""
$mysql.query = function(s,fn){
    conn.query(s,function(err , data){
        if(!err){
            data = data.map(function(item,index){
                for(var i in item){
                    item[i] = item[i]===null ? "" : item[i]
                    item[i] = decodeURI(item[i])                    
                }
                return item;
            })
            fn?fn(data):0
            return true;
        }else{
            console.log("query erro");
            return false;
        }
    })
};
$mysql.update = function(s,fn){
    conn.query(s,function(err , data){
        if(!err){
            $mysql.updateCheck(data,fn)
            return true;
        }else{
            console.log("query erro");
            return false;
        }
    })
};
$mysql.updateCheck = function(data,fn){
    if(data.changedRows>0){
        data.status = true
        fn?fn(data):0
    }
    else{
        data.status = false
        fn?fn(data):0
    }
}
$mysql.insert = function(s,fn){
    conn.query(s,function(err , data){
        if(!err){
            $mysql.insertCheck(data,fn)
            return true;
        }else{
            console.log("query erro");
            return false;
        }
    })
};
$mysql.insertCheck = function(data,fn){
    if(data.affectedRows>0){
        data.status = true
        fn?fn(data):0
    }
    else{
        data.status = false
        fn?fn(data):0
    }
}
$mysql.createUser = function(user,fn){
    var str = 'INSERT INTO `user` ( username , password , realname , tel , qq ) VALUES ( "'+user.username+'","'+user.password+'","'+user.realname+'","'+user.tel +'","'+user.qq +'")'
    console.log(str)
    $mysql.insert(str,fn)
}
$mysql.saveProfile = function(user,fn){
    var str = 'UPDATE `user` SET realname="'+user.realname+'",tel="'+user.tel+'",qq="'+user.qq+'" WHERE username = "'+ user.username + '"'
    console.log(str)
    $mysql.update(str,fn)
}

$mysql.createShop = function(shop,fn){
    var str = 'INSERT INTO `shop` ( name , address , status , phone , createtime ) VALUES ( "'+shop.name+'","'+shop.address+'","'+shop.status+'","'+shop.phone+'","'+shop.createtime +'")'
    console.log(str)
    $mysql.insert(str,fn)
}
$mysql.setShopStatus = function(shop,fn){
    var str = 'UPDATE shop SET `status` = '+shop.status+' WHERE id = '+shop.id
    console.log(str)
    $mysql.update(str,fn)
}
$mysql.modifyShop = function(shop,fn){
    var str = 'UPDATE shop SET `name` = "'+shop.name+'" ,`status` = "'+shop.address+'" ,`status` = "'+shop.status+'" ,`phone` = "'+shop.phone+'" WHERE id = '+shop.id
    console.log(str)
    $mysql.update(str,fn)
}

$mysql.createGoodsType = function(data,fn){
    var str = 'INSERT INTO `goodsType` ( name ) VALUES ( "'+data.name+'")'
    console.log(str)
    $mysql.insert(str,fn)
}
$mysql.modifyGoodsType = function(data,fn){
    var str = 'UPDATE goodsType SET `name` = "'+data.name+'"  WHERE id = '+data.id
    console.log(str)
    $mysql.update(str,fn)
}

$mysql.createGood = function(data,fn){
    var str = 'INSERT INTO `goods` ( shopId, name , price , startDate , endDate , userableWeeks , type , status , createtime) VALUES ( "'+data.shopId+'","'+data.name+'","'+data.price+'","'+data.startDate+'","'+data.endDate+'","'+data.userableWeeks+'",'+data.type+','+data.status +',"'+data.createtime +'")'
    console.log(str)
    $mysql.insert(str,fn)
}
$mysql.modifyGood = function(data,fn){
    var str = 'UPDATE goods SET `name` = "'+data.name+'" ,`shopId` = "'+data.shopId+'" ,`price` = "'+data.price+'" ,`startDate` = "'+data.startDate+'" ,`endDate` = "'+data.endDate+'" ,`userableWeeks` = "'+data.userableWeeks+'" ,`type` = '+data.type+'" ,`status` = '+data.status+' WHERE id = '+data.id
    console.log(str)
    $mysql.update(str,fn)
}
$mysql.setGoodStatus = function(data,fn){
    var str = 'UPDATE goods SET `status` = '+data.status+' WHERE id = '+data.id
    console.log(str)
    $mysql.update(str,fn)
}


$mysql.init = function(){
    if(!conn){
        conn = mysql.createConnection(config);
        conn.connect();
    }
    return conn
}
module.exports = $mysql
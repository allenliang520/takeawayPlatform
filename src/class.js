var fn = {}

fn.filterByKey = function (o, k, v) {
    if (Array.isArray(o)) {
        var newArr = []
        for (var i = 0; i < o.length; i++) {
            if( o[i][k] == v )
            newArr.push(o[i])
        }
        return newArr
    }
    return o
}

fn.splitString = function (str,k) {
    var arr = str.split(k||','), newArr = []
    for (var i = 0; i < arr.length; i++) {
        if( arr[i] )
        newArr.push(arr[i])
    }
    return newArr
}


Array.prototype.searchByKey = function (k, v) {
	var o = this
	for (var i = 0 ;i < o.length ;i++) {
		if (o[i][k] == v)
			return o[i]
	}
	return
}
Date.prototype.format = function(fmt)
{
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}
module.exports = fn

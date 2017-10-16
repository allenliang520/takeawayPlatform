var fs = require('fs')
var video = {
    onplay: {
        name: '',
        currentTime: 0, //视频中的当前播放位置
        duration: 0,    //视频的长度
        startTime: 0
    },
    list: []
}
fs.readdir("./static/video/",function(err,files){
    if(err){
        console.log(err)
        return;
    }
    video.list = files
    video.onplay.name = files[0]
})



module.exports = video
app.filter('time', function(){
  return function(createtime){
    if(createtime){
      var nowdate = new Date(),
        now=Date.parse(nowdate),
        limit=now/1000-createtime/1000,
        content="",
        date = new Date(createtime),
        Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ',
        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':',
        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()),
        weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        w = weekArr[date.getDay()]+' '

        content = Y+M+D+w+h+m+s
        return content
    }
  }

})

app.filter('datetime', function(){
  return function(createtime){
    if(createtime){
      var nowdate = new Date(),
        now=Date.parse(nowdate),
        limit=now/1000-createtime/1000,
        content="",
        date = new Date(createtime),
        Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ',
        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':',
        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds())

        content = Y+M+D+h+m+s
        return content
    }
  }

})

app.filter('onlytime', function(){
  return function(createtime){
    if(createtime){
      var nowdate = new Date(),
        now=Date.parse(nowdate),
        limit=now/1000-createtime/1000,
        content="",
        date = new Date(createtime),
        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':',
        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds())

        content = h+m+s
        return content
    }
  }

})
app.filter('onlydate', function(){
  return function(createtime){
    if(createtime){
      var nowdate = new Date(),
        now=Date.parse(nowdate),
        limit=now/1000-createtime/1000,
        content="",
        date = new Date(createtime),
        Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ',
        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':',
        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds())

        content = Y+M+D
        return content
    }
  }

})
app.filter('search', function(){
  return function(value){
    if(value){
        return value;
    }
  };

});

app.filter('floor', function(){
  return function(value){
    if(value){
        return parseInt(Math.floor(value))
    }
  }

})










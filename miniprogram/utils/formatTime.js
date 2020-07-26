module.exports=(date)=>{
  let fmt='yyyy-MM-dd hh:mm:ss';
  const o={
    "M+":date.getMonth()+1, //月份
    "d+":date.getDate(),
    "h+":date.getHours(),
    "m+":date.getMinutes(),
    "s+":date.getSeconds()
  }
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1,date.getFullYear());
  }
  // console.log(fmt);
  for(let i in o){
    if(new RegExp('('+i+')').test(fmt)){
      fmt=fmt.replace(RegExp.$1,o[i].toString().length===1?'0'+o[i]:o[i])
    }
  }
  // console.log(fmt);
  return fmt;
}
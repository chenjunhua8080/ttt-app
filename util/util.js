/**
 * 时间格式化
 */
function format(time, reg) {
  const date = typeof time === 'string' ? new Date(time) : time
  const map = {}
  map.yyyy = date.getFullYear()
  map.yy = ('' + map.yyyy).substr(2)
  map.M = date.getMonth() + 1
  map.MM = (map.M < 10 ? '0' : '') + map.M
  map.d = date.getDate()
  map.dd = (map.d < 10 ? '0' : '') + map.d
  map.H = date.getHours()||'0'
  map.HH = (map.H < 10 ? '0' : '') + map.H
  map.m = date.getMinutes()||'0'
  map.mm = (map.m < 10 ? '0' : '') + map.m
  map.s = date.getSeconds()||'0'
  map.ss = (map.s < 10 ? '0' : '') + map.s

  return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s\b/g, $1 => map[$1])
}
/**
 * 获取下标
 */
function getIndex (arr,item){
  for(var i in arr){
      if(arr[i] == item){
        return i;
      };
  };
}

module.exports = {
  format,getIndex
}
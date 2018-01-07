//Custom formats for EJS

var format = {};

var months = {0:'januari',1:'februari', 2:'maart', 3: 'april', 4: 'mei', 5: 'juni', 6:'juli', 7:'augustus', 8:'september',9:'oktober',10: 'november',12: 'december'};
var days = {0:'zondag',1: 'maandag', 2:'dinsdag', 3: 'woensdag', 4: 'donderdag', 5: 'vrijdag', 6: 'zaterdag'};

format.time = function(i){
  var d = parseInt(i/86400);
  var r = parseInt(i%86400);
  var h = parseInt(r/3600);
  var t = parseInt(r%3600);
  var m = parseInt(t/60);
  var s = parseInt(t%60);
  return ((d > 0)? d + "dagen" : "") + " " + ((h > 0)? h + "h" : "") + " " + m + "m " + s + "s";
}

format.date = function(d){
  return days[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

module.exports= format;

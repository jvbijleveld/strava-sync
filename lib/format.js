//Custom formats for EJS

var format = {};

format.time = function(i){
  //console.log("i: " + i);
  var d = parseInt(i/86400);
  //console.log("d: " + d);
  var r = parseInt(i%86400);
  //console.log("r: " + r);
  var h = parseInt(r/3600);
  var t = parseInt(r%3600);
  //console.log("h: " + h);
  var m = parseInt(t/60);
  //console.log("m: " + m);
  var s = parseInt(t%60);
  //console.log(s);
  return ((d > 0)? d + "dagen" : "") + " " + ((h > 0)? h + "h" : "") + " " + m + "m " + s + "s";
}

module.exports= format;

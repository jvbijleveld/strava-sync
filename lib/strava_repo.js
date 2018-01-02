var mongo = require('mongodb');
var monk = require('monk');
const log4js = require('log4js');

logger = log4js.getLogger();

var db = monk('localhost:27017/strava');

var strava_repo = {};

strava_repo.insertActivity = function(activity, callBack){
  var col = db.get('activities');
  
  col.insert(activity, function(err, result){
    if(err !== null){ logger.error('Error inserting activity: ' + err) }
    callBack();
  });
};


strava_repo.listActivities = function(){
  var col = db.get('activities');
  return col.find({},{}, function(err, activities){
    return activities;
  });
}


module.exports = strava_repo;
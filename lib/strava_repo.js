var mongo = require('mongodb');
var monk = require('monk');
const log4js = require('log4js');

logger = log4js.getLogger();

var db = monk(process.env.MONGO_CONNECTION_URL);
var activities = db.get('activities'); 

var strava_repo = {};

strava_repo.insertActivity = function(activity, callBack){
  activities.insert(activity, function(err, result){
    if(err !== null){ logger.error('Error inserting activity: ' + err.msg) }
    callBack();
  });
};

strava_repo.queryActivities = function(selection, callBack){
  activities.find(selection,{}, function(err, activities){
    if(err !== null){ logger.error('Error querieiieieing activities: ' + err.msg) }
    callBack(activities);
  });
};

strava_repo.listActivities = function(){
  activities.find({},{}, function(err, activities){
    if(err !== null){ logger.error('Error listing activities: ' + err.msg) }
    return activities;
  });
}

strava_repo.findActivity = function(activityId, callBack){
  activities.findOne({id: activityId},{}, function(err, activity){
    if(err !== null){ logger.error('Error finding activity: ' + err.msg) }
    callBack(activity);
  });
  
}

module.exports = strava_repo;
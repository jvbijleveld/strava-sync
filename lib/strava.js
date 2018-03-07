var stravaService = require('strava-v3');
var strava_repo = require('../lib/strava_repo');
const log4js = require('log4js');
const wrapper = require('custom-request-wrapper');
const functions = require('../lib/functions');

var logger = log4js.getLogger();

var activityEnt = require('../entities/activityEntity');

var strava = {};

strava.getLastActivity = function(){
	//fetch most recent activity
	
};

var buildCurrentYearSelection = function(){
	var now = new Date();
	var currentYear = now.getFullYear();
	logger.debug('currentYear: ' + currentYear);
	var selection = { 
		$query :{
			start_date_local : {
				'$gte' : new Date(currentYear,0,1),
				'$lte' : new Date(currentYear+1,0,1)
			}
		}
	}
	return selection;
};

strava.fetchActivities = function(nofActivities, callBack){
	//fetch all activities
	stravaService.athlete.listActivities({'page':1, 'per_page':nofActivities}, function(err, response, limits){
		if(err){ return logger.error('ERROR fetching strava activities', err); }
		logger.info('Got Strava data, found :' + response.length + ' activities');
		callBack(response);
	});
};

strava.fetchCurrentYear = function(callBack){
	strava_repo.queryActivities(buildCurrentYearSelection(), {"sort" : ['start_date_local', 'asc']}, function(activities){
		callBack(activities);
	});
};

strava.syncAllActivities = function(nofActivities,callBack){
	strava.fetchActivities(nofActivities,function(activities){
		activities.forEach(function(item){
			strava.getActivity(item.id, function(){
				strava_repo.findActivity(item.id, function(savedActivity){
					var newActivity = wrapper.wrap(activityEnt,item);
					if(savedActivity !== null){
						strava.updateActivity(savedActivity, newActivity, function(){
							logger.info('Updated activity saved: ' + item.name + ' ' + (item.distance / 1000).toFixed(2) + ' km');
						});
					}else{
						strava_repo.insertActivity(newActivity, function(){
							logger.info('New activity saved: ' + item.name + ' ' + (item.distance / 1000).toFixed(2) + ' km');
						});
					}					
				});				
			});
		});
	});
	callBack();
};

strava.getActivity = function(key, callBack){
	stravaService.activities.get({id:key}, function(err,payload, limits){
		if(err){
			logger.error('Error fetchinig activity: '+ key);
		}else{
			callBack(payload);
		}
	});
};

strava.updateActivity = function(dbActivity, syncActivity, callBack){
	dbActivity.name = syncActivity.name;
	dbActivity.distance = syncActivity.distance;
	dbActivity.moving_time = syncActivity.moving_time;
	dbActivity.elapsed_time = syncActivity.elapsed_time;
	dbActivity.kudos_count = syncActivity.kudos_count;
	
	strava_repo.updateActivity(dbActivity, callBack);
}

module.exports = strava;
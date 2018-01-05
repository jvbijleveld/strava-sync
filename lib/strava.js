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

strava.fetchActivities = function(nofActivities, callBack){
	//fetch all activities
	stravaService.athlete.listActivities({'page':1, 'per_page':nofActivities}, function(err, response, limits){
		if(err){ return logger.error('ERROR fetching strava activities', err); }
		logger.info('Got Strava data, found :' + response.length + ' activities');
		callBack(response);
	});
};

strava.fetchCurrentYear = function(callBack){
	strava_repo.queryActivities(buildCurrentYearSelection(), function(activities){
		callBack(activities);
	});
};

strava.syncAllActivities = function(nofActivities,callBack){
	strava.fetchActivities(nofActivities,function(activities){
		activities.forEach(function(item){
			strava.getActivity(item.id, function(){
				strava_repo.findActivity(item.id, function(savedActivity){
					if(savedActivity !== null){
						logger.debug('Activity already found: ' + item.name + ' ' + (item.distance / 1000).toFixed(2) + ' km');
					}else{
						var newActivity = wrapper.wrap(activityEnt,item);
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

strava.builRapport = function(activities, callBack){
	var ret = {};
	ret.distance = 0;
	ret.moving_time = 0;
	ret.elevation = 0;
	ret.max_speed = 0;
	ret.kudos = 0;
	ret.activityCount = 0;
	ret.dayOfYear = functions.getDayofYear();
	
	activities.forEach(function(activity){
		ret.distance += activity.distance;
		ret.moving_time += activity.moving_time;
		ret.elevation += activity.elevation;
		ret.max_speed = (activity.max_speed > ret.max_speed)? activity.max_speed : ret.max_speed;
		ret.kudos += activity.kudos_count;
		ret[activity.location_country]++;
		ret[activity.location_city]++;
		ret.activityCount ++;
	})
	
	callBack(ret);
};


var buildCurrentYearSelection = function(){
	var now = new Date();
	var currentYear = now.getFullYear();
	logger.debug('currentYear: ' + currentYear);
	var selection = { 
		start_date_local : {
			'$gte' : new Date(currentYear,0,1),
			'$lte' : new Date(currentYear+1,0,1)
		}
	}
	logger.debug('Current Year selection: ' + JSON.stringify(selection));
	return selection;
};

module.exports = strava;
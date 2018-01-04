var stravaService = require('strava-v3');
var strava_repo = require('../lib/strava_repo');
const log4js = require('log4js');
const wrapper = require('custom-request-wrapper');

var logger = log4js.getLogger();

var activityEnt = require('../entities/activityEntity');

var strava = {};

strava.getLastActivity = function(){
	//fetch most recent activity
	
};

strava.fetchActivities = function(callBack){
	//fetch all activities
	stravaService.athlete.listActivities({'page':1, 'per_page':100}, function(err, response, limits){
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

strava.syncAllActivities = function(callBack){
	strava.fetchActivities(function(activities){
		activities.forEach(function(item){
			strava.getActivity(item.id, function(){
				strava_repo.findActivity(item.id, function(savedActivity){
					if(savedActivity !== null){
						logger.debug('Activity already found: ' + item.name + ' ' + (item.distance / 1000) + ' km');
					}else{
						var newActivity = wrapper.wrap(activityEnt,item);
						strava_repo.insertActivity(newActivity, function(){
							logger.info('New activity saved: ' + item.name + ' ' + (item.distance / 1000) + ' km');
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
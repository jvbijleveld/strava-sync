var stravaService = require('strava-v3');
var strava_repo = require('../lib/strava_repo');
const log4js = require('log4js');

logger = log4js.getLogger();

var strava = {};

strava.getLastActivity = function(){
	//fetch most recent activity
	
};

strava.fetchActivities = function(callBack){
	//fetch all activities
	stravaService.athlete.listActivities({}, function(err, payload, limits){
		if(err){ return logger.error('ERROR fetching strava activities', err); }
		logger.info('Got Strava data, found :' + payload.length + ' activities');
		
		callBack(payload);
	});
	
};

strava.syncAllActivities = function(){
	strava.fetchActivities(function(activities){
		activities.forEach(function(item){
			logger.debug(item);
			strava.getActivity(item.id, function(){
				strava_repo.insertActivity(item, function(){
					logger.info('Activity saved: ' + item.name + ' ' + (item.distance / 1000) + ' km');
				});
			});
		});
	});
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

module.exports = strava;
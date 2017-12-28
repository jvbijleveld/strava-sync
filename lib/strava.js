var stravaService = require('strava-v3');
const log4js = require('log4js');

logger = log4js.getLogger();

var strava = {};

strava.getLastActivity = function(){
	//fetch most recent activity
	
};


strava.getActivities = function(){
	//fetch all activities
	stravaService.athlete.listActivities({}, function(err, payload, limits){
		
		if(err){ return logger.error('ERROR fetching strava activities', err); }
		logger.debug('Got Strava data!: ' + payload);
		
	});
	
};

strava.getActivity = function(key){
	//fetch single activity
	
	
};

module.exports = strava;
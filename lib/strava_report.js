const log4js = require('log4js');
const functions = require('../lib/functions');

var logger = log4js.getLogger();

var strava_report = {};

strava_report.builRapport = function(activities, callBack){
	var ret = {};
	ret.distance = 0;
	ret.moving_time = 0;
	ret.elevation = 0;
	ret.max_speed = 0;
	ret.kudos = 0;
	ret.activityCount = 0;
	ret.longestRun = 0;
	ret.dayOfYear = functions.getDayofYear();
	
	activities.forEach(function(activity){
		ret.distance += activity.distance;
		ret.moving_time += activity.moving_time;
		ret.elevation += activity.elevation;
		ret.max_speed = (activity.max_speed > ret.max_speed)? activity.max_speed : ret.max_speed;
		ret.longestRun = (activity.distance > ret.longestRun)? activity.distance : ret.longestRun;
		ret.kudos += activity.kudos_count;
		ret[activity.location_country]++;
		ret[activity.location_city]++;
		ret.activityCount ++;
	});
	
	if(ret.distance > 0){
		ret.averageTempo = parseInt(ret.moving_time / (ret.distance/1000));
	}else{
		ret.averageTempo = 0;
	}
	callBack(ret);
};

module.exports = strava_report;
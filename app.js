const log4js = require('log4js');
const schedule = require('node-schedule');
const request = require('request');
const strava = require('./lib/strava');
 
log4js.configure({appenders: {
	filelog: { type: 'file', filename: './log/app.log' },
	out: { type: 'stdout' }
},
categories: {
	default: { appenders: [ 'out' ], level: 'debug' }
}
});

logger = log4js.getLogger();

var j = schedule.scheduleJob('*/10 * * * * *', function(){
  logger.debug('Running scheduler');
  
  strava.getActivities();
  
});
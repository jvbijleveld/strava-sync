require('dotenv').config();

const log4js = require('log4js');
const schedule = require('node-schedule');
const request = require('request');
const strava = require('./lib/strava');
 
log4js.configure({appenders: {
		filelog: { type: 'file', filename: './log/app.log' },
		out: { type: 'stdout' },
		'errors': {type: 'logLevelFilter', appender: 'filelog', level: process.env.LOG_LEVEL}
	},
	categories: {
		default: { appenders: [ 'out', 'errors' ], level: 'debug' }
	}
});

logger = log4js.getLogger();

var j = schedule.scheduleJob(process.env.SCHEDULER_STRING, function(){
  logger.debug('Running scheduled task');
  
  strava.syncAllActivities();
});
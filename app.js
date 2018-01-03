require('dotenv').config();

const log4js = require('log4js');
const schedule = require('node-schedule');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const strava = require('./lib/strava');

var app = express();
const hostname = '127.0.0.1';
const port = 3000;

log4js.configure({appenders: {
		filelog: { type: 'file', filename: './log/app.log', maxLogSize: 10485760, backups: 3, compress: true },
		out: { type: 'stdout' },
		'errors': {type: 'logLevelFilter', appender: 'filelog', level: process.env.LOG_LEVEL}
	},
	categories: {
		default: { appenders: [ 'out', 'errors' ], level: 'debug' }
	}
});

logger = log4js.getLogger();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, resp){
	strava.fetchCurrentYear(function(activities){
		resp.render('index', {
			title: 'Hello world',
			activities: activities
		});	
	});
});

app.listen(port, function(){
	strava.syncAllActivities(function(){
		logger.info('Activity Sync done');
	});
	logger.info('Server started on port ' + port);
});

var j = schedule.scheduleJob(process.env.SCHEDULER_STRING, function(){
  logger.debug('Running scheduled task');
  
  strava.syncAllActivities(function(){
		logger.info('Activity Sync done');
	});
});
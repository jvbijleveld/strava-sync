require('dotenv').config();

const log4js = require('log4js');
const schedule = require('node-schedule');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const strava = require('./lib/strava');

var app = express();
const hostname = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT;

log4js.configure({appenders: {
		filelog: { type: 'file', filename: './log/app.log', maxLogSize: 10485760, backups: 3, compress: true },
		out: { type: 'stdout' },
		'errors': {type: 'logLevelFilter', appender: 'filelog', level: process.env.LOG_LEVEL}
	},
	categories: {
		default: { appenders: [ 'out', 'errors' ], level: 'debug' }
	}
});

var logger = log4js.getLogger();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, resp){
	strava.fetchCurrentYear(function(activities){
		strava.builRapport(activities, function(rapport){
			resp.render('index', {
				title: 'Strava this Year',
				rapport: rapport,
				activities: activities
			});
		});
	});
});

app.listen(port, function(){
	if(process.env.SYNC_ON_STARTUP > 0){
		strava.syncAllActivities(100, function(){
			logger.info('Activity Sync done');
		});
	}
	logger.info('Server started on port ' + port);
});

var j = schedule.scheduleJob(process.env.SCHEDULER_STRING, function(){
  logger.debug('Running scheduled task');
  
  strava.syncAllActivities(25, function(){
		logger.info('Activity Sync done');
	});
});
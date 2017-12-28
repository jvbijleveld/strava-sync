const log4js = require('log4js');
const schedule = require('node-schedule');
const request = require('request');
 
log4js.configure({appenders: {
	filelog: { type: 'file', filename: './log/app.log' },
	out: { type: 'stdout' }
},
categories: {
	default: { appenders: [ 'out' ], level: 'debug' }
}
});

logger = log4js.getLogger();

var j = schedule.scheduleJob('*/30 * * * * *', function(){
  logger.debug('Running scheduler');
  
  request('http://www.vanbijleveld.nl/about/', (err, res, body) => {
	 if(err) { logger.error('HTTP error: ' + err.message); return; }
	 
	 console.log(body.url);
	  
  });
  
});
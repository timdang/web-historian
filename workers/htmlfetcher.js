// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var archiveHelpers = require('../helpers/archive-helpers.js');
var CronJob = require('cron').CronJob;

var cronJob = new CronJob({
  cronTime: '01 * * * *',
  onTick: function() {
    console.log('I am running');
    // var urlArrList;
    // fs.readFile(archiveHelpers.paths.list, 'utf8', function(err, data) {
    //     if (err) {
    //       console.log('errrrr');
    //     }
    //     urlArrList = data.split('\n');
    //   });
    // console.log('urlArrList',urlArrList);
    // archiveHelpers.downloadUrls(urlArrList);
      }, start: true, timeZone: 'America/Los_Angeles'
});

cronJob.start();

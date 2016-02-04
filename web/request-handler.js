var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
var helpers = require('./http-helpers.js');
// require more modules/folders here!

var collectData = function(request, callback) {
  var data = "";
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    var dataObject = JSON.parse(data);
    var x = dataObject.url + '\n';
    callback(x);
  });
};

var writeToFile = function(data) {
  var fd = path.join(__dirname, '../archives/sites.txt');
  // console.log('fd', fd);
  //console.log('data', data);
  fs.appendFile(fd, data, function(err) {
    if (err) {
      console.log('the data was appended');
    }
  });
};

exports.handleRequest = function(request, response) {
//  console.log('request url is ', request.url);
  var pathname = url.parse(request.url).pathname;

  if (request.method === 'GET') {
    var pathBegin = pathname.slice(1, 4);
    if (pathname === '/' || pathname === '/public') {
      fs.readFile(path.join(__dirname, 'public/index.html'), function(err, html) {
        if (err) {
          throw err;
        }
        response.writeHeader(200, {
          'Content-Type': 'text/html'
        });
        response.write(html);
        response.end(archive.paths.list);
      });
    } else if (pathBegin === 'www') {
      fs.readFile(path.join(__dirname, '../archives/sites' + pathname), function(err, html) {
        if (err) {
          return helpers.sendResponse(response, 'not found', 404);
        }
        helpers.sendResponse(response, html, 200);
      });
    } else {
      fs.readFile(path.join(__dirname, 'public' + pathname), function(err, html) {
        if (err) {
          return helpers.sendResponse(response, 'not found', 404);
        }
        response.writeHeader(200, {
          // 'Content-Type': 'text/html'
        });
        response.write(html);
        response.end(archive.paths.list);
      });
    }
  }
  if (request.method === 'POST') {
    collectData(request, function(message){
      fs.appendFile(archive.paths.list, message, 'utf8', function(err) {
        if (err) {
          console.log('the data was appended');
        }
        helpers.sendResponse(response, message, 302);
      });
    });
  }

};

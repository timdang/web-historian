var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var reqHand = require('../web/request-handler.js');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log('errrrr');
    }
    var urlArrList = data.split('\n');
    callback(urlArrList);
  });
};

exports.isUrlInList = function(url, callback) {
  this.readListOfUrls(function(x) {
    var result = false;
    x.forEach(function(value) {
      if (url === value) {
        result = true;
      }
    });
    callback(result);
  });
};

exports.addUrlToList = function(url, callback) {
  //check if it's in the list already
  this.isUrlInList(url, function(value) {
    //if it's not in the list
    if (callback(value)) {
      //add it to the list
      reqHand.writeToFile(url);
    }
  });

};

exports.isUrlArchived = function(url, callback) {
  var result = true;
  fs.readFile(this.paths.archivedSites + url, function(err) {
    if (err) {
      result = false;
    }
    callback(result);
  });
};

exports.downloadUrls = function(array) {

  var arch = path.join(__dirname, '../archives/sites');

  array.forEach(function(url) {
    var data = '';
    var formattedUrl = "http://" + url;

    return http.get(formattedUrl, function(response) {
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        //write data to that folder
        fs.writeFile(arch + "/" + url, data, function(err) {
          if (err) {
            console.log('errrrr');
          }
        });
      });
    });
  });
};

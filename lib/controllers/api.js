'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var xmlrpc = require('xmlrpc');
var async = require('async');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  res.json([
    {
      name : 'HTML5 Boilerplate',
      info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
      awesomeness: 10
    }, {
      name : 'AngularJS',
      info : 'AngularJS is a toolset for building the framework most suited to your application development.',
      awesomeness: 10
    }, {
      name : 'Karma',
      info : 'Spectacular Test Runner for JavaScript.',
      awesomeness: 10
    }, {
      name : 'Express',
      info : 'Flexible and minimalist web application framework for node.js.',
      awesomeness: 10
    }
  ]);
};

exports.getTorrents = function(req, res) {

  var client = xmlrpc.createClient({
    url: 'http://curry.whatbox.ca:80/xmlrpc',
    basic_auth: {
      user: 'danyaguacate',
      pass: 'mofongo'
    }
  });

  client.methodCall('download_list', [], function (error, torrents) {
    if (error) {
      res.send(500, error);
      return;
    }

    console.log('Method response for \'download_list\': ' + torrents);

    async.map(torrents, function (hash, next) {
      var torrent = {'hash': hash};
      async.parallel([
        function (done) {
          client.methodCall('d.get_name', [hash], function (err, val) {
            torrent.name = val;
            done(err);
          });
        },

        function (done) {
          client.methodCall('d.get_size_bytes', [hash], function (err, val) {
            torrent.size = val;
            done(err);
          });
        },

        function (done) {
          client.methodCall('d.get_completed_bytes', [hash], function (err, val) {
            torrent.completed = val;
            done(err);
          });
        }
      ], function (err) {
        next(err, torrent);
      });
    }, function (err, results) {
      if (err) {
        res.send(500, error);
        return;
      }

      res.send(results);
    })
  });
};

exports.postTorrent = function(req, res) {

  var torrent = fs.readFileSync(req.files.torrent);

  var client = xmlrpc.createClient({
    url: 'http://curry.whatbox.ca:80/xmlrpc',
    basic_auth: {
      user: 'danyaguacate',
      pass: 'mofongo'
    }
  });

  client.methodCall('load_raw_start', [torrent], function (error, value) {
    if (error) {
      res.send(500, error);
      return;
    }

    console.log('Method response for \'anAction\': ' + value);
    res.send(200);
  });
};
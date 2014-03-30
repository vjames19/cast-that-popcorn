'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var xmlrpc = require('xmlrpc');
var async = require('async');
var StreamBodyParser = require('stream-body-parser');
var Transcoder = require('stream-transcoder');
var JSFtp = require("jsftp");


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
            if (err) {
              return done(err);
            }

            val = val.replace(/\./g, ' ');
            val = val.replace(/\(?[0-9]{4}.*/, '');
            torrent.name = val;

            done();
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
    });
  });
};

exports.postTorrent = function(req, res) {
  console.log(req.files);
  var torrent = fs.readFileSync(req.files.torrent.path);

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

exports.castTorrent = function(req, res) {
  var hash = req.params.hash;

  var client = xmlrpc.createClient({
    url: 'http://curry.whatbox.ca:80/xmlrpc',
    basic_auth: {
      user: 'danyaguacate',
      pass: 'mofongo'
    }
  });

  client.methodCall('d.get_base_filename', [hash], function (error, filepath) {
    if (error) {
      res.send(500, error);
      return;
    }

    var r = request({
      'url': 'http://curry.whatbox.ca/private/files/' + filepath,
      'method': 'GET',
      'auth': {
        'user': 'danyaguacate',
        'pass': 'mofongo'
      }
    });

    new Transcoder(r).maxSize(320, 240)
      .videoCodec('vp8')
      .videoBitrate(800 * 1000)
      .fps(25)
      .audioCodec('libvorbis')
      .sampleRate(44100)
      .channels(2)
      .audioBitrate(128 * 1000)
      .format('webm')
      .stream().pipe(res);
  });
};

exports.getTomatos = function(req, res) {
  var name = req.params.name;

  var rtUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json';
  request({
    'url': rtUrl,
    'method': 'GET',
    'json': true,
    'qs': {
      'q': name,
      'page_limit': 1,
      'page': 1,
      'apikey': 'fpdms3wfznnxgxuc2evydv2k'
    }
  }, function (err, response, body) {
    console.log(body);
    if (!er && response.statusCode === 200) {
      if (body.movies.length > 0) {
        res.send(body.movies[0].ratings);
      } else {
        res.send({});
      }

      return;
    }
    
    res.send(err);
  });
};
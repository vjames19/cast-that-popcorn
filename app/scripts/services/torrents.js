'use strict';

angular.module('castThatPopcornApp')
.service('Torrents', function Torrents($http) {
  this.getTorrents = function() {
    return $http.get('/api/getTorrents');
  };
});

angular.module('castThatPopcornApp')
.service('RottenTomatoes', function Rottentomatoes($http) {
  this.getRatingFor = function(movieName) {
    return $http.get('/api/getTomatoes/' + movieName, {
      cache: true
    });
  };
});

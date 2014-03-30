'use strict';

angular.module('castThatPopcornApp')
  .service('Torrents', function Torrents($http) {
    this.getTorrents = function() {
      return $http.get('/api/getTorrents');
    };
  });

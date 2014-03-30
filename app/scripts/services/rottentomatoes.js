'use strict';

angular.module('castThatPopcornApp')
.service('RottenTomatoes', function Rottentomatoes($http) {


  this.getRatingFor = function(movieName) {
    return $http.get('/api/getTomatoes/' + movieName, {
      cache: true
    });
  };
});

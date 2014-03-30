'use strict';

angular.module('castThatPopcornApp')
.controller('MainCtrl', function ($scope, $modal, $interval, $location, Torrents) {
  $scope.user = {};

  var getThem = function() {
    return Torrents.getTorrents().then(function(torrents) {
      $scope.casts = torrents.data;
      return torrents;
    });
  };

  $scope.getTorrents = function() {
    getThem().then(function() {
      $interval(getThem, 5000);
    });
  };

  $scope.setMediaUrl = function(hash) {
    var url = 'http://' + $location.host() + ':' + $location.port() + '/api/castTorrent/' + hash;
    console.log('da url', url);
    loadMedia(url);
  };

  var ModalInstanceCtrl = function ($scope, $modalInstance, $upload) {

    var upload = function() {
      $upload.upload({
          url: '/api/postTorrent', //upload.php script, node.js route, or servlet url
          method: 'POST',
          // data: {myObj: $scope.myModelObj},
          file: $scope.selectedFile, // or list of files: $files for html5 only
          fileFormDataName: 'torrent'
        }).progress(function(evt) {
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data) {
          // file is uploaded successfully
          console.log('SUCESSFULLY UPLOADED', data);
        });
    };

    $scope.selectedFile;
    $scope.ok = function () {
      upload();
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.onFileSelect = function($files) {
      //$files: an array of files selected, each file has name, size, and type.
      $scope.selectedFile = $files[0];
    };



  };

  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modalFileUpload.html',
      controller: ModalInstanceCtrl
    });

    modalInstance.result.then(function() {
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };
});

var deenPodApp = angular.module('deenPodApp', []);

deenPodApp.controller('PlayerController', function($scope, $element) {

  var playerEl = $element[0].getElementsByTagName('audio')[0];

  function addToPlaylist() {
    var url = null, title = '', params = (location.hash || '').replace(/^#/, '').split('&');
    for(var i = 0, l = params.length ; i < l ; i++) {
      var parts = params[i].split('=');
      switch(parts[0]) {
      case 'url':   url   = decodeURIComponent(parts[1]); break;
      case 'title': title = decodeURIComponent(parts[1]); break;
      }
    }

    if(url) {
      var playlist = $scope.playlist;
      if(!$scope.playlist.some(function(song) { return song.url == url; })) {
        playlist.push({ url:url, title:title });
      }

      if(playerEl.paused) {
        playerEl.src = $scope.currentUrl = url;
        if(playerEl.readyState != 0) {
          playerEl.currentTime = 0;
        }
        playerEl.play();
      }
    }
  }

  function onload() {
    var playlistOuterEl = $element[0].getElementsByClassName('deenpod-playlist-outer')[0];
    playlistOuterEl.style.top = playerEl.parentNode.offsetHeight + 'px';
  }

  function onPlay() {
    $scope.status = 'play';
  }

  function onPause() {
    $scope.status = 'pause';
  }

  function onStop() {
    if($scope.currentUrl) {
      var currentUrl = $scope.currentUrl, playlist = $scope.playlist;
      for(var i = 0, l = playlist.length ; i < l ; i++) {
        if(currentUrl == playlist[i].url) {
          break;
        }
      }
      if(playlist[++i]) {
        playerEl.src = $scope.currentUrl = playlist[i].url;
        playerEl.play();
      }
    }
  }

  $scope.currentUrl = null;
  $scope.playlist   = [];
  $scope.status     = 'pause';

  $scope.onClickSong = function(url) {
    if($scope.currentUrl != url) {
      $scope.currentUrl = url;
      playerEl.src = $scope.currentUrl;
      playerEl.play();
    } else if(playerEl.paused) {
      playerEl.play();
    } else {
      playerEl.pause();
    }
  };

  $scope.onClickClearPlaylist = function() {
    $scope.playlist = [];
    playerEl.src    = null;
  };

  onload();
  addToPlaylist();
  window.addEventListener('load', $scope.$apply.bind($scope, onload));
  window.addEventListener('popstate', $scope.$apply.bind($scope, addToPlaylist));
  playerEl.addEventListener('playing', $scope.$apply.bind($scope, onPlay));
  playerEl.addEventListener('pause', $scope.$apply.bind($scope, onPause));
  playerEl.addEventListener('ended', $scope.$apply.bind($scope, onStop));
  playerEl.addEventListener('error', $scope.$apply.bind($scope, onStop));
});

var app = angular.module('myPlayer', []);
app.controller('playerCtrl', function($scope) {
	$scope.url = "";
	$scope.info = function(text) {
		document.getElementById("iconInfo").className = "glyphicon glyphicon-exclamation-sign";
		document.getElementById("txtInfo").innerHTML = text;
	}
	$scope.start = function() {
		if ($scope.url != "") {
			if (($scope.url.search(".m3u8")) != -1) {
				if (Hls.isSupported()) {
					var player = document.getElementById('video');
					var hls = new Hls();
					hls.loadSource($scope.url);
					hls.attachMedia(player);
					hls.on(Hls.Events.MANIFEST_PARSED, function() {
						player.play();
					});
					hls.on(Hls.Events.ERROR, function(event, data) {
						var errorType = data.type;
						var errorDetails = data.details;
						var errorFatal = data.fatal;
						switch (data.details) {
						case Hls.ErrorDetails.FRAG_LOAD_ERROR:
							$scope.info("HLS download error");
							break;
						case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
							$scope.info("HLS download error");
							break;
						case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
							$scope.info("HLS download error");
							break;
						default:
							break;
						}
					});
				} else {
					$scope.info("HLS not support");
				}
			} else if (($scope.url.search(".mpd")) != -1) {
				if (typeof (window.MediaSource || window.WebKitMediaSource) === "function") {
					var player = dashjs.MediaPlayer().create();
					player.initialize(document.querySelector("#video"), $scope.url, true);
					player.on('error', function(e) {
						if (e.error === 'download') {
							$scope.info("MPEG-DASH download error");
						}
					});
				} else {
					$scope.info("MPEG-DASH not support");
				}
			} else {
				$scope.info("url format error!!!");
			}
		} else {
			$scope.info("enter the link, please");
		}
	}
});
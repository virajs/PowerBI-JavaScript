(function (powerbi) {
    'use strict';

    powerbi.Embed = Embed;

    function Embed() { }

    Embed.prototype = {
        init: function () {
            var embedUrl = this.getEmbedUrl();
            var iframeHtml = '<iframe style="width:100%;height:100%;" src="' + embedUrl + '" scrolling="no" allowfullscreen="true"></iframe>';
            this.element.innerHTML = iframeHtml;
            this.iframe = this.element.childNodes[0];
            this.iframe.addEventListener('load', this.load.bind(this), false);
        },
        load: function () {
            var computedStyle = window.getComputedStyle(this.element);
            var accessToken = this.getAccessToken();
            
            var initEventArgs = {
                message: {
                    action: this.options.loadAction,
                    accessToken: accessToken,
                    width: computedStyle.width,
                    height: computedStyle.height
                }
            };

            powerbi.utils.raiseCustomEvent(this.element, 'embed-init', initEventArgs);
            this.iframe.contentWindow.postMessage(JSON.stringify(initEventArgs.message), '*');
        },
        getAccessToken: function () {
            var accessToken = this.element.getAttribute('powerbi-access-token');

            if (!accessToken) {
                accessToken = powerbi.accessToken;
                
                if (!accessToken) {
                    throw new Error("No access token was found for element. You must specify an access token directly on the element using attribute 'powerbi-access-token' or specify a global token at: powerbi.accessToken.");
                }
            }

            return accessToken;
        },
        getEmbedUrl: function () {
            return this.element.getAttribute('powerbi-embed');
        },
        fullscreen: function () {
            var elem = this.iframe;

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        },
        exitFullscreen: function () {
            if (!this.isFullscreen()) {
                return;
            }

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },
        isFullscreen: function () {
            var options = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullscreenScreenElement', 'msFullscreenElement'];
            for (var i = 0; i < options.length; i++) {
                if (document[options[i]] === this.iframe) {
                    return true;
                }
            }

            return false;
        }
    };
} (window.powerbi = window.powerbi || {}));
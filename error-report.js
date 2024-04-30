(function () {

  //IE8 Array hack
  (function () {
    'use strict';
    var _slice = Array.prototype.slice;

    try {
      // Can't be used with DOM elements in IE < 9
      _slice.call(document.documentElement);
    } catch (e) { // Fails in IE < 9
      // This will work for genuine arrays, array-like objects,
      // NamedNodeMap (attributes, entities, notations),
      // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
      // and will not fail on other DOM objects (as do DOM elements in IE < 9)
      Array.prototype.slice = function (begin, end) {
        // IE < 9 gets unhappy with an undefined end argument
        end = (typeof end !== 'undefined') ? end : this.length;

        // For native Array objects, we use the native slice function
        if (Object.prototype.toString.call(this) === '[object Array]') {
          return _slice.call(this, begin, end);
        }

        // For array like object we handle it ourselves.
        var i, cloned = [],
          size, len = this.length;

        // Handle negative value for "begin"
        var start = begin || 0;
        start = (start >= 0) ? start : Math.max(0, len + start);

        // Handle negative value for "end"
        var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
        if (end < 0) {
          upTo = len + end;
        }

        // Actual expected size of the slice
        size = upTo - start;

        if (size > 0) {
          cloned = new Array(size);
          if (this.charAt) {
            for (i = 0; i < size; i++) {
              cloned[i] = this.charAt(start + i);
            }
          } else {
            for (i = 0; i < size; i++) {
              cloned[i] = this[start + i];
            }
          }
        }

        return cloned;
      };
    }
  }());


  var serverUrl = 'https://szrtest.itomx.cn/log-api/error/report';
  // 测试环境使用的上报地址
  var serverUrlInTest = 'https://szrtest.itomx.cn/log-api/error/report';
  var sendWhiteList = [ //数据上报域名白名单
    'localhost:8080',
    '192.168.1.55',
    '192.168.1.105',
    '192.168.1.15',
    'szrtest.itomx.cn',
    'szrhopesen.itomx.cn'
  ];
  var domain = document.domain;

  var oldErrorHandler = window.onerror;
  var oldXHR = null;

  (function (sendIframeBlockedToServer) {
    function checkIframe() {
      this.interval = null;
      this.checkTime = 1000;
      this.whiteList = [ //不拦截的ifr域名白名单
      ].slice.call(sendWhiteList);
      this.check();
    }
    checkIframe.prototype.check = function () {
      var self = this;
      if (!this.interval) {
        this.interval = setInterval(function () {
          var iframes = document.getElementsByTagName('iframe');
          var iframes = Array.prototype.slice.call(iframes);
          for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            var src = iframe.src;
            var width = iframe.offsetWidth;
            var height = iframe.offsetHeight;
            var offsetLeft = iframe.offsetLeft;
            var offsetTop = iframe.offsetTop;
            var inWhiteList = false;
            for (var j = 0; j < self.whiteList.length; j++) {
              var item = self.whiteList[j];
              if (src.indexOf(item) != -1) {
                inWhiteList = true;
                break;
              }
            }
            if (!inWhiteList) {
              var hasHide = iframe.getAttribute('data-hide');
              if (!hasHide) {
                // 上报数据平台提供监控机制
                sendIframeBlockedToServer("iframeBlocked", {
                  hideIframeUrl: src,
                  iframeWidth: width,
                  iframeHeight: height,
                  iframeOffsetLeft: offsetLeft,
                  iframeOffsetTop: offsetTop
                });
                iframe.setAttribute('data-hide', 'true')
                iframe.style.display = 'none'; // 隐藏不是我们域名的iframe
              }
            }
          }
        }, this.checkTime)
      }
    }
    return new checkIframe();
  })(sendIframeBlockedToServer)

  function getBaseInfo() {
    return {
      title: document.title,
      userAgent: window.navigator.userAgent,
      url: window.location.protocol + '//' + window.location.host + window.location.pathname,
      locale: window.navigator.language || window.navigator.userLanguage,
      time: (new Date).getTime()
    }
  }

  function ifReportHttpError(status, url) {
    return !(0 === status && /^file:\/\/\//.test(url) || /^2\d\d$/.test(status))
  }

  function sendHttpErrorToServer(errorType, request, response) {
    sendToServer({
      type: errorType, // 可能取值如下： httpError, httpTimeout
      info: getBaseInfo(),
      detail: {
        request: request,
        response: response
      }
    })
  }

  function sendResourceErrorToServer(errorType, options) {
    sendToServer({
      type: errorType, // 可能取值如下： httpError, httpTimeout
      info: getBaseInfo(),
      detail: options
    })
  }

  function sendExecErrorToServer(errorType, options) {
    sendToServer({
      type: errorType,
      info: getBaseInfo(),
      detail: options
    })
  }

  function sendPromiseRejectErrorToServer(errorType, options) {
    sendToServer({
      type: errorType,
      info: getBaseInfo(),
      detail: options
    })
  }

  function sendIframeBlockedToServer(errorType, options) {
    sendToServer({
      type: errorType,
      info: getBaseInfo(),
      detail: options
    })
  }

  function sendVueErrorToServer(errorType, options) {
    sendToServer({
      type: errorType,
      info: getBaseInfo(),
      detail: options
    })
  }

  /**
   * 是否处于测试环境
   * @returns {boolean}
   */
  function isInTestEnv() {
    return (!!~window.location.hostname.indexOf('te-') || !!~window.location.hostname.indexOf('-test'))
  }
  function sendToServer(params) {

    var inWhiteList = false;
    for (var j = 0; j < sendWhiteList.length; j++) {
      var item = sendWhiteList[j];
      if (domain.indexOf(item) != -1) {
        inWhiteList = true;
        break;
      }
    }
    // debugger
    if (inWhiteList) {
      var apiUrl = isInTestEnv() ? serverUrlInTest : serverUrl;
      (new Image).src = apiUrl + "?event=" + encodeURIComponent(JSON.stringify(params));
    }
  }

  if (window.XMLHttpRequest && window.XMLHttpRequest.prototype) {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      try {
        this.btDebugTemp = {
          method: method,
          url: url,
          startTime: (new Date).getTime()
        }
      } catch (n) { }
      return open && open.apply(this, arguments)
    }
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (params) {
      var self = this;
      self.btDebugTemp.btDebugHttpRecorded = false;
      var onloadend = self.onloadend;
      try {
        self.onloadend = function () {
          (function (self, params) {
            onloadend && onloadend();
            try {
              var endTime = (new Date).getTime();
              var startTime = self.btDebugTemp.startTime;
              var responseTime = endTime - startTime;
              var method = self.btDebugTemp.method;
              var url = self.responseURL || self.btDebugTemp.url;
              var status = self.status;
              var statusText = self.statusText;
              var response = self.response;
              if (!self.btDebugTemp.btDebugHttpRecorded) {
                var errorType;
                var request = {
                  method: method,
                  url: url,
                  body: params
                };
                var respons = {
                  status: status,
                  statusText: statusText,
                  response: response,
                  elapsedTime: responseTime
                };
                var errorType = ifReportHttpError(status, url) ? "httpError" : "httpTimeout";
                if (self.readyState === 4 && status !== 200) {
                  sendHttpErrorToServer(errorType, request, respons)
                }
              }
            } catch (n) { }
          })(self, params)
        }
      } catch (n) { }
      return send && send.call(this, ...arguments)
    }
  }
  var oldVueErrorHandler = null;
  if (typeof Vue !== 'undefined' && Vue.config) {
    oldVueErrorHandler = Vue.config.errorHandler;
    Vue.config.errorHandler = function (err, vm, info) {
      try {
        sendVueErrorToServer('vueError', {
          stack: err.stack,
          method: info
        })
      } catch (n) { }
      oldVueErrorHandler && oldVueErrorHandler.apply(this, arguments)
    }

  }
  window.onerror = function (msg, url, line, col, error) {
    var stack = "";
    col = col || (window.event && window.event.errorCharacter) || 0;
    if (error && error.stack) {
      stack = error.stack;
    }
    sendExecErrorToServer('jsError', {
      title: msg,
      url: url,
      line: line,
      col: col,
      stack: stack
    })
    oldErrorHandler && typeof oldErrorHandler === 'function' && oldErrorHandler(err)
    return false;
  }
  window.addEventListener ? window.addEventListener('error', function (e) {
    var resourceType = e.target.localName;
    if (resourceType === "link" || resourceType === "script" || resourceType === "img" || resourceType === "style") {
      var sourceUrl = e.target.href || e.target.src;
      if (!sourceUrl || !!~sourceUrl.indexOf(serverUrl)) {
        return false
      }
      if (/^https\:/.test(location.protocol) && /^http\:/.test(sourceUrl)) {
        sendResourceErrorToServer('resourceMixedContentError', {
          resourceType: resourceType,
          url: sourceUrl,
          outerHTML: e.target.outerHTML,
          msg: 'request was blocked mixed-content',
          timeStamp: e.timeStamp
        });
        return false
      }
      sendResourceErrorToServer('resourceError', {
        resourceType: resourceType,
        url: sourceUrl,
        outerHTML: e.target.outerHTML,
        timeStamp: e.timeStamp
      });
    } else {
      return false;
    }
  }, true) : '';

  window.addEventListener ? window.addEventListener('unhandledrejection', function (event) {
    sendPromiseRejectErrorToServer('unhandledrejection', {
      reason: event.reason,
      timeStamp: event.timeStamp,
      type: event.type
    });
    event.preventDefault();
  }) : ''

  window.jslog_loaded = true;
})();

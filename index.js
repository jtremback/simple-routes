'use strict';
var _ = {
  pairs: require('lodash.pairs'),
  zip: require('lodash.zip')
};

var Router = function (routes, opts) {
  var _this = this;
  this.routes = routes;
  this.opts = opts;
  window.addEventListener('hashchange', function () {
    _this.route();
  });

  this.route();
};

Router.prototype.route = function() {
  var hash = window.location.hash;
  var href = window.location.href;
  var _this = this;
  var urlArr = this.processUrl(hash);
  var pairs = _.pairs(this.routes); // Convert routes object to arrays [[key, value], [key, value]]

  // Ensure URL has trailing slash
  if (this.opts.appendTrailingSlash) {
    if (href.charAt(href.length - 1) !== '/') {
      if (window.history) {
        window.history.replaceState({}, null, href + '/');
      } else {
        window.location.replace(href + '/');
      }
    }
  }

  var anyMatch = pairs.some(function (pair) {
    var routeArr = _this.processUrl(pair[0]); // Turn Url to array
    var params = {};

    // If they aren't the same length, we can stop right now
    if (routeArr.length !== urlArr.length) { return false; }

    var zipped = _.zip(routeArr, urlArr); // Zip route to url

    // Check if route matches, and get params
    var routeMatch = zipped.every(function (pair) {
      // Is it a parameter? e.g. ':param'
      if (pair[0].charAt(0) === ':') {
        params[pair[0].slice(1)] = pair[1]; // Map pair back into key and value
        return true; // Return true to continue loop
      }

      if (pair[0].charAt(0) === '?') {
        return true;
      }

      // Otherwise they must match
      return pair[0] === pair[1];
    });

    // If the route matches
    if (routeMatch) {
      pair[1](params); // Run callback
      return true; // Return true to break loop
    }

    // If not, return false to continue
    return false;
  });

  if (!anyMatch) { // If none of the routes match
    _this.opts.unmatched(); // Run unmatched callback
  }
};

Router.prototype.processUrl = function(url) {
  if (url.charAt(0) === '#') { url = url.slice(1); } // If it starts with a hash, remove
  return url.split('/').filter(Boolean); // Split into array and remove empty strings
};

module.exports = Router;

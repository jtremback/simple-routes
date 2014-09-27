Initialize router with routing strings matched to list of callbacks
: denotes a parameter. Callback function is called with params object.

Since these routes are in a hashmap, they are not matched in any particular order.

First argument is the routes object, second argument is an options object.

    _this.routes = {
      '#/': toListView,
      '#/gerbils/:id/edit/': function (params) {
        toEditView(params.id);
      },
      '#/gerbils/new': toNewView,
      '#/gerbils/:id/copy/': function (params) {
        toCopyView(params.id);
      }
    };

    var opts = {
      unmatched: function () {
        // Do some stuff when none of the routes match
      },
      appendTrailingSlash: true // Whether or not to force all urls to have trailing slash
    }

    new Router(_this.routes, opts);
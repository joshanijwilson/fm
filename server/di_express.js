var di = require('di');
var q = require('q');


// Helper to make annotations in ES5 shorter.
function inject(fn, tokens) {
  var annotation = new di.Inject();
  di.Inject.apply(annotation, Array.isArray(tokens) ? tokens : Array.prototype.slice.call(arguments, 1))
  di.annotate(fn, annotation);
  return fn;
}

function provide(fn, token) {
  di.annotate(fn, new di.Provide(token));
  return fn;
}

function providePromise(fn, token) {
  di.annotate(fn, new di.ProvidePromise(token));
  return fn;
}

function bind(token) {
  return {
    toValue: function(value) {
      return inject(provide(function valueProvider() {
        return value;
      }, token));
    }
  }
}

// Shallow merge, without mutating the original objects.
// Only own properties (ignores prototypes).
// Does not handle if both objects define the same property.
function merge(obj1, obj2) {
  function _merge(dst, src) {
    for (var key in src) {
      if (Object.hasOwnProperty.call(src, key)) {
        dst[key] = src[key];
      }
    }
    return dst;
  }

  return _merge(_merge(Object.create(null), obj1), obj2);
}


function Request() {}
function Response() {}
function DbPool() {}

inject(DbQuery, DbPool);
function DbQuery(pool) {
  return function(query, values) {
    var d = q.defer();

    pool.query(query, values || undefined, function(err, result) {
      if (err) {
        return d.reject(err);
      }
      return d.resolve(result);
    });

    return d.promise;
  }
}

var bodyParser = require('body-parser')();

inject(RequestBody, Request);
di.annotate(RequestBody, new di.ProvidePromise);
function RequestBody(request) {
  var d = q.defer();

  bodyParser(request, null, function() {
    d.resolve(request.body);
  });

  return d.promise;
}

inject(PathParams, Request);
function PathParams(request) {
  return merge(request.query, request.params);
}

function PathParam(paramName) {
  return inject(function(params) {
    return params[paramName];
  }, PathParams);
}


function registerRoutes(injector, app, routes) {
  Object.keys(routes).forEach(function(url) {
    ['GET', 'POST', 'PUT', 'DELETE'].forEach(function(method) {
      var route = routes[url][method];

      if (route) {
        inject(route.handler, route.inject);

        console.log('register', method, url)
        app[method.toLowerCase()](url, function wrapperHandler(request, response) {
          console.log('request')

          var requestInjector = injector.createChild([
            bind(Request).toValue(request),
            bind(Response).toValue(response)
          ]);

          requestInjector.getPromise(route.handler).then(function(value) {
            // Returning null means the handler took care sending response.
            if (value !== null) {
              response.send(value);
            }
          }, function(err) {
            console.error(err.stack || err);
            if (err.status) {
              response.status(err.status);
              response.send(err);
              return;
            }

            if (200 <= response.statusCode && response.statusCode < 400) {
              response.status(500);
            }

            response.send(err);
          });
        });
      }
    });
  });
}


exports.registerRoutes = registerRoutes;
exports.bind = bind;

// Annotations.
exports.Request = Request;
exports.Response = Response;
exports.DbPool = DbPool;
exports.DbQuery = DbQuery;
exports.RequestBody = RequestBody;
exports.PathParams = PathParams;
exports.PathParam = PathParam;

// Annotation helpers
exports.inject = inject;
exports.providePromise = providePromise;

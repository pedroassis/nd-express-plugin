'package nd-express-plugin';

'import nd-express-plugin.HTTPConfig';
'import nd-express-plugin.Express';
'import nd-express-plugin.ExpressBinder';
'import nd.NodeDependencyConfig';

'@BeforeLoadContainer'
function ExpressPlugin(Express, ExpressBinder, NodeDependencyConfig){

    var server = NodeDependencyConfig.express;

    var annotationMethods = [
        "Get",
        "Post",
        "Put",
        "Delete",
        "Options",
        "Patch",
        "Head",
        "Intercept"
    ];

    var isRunning;
    var app;

    "@InjectAnnotatedWith([@RequestHandler, @Interceptor, @ExpressConfiguration])"
    this.configure = function(handlers, interceptors, expressConfiguration) {
        app = getApp();
        for (var i = expressConfiguration.length - 1; i >= 0; i--) {
            expressConfiguration[i].configure && expressConfiguration[i].configure(app); 
        }
        if(!isRunning && server && server.port && server.host){
            app.listen(server.port, server.host);

            console.log('Express listening at http://%s:%s', server.host, server.port);
            isRunning = true;
        }

        requestHandlers(interceptors, app, 'Interceptor', 'all');

        requestHandlers (handlers, app, 'RequestHandler');
    };

    function getApp () {
        app = app || Express.express();
        return app;
    }

    this.addHandler = function(handler) {
        var keys = Object.keys(handler);
        for (var j = keys.length - 1; j >= 0; j--) {
            var key = keys[j];
            var method = handler[key];
            bindListeners(method, getApp(), handler.constructor.annotations.RequestHandler.value || '');
        }
    };

    function requestHandlers (handlers, app, annotation, httpMethod) {
        for (var i = handlers.length - 1; i >= 0; i--) {
            var instance = handlers[i];
            var keys = Object.keys(instance);
            for (var j = keys.length - 1; j >= 0; j--) {
                var key = keys[j];
                var method = instance[key];
                bindListeners(method, app, instance.constructor.annotations[annotation].value || '', httpMethod);
            }
        }
    }

    function bindListeners (method, app, root, httpMethod) {
        for (var i in method.annotations) {
            var annotation = method.annotations[i];
            if(annotationMethods.indexOf(annotation.name) !== -1 && packaged(annotation)){
                httpMethod = httpMethod || annotation.name.toLowerCase();
                var url = root + (annotation.value || '');
                ExpressBinder.bind(app, httpMethod, url, method);
            }
        }
    }

    function packaged(annotation) {
        return !annotation.packaged || annotation.packaged.indexOf('nd-express-plugin.') === 0;
    }

}

module.exports = ExpressPlugin;
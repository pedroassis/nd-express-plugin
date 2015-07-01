'package nd-express-plugin';

'import nd-express-plugin.HTTPConfig';
'import nd-express-plugin.Express';
'import nd-express-plugin.ExpressBinder';
'import nd-express-plugin.NodeDependencyConfig';

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

    "@InjectAnnotatedWith([@RequestHandler, @Interceptor, @ExpressConfiguration])"
    this.configure = function(handlers, interceptors, expressConfiguration) {
        var app = Express.express();
        for (var i = expressConfiguration.length - 1; i >= 0; i--) {
            expressConfiguration[i].configure && expressConfiguration[i].configure(app); 
        }
        if(!isRunning && server && server.port && server.host){
            app.listen(server.port, server.host);
            isRunning = true;
        }

        requestHandlers(interceptors, app, 'Interceptor', 'all');

        requestHandlers (handlers, app, 'RequestHandler');
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

module.exports = NodeDependencyPlugin;
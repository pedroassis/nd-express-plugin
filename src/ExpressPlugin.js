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
    var app = Express.express();
    
    app.use(Express.bodyParser.json());
    app.use(Express.bodyParser.urlencoded({ extended: true }));

    "@InjectAnnotatedWith([@RequestHandler, @Interceptor, @ExpressConfiguration])"
    this.configure = function(handlers, interceptors, expressConfiguration) {
        for (var i = expressConfiguration.length - 1; i >= 0; i--) {
            expressConfiguration[i].configure && expressConfiguration[i].configure(app); 
        }
        if(!isRunning && server && server.port && server.host){
            app.listen(server.port, server.host);

            console.log('Express listening at http://%s:%s', server.host, server.port);
            isRunning = true;
        }

        requestHandlers(interceptors, 'Interceptor', 'all');

        requestHandlers (handlers, 'RequestHandler');
    };

    this.addHandler = function(handler) {
        var keys = Object.keys(handler);
        for (var j = keys.length - 1; j >= 0; j--) {
            var key = keys[j];
            var method = handler[key];
            bindListeners(method, handler.constructor.annotations.RequestHandler.value || '');
        }
    };

    function requestHandlers (handlers, annotation, httpMethod) {
        for (var i = handlers.length - 1; i >= 0; i--) {
            var instance = handlers[i];
            var keys = Object.keys(instance);
            for (var j = keys.length - 1; j >= 0; j--) {
                var key = keys[j];
                var method = instance[key];
                bindListeners(method, instance.constructor.annotations[annotation].value || '', httpMethod);
            }
        }
    }

    function bindListeners (method, root, httpMethod) {
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
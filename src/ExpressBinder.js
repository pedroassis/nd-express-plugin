'package nd-express-plugin';

'import nd-express-plugin.ParamBuilder';
'import nd.FunctionRunner';
function ExpressBinder(ParamBuilder, FunctionRunner) {
    
    this.bind = function(ExpressApp, method, url, callback) {
        console.log('Binding a new listener to %s with method %s, the callback waits for %s', url, method, callback.$inject.join(', ').replace(/\$/, ''));

        ExpressApp[method](url, function(req, res, next) {
            var locals = ParamBuilder.build(req, res, next);
            var hadException;

            var returnedValue = doRequest(callback, locals, function(error) {
                hadException = true;
                errorHandler(res, error);
            });

            if(isPromise(returnedValue)){
                bindPromise(returnedValue, res);
            }
            else if(!hadException && returnedValue !== undefined){
                res.send(returnedValue);
            }
        });
    };

    function doRequest(callback, locals, errorHandler) {
        var missing = callback.$inject.filter(function(parameter) {
            return locals[parameter] === void(0);
        });
        if(missing.length){
            errorHandler(("Invalid Request! Missing " + missing.join(', ')).replace(/ \$/, ' '))
        } else {
            return runCallback(callback, locals, errorHandler);
        }
    }

    function bindPromise (promise, response) {
        promise.then(function(body) {
            response.send(body);
        })
        .then(null, function(error) {
            errorHandler(response, error);
        });
    }

    function isPromise(obj) {
        return obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function' && obj.then.length >= 2 && obj.then.length <= 3;
    }

    /**
     *  Try outside main function to avoid compiler bailout
     */
    function runCallback(callback, locals, errorHandler) {
        try {
            return FunctionRunner.run(callback, locals);
        } catch (e){
            errorHandler(e);
        }
    }

    /**
     *  Error handler, future versions should provide exception handling feature
     */
    function errorHandler (response, error) {
        var message = error && (error.stack || error.message);
        response.status(400).send(message || error || 'Bad Request');
    }
}
module.exports = ExpressBinder;

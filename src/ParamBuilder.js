'package nd-express-plugin';

function ParamBuilder() {

    var requestKeys;
    
    this.build = function(req, res, next) {
        requestKeys = requestKeys || getKeys(req);

        var params = {};

        for (var i = requestKeys.length - 1; i >= 0; i--) {
            var key = requestKeys[i];
            params[key] = req[key];
        }

        params.next = next;

        copy(params, req.query);
        copy(params, req.cookies);
        copy(params, req.params);

        params.done = function(response) {
            res.send(response);
        };

        params.error = function(response, status) {
            res.status(status || 400).send(response);
        };

        params.request = req;
        params.response = res;

        return params;
    };

    function copy(params, source) {

        for (var key in source) {
            var name = '$' + key;
            params[name] = source[key];
        }
    }

    function getKeys(req) {
        var keys = Object.keys(req);
        var clone = new Array(keys.length);
        for (var i = keys.length - 1; i >= 0; i--) {
            var key = keys[i];
            if(typeof(req[key]) !== 'function' && key.indexOf('_') !== 0){
                clone[i] = key;
            }
        }
        return clone;
    }

}

module.exports = ParamBuilder;

var chai                    = require("chai");
var sinon                   = require("sinon");
var expect                  = chai.expect;
var fs                      = require('fs');
var path                    = require('path');

var PluginClass             = require("../src/NodeDependencyPlugin.js");
var ExpressBinder           = require("../src/ExpressBinder.js");
var ParamBuilder            = require("../src/ParamBuilder.js");

var runner                  = {
    run : function() {}
};

var container               = require('./getContainer')();

var ExpressClass            = require("../src/Express.js");

var expressHolder           = new ExpressClass();

var express                 = expressHolder.express();

sinon.stub(express, 'listen');

expressHolder.express       = sinon.stub();

expressHolder.express.returns(express);

var plugin                  = new PluginClass(expressHolder, new ExpressBinder(new ParamBuilder(), runner), {
    express : {
        host : '12345',
        port : 1245
    }
});

var methods = [
    "get",
    "post",
    "put",
    "delete",
    "options",
    "patch",
    "head",
    "all"
];

methods.forEach(function(method) {
    sinon.stub(express, method);
});


describe('The container should honor the plugins annotations', function() {

});



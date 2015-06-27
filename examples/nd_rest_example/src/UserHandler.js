'package com.pedro'

'@RequestHandler'
function UserHandler () {
    
    '@Get("/all")'
    this.fetchAll = function() {
        return [{
            name : 'USER!'
        }, {
            anotherOne : 1234567
        }];
    };
    
    '@Get("/id/:id")'
    this.getByID = function($id) {
        return {
            userID : $id
        };
    };

}

module.exports = UserHandler;
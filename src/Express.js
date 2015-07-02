'package nd-express-plugin';

function Express () {
    return {
        express : require('express'),
        bodyParser  : require('body-parser')
    };
}

module.exports = Express;
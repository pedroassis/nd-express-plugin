
"@Interceptor"
function Interceptor () {
    
    "@Intercept('/*')"
    this.all = function(url, next) {
        console.log(url);
        next();
    }
}

module.exports = Interceptor;
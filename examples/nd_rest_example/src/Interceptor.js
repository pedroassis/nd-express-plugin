
"@Interceptor"
function Interceptor () {
    
    "@Intercept('/*')"
    this.all = function(url, next) {
        console.log("Intercepted the url: '" + url + "' on /*");
        next();
    }
    
    "@Intercept('/user')"
    this.user = function(url, next, response, session) {
        console.log("Intercepted the url: '" + url + "' on /user");
        console.log(session);
        response.status(401).send('Access Denied');
    }
}

module.exports = Interceptor;
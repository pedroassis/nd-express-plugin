
## nd-express-plugin

This is the first plugin that adds ExpressJS bindings using the annotation support from [node-dependency](https://github.com/pedroassis/node-dependency/tree/v2).  

What this module does is to allow you to create web services without the boilerplate code from ExpressJS.  

**Install**  
``` 
npm install --save nd-express-plugin
```

You''ll need to have installed [node-dependency](https://github.com/pedroassis/node-dependency/).  

You should also check this other plugin [nd-mongo](https://github.com/pedroassis/nd-mongo) which uses this plugin to expose mongo collection though a HTTP API.  

Node-dependency will automatically find this module and call all needed function to configure it, therefore you do not need to require it.  

Somewhere in your source folder you can add JS files with the following annotations, this plugin will use node-dependency's auto discovery to find them and wire all the handlers.  

Supported annotations:  
```
 - @Get, @Post, @Put, @Patch, @Head, @Options, @Delete
 - @RequestHandler
 - @Interceptor
 - @ExpressConfiguration
```  
  **@RequestHandler**
Used to indicated that a Class is a Request Handler.  
 
 - Targets: Class
 - Parameters: a String representing the base url of that Class  

Usages:  
```js 
		// Without defining a base url
		'@RequestHandler'
		function Handler(){
				...
		}
		module.exports = Handler;
```
```js 
		// Base URL set to '/handler'
		'@RequestHandler("/handler")'
		function Handler(){
				...
		}
		module.exports = Handler;
```  

**HTTP Annotations: @Get, @Post, @Put, @Patch, @Head, @Options, @Delete**   
These annotations are used to indicate that a method from a RequestHandler class should be called when a request with the defined HTTP Method is made to the desired url.  
You can receive a lot of parameters in those methods, like the request or the response

 - Targets: Method
 - Parameters: a String representing the url to listen

Usages

```js
		'@RequestHandler("/handler")'
		function Handler(Model){
				
				'@Get'
				this.fetch = function(){
					return [{}]; // The returned value will be sent the same as 'response.send([{}])'
				}
				
				'@Post'
				this.create = function(body){
					// The response will have its send method call with the value resolved from the promise
					return Model.save(body);
				}

				'@Get("/id/:id")'
				this.find = function($id, done, error){
					// You can also use the done method to send the data
					Model.find({
						_id : $id
					}, done);
				}
		}
		module.exports = Handler;
```

DOCs under construction, see the examples

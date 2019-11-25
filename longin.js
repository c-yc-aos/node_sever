var http        = require('http');
var url         = require('url');
var RequestFunc = require("request");
var qs          = require('querystring');
var key         = "Datou-Ready-sdhqwdhwqeho";
http.createServer(function main(request,response) {
	if(request.url!="/favicon.ico"){
		var pares = url.parse(request.url, true);
		var path = pares.pathname;
		var spath = path.replace(/\//,"") || 'index';
		switch(spath){
			case "visit":
			urls = request.headers.referer.split('/');
			response.writeHead(
				200,
				{
					'Content-Type':'text/json;charset=utf-8',
					'Access-Control-Allow-Origin':urls[2],
					'Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS',
					'Access-Control-Allow-Headers':'Content-type',
					'Access-Control-Max-Age':1728000
				}
			);	
			// response.writeHead("Access-Control-Allow-Origin", "*");
		 //    response.writeHead('Access-Control-Allow-Headers', 'Content-type');
		 //    response.writeHead("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
		 //    response.writeHead('Access-Control-Max-Age',1728000);//预请求缓存20天
			 var post = '';
		    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
		    request.on('data', function(chunk){    
		        post += chunk;
		    });
		 
		    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		    request.on('end', function(){    
		        var query = qs.parse(post);
		        console.log(query);
				if(query['key'] != key){
					console.log(query['key']);
					response.end("{'msg':'???','status':'500'}");	
				}else{
					var Visit_options = query['body'] || {"test":"test"};
					var type = query['type'];
					var options = {
						"url" : "http://"+query['url'],
						timeout:200
					};
					switch(type){
						case "get":
						options['url'] += "?" + qs.stringify(Visit_options);
						RequestFunc.get(options,function(error,res,body){
							if(error == null){
								response.end("{'msg':'设置成功','result':"+body+",'retcode':'2000000'}");	
							}else{
								response.end("{'msg':'设置失败，与门闸机通信失败，请检测门闸状态或所填写信息','result':'','retcode':'0'}");	
							}
							console.log(error,res);
						});
						break;
						case "post":
						options['form'] = JSON.parse(Visit_options);
						options['qs'] = JSON.parse(Visit_options);
						RequestFunc.post(options,function(error,res,body){
							if(error == null){
								response.end("{'msg':'设置成功','result':"+body+",'retcode':'2000000'}");	
							}else{
								response.end("{'msg':'设置失败，与门闸机通信失败，请检测门闸状态或所填写信息','result':'','retcode':'0'}");	
							}
							console.log(error,res);
						});
						break;
						default:
							response.end("{}");
					}

				}

		    });
			break;
			default:
			console.log(111);
				response.writeHead(200,{'Content-Type':'text/json;charset=utf-8'});
				response.end("{'msg':'???','status':'500'}");

		}
	}else{
		response.end("none");
	}
}).listen(8080);
console.log('Sever As Ok! Try!');


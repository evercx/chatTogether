var express = require('express');
var hbs = require('hbs');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var onlineUsrs=[];
//监听socket连接
io.on('connection',function(socket){
	var client={
		usrname:'',
		time:'',
		msg:'',
		online:false
	}
	socket.on('registername', function (data) {
		if(!client.usrname){	//第一次连接
			if(onlineUsrs.indexOf(data)!== -1){
				socket.emit('nameerror',{msg:"昵称重复 请重试"});
			}else{
				onlineUsrs.push(data);
				client.usrname=data;
				client.msg="用户“"+client.usrname+"”上线了";
				console.log(client);
				client.time=getTime();
				client.online=true;
				//广播系统通知
				socket.broadcast.emit('system',client);
				socket.emit('system',client);
				//广播在线用户表
				//socket.broadcast.emit('users',{users:onlineUsrs});
				socket.emit('users',{users:onlineUsrs});
			}
		}
	});
	socket.on('message', function (data) {
		client.msg=data;
		client.time=getTime();
		socket.broadcast.emit('msg',client);
		socket.emit('msg',client);
	});
    socket.on('disconnect', function () {
    	if(client.usrname!==''){
			client.msg="用户“"+client.usrname+"”下线了";
			client.time=getTime();
			if(onlineUsrs.indexOf(client.usrname)>-1){
				onlineUsrs.splice(onlineUsrs.indexOf(client.usrname));//下线后取消保存该用户名
			}
			client.online=false;
			socket.broadcast.emit('system',client);
			client.usrname='';
    	}
			
    });

});

app.set('port', process.env.PORT || 30653);//设置端口号
app.set('view engine','html');
app.engine('html',hbs.__express);//设置模版引擎
app.use(express.static('public'));//指定静态文件夹为public目录

//设置中间件，运行Html上Javascript脚本进行跨域访问
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  next();
  //console.log("use");

});

app.get('/',function(req,res){
	res.render('chat');
	//res.render('index');

});
app.post('/',function(req,res){
	console.log(req.a);
	if(onlineUsrs.indexOf(req.nickname)!== -1){
		res.json({err:"昵称重复 请重试"});
	}else{
		onlineUsrs.push(req.nickname);
		console.log(req.nickname);
		console.log(onlineUsrs);
		res.sendfile('views/chatroom.html');
	}	
});


server.listen(app.get('port'),function(){
	console.log('this server is listening on port:'+app.get('port'));
});


var getTime=function(){
  var date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}
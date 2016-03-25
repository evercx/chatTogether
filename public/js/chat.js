
'use strict';
var socket = io.connect(ip);
var myName='';


// $(function(){
// 	document.onkeydown = function(e){ 
// 	    var ev = document.all ? window.event : e;
// 	    if(ev.keyCode==13) {
// 	    	$("#launch").click();
// 	     }
// 	}	
// })

$(function(){
	 showModal();

});

//提交昵称
$("#submit").click(function(){
	var nickname = $("#nickname").val();
	if(nickname!==''){
		socket.emit('registername',nickname);
		myName=nickname;
		$('#alertNickName').modal('hide');
		deleteBackFade();
	}
});



socket.on('system', function (data) {
    getSystemMsgDIV(data);
    //当用户上线了 添加到在线用户表中
    if(data.online){
		var $option='<option value= "'+data.usrname+'">'+data.usrname+'</option>'
		$('.usrlist').append($option);
    }
    //当用户下线了 从在线用户表中删除
    if(!data.online){
		
		$('option[value='+data.usrname+']').remove();
    }

});

socket.on('msg', function (data) {
	console.log(data);
    if(data.usrname===myName){
    	getMyDIV(data);
    }else{
    	getOthersDIV(data);
    }
});

socket.on('users',function(data){
	console.log(data.users);

	$('.usrlist').empty();
	$('.usrlist').append('<option   value= "title" style="font-weight:bold">在线用户：</option> ');
	for(var i in data.users){
		var $option='<option value= "'+data.users[i]+'">'+data.users[i]+'</option>'
		$('.usrlist').append($option);

	}
});


socket.on('nameerror', function (data) {
	if(data){
	    console.log(data.msg);
	    alert(data.msg);
	    showModal();
	}
});


$("#launch").click(function () {
	if($("#msg").val()!==''){
		socket.send($("#msg").val());
		$("#msg").val('');
	}
});

$("#clear").click(function(){
	$("#chatbg").empty();
});

function showModal(){
	$('#alertNickName').modal({backdrop:'static', keyboard: false});
	deleteBackFade();
}
function deleteBackFade(){
	var t=document.getElementsByClassName("modal-backdrop fade in");
	for(var i=0;i<t.length-1;i++)    
	  {  
	     t[i].parentNode.removeChild(t[i]); 
	  }
}


function getOthersDIV(json){
	var $div='';
	$div='<div class="alert alert-info others">'+json.usrname+' @ '+json.time+'：</br>'+json.msg+'</div>'
	$("#chatbg").append($div);
	document.getElementById('chatbg').scrollTop = document.getElementById('chatbg').scrollHeight;
}
function getMyDIV(json){
	console.log(json);
	var $div="";
	$div='<div class="alert alert-success me">我 @ '+json.time+'：</br>'+json.msg+'</div>';
	$("#chatbg").append($div);
	document.getElementById('chatbg').scrollTop = document.getElementById('chatbg').scrollHeight;
	//$("#chatbg").scrollTop=$("#chatbg").scrollHeight;
}

function getSystemMsgDIV(json){
	var $div="";
	//$div='<div ><p class="text-danger">'+json.msg+'</p></div>';
	$div='<option   value= "'+json.time+'">system @ '+json.time+'： '+json.msg+'</option>'
	console.log($div);
	$(".systemmsg").append($div);
}

// $("#msg").bind('keypress',function(event){
//     if(event.keyCode == "13")    
//     {
//     	$("#launch").click();
//     }
// });

//通过“回车”提交聊天信息
$("#msg").keydown(function(e) {
    if (e.keyCode === 13) {
		$("#launch").click();
    }
});


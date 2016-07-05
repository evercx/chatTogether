



$("#submit").click(function () {
	var nickname=$("#nickname").val();
	var requestData={
		nickname:nickname
	}
	console.log(JSON.stringify(requestData));
	$.ajax({
        type: 'POST',
        url: 'http://localhost:30653/',
        contentType: "application/json",
        data:JSON.stringify(requestData),
        success:function(mes){
            console.log(mes);
            if(typeof(mes.err)!=="undefined"){
                alert(mes.err);
            }else{
                window.location.reload();
            }
        }
	});
});

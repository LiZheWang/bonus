$(function(){
	FastClick.attach(document.body);  
	
	var bouns = new Bouns({
		time : 10   //游戏时间
	});
	
	// state状态 ， 初始化为0
	//0 未播放状态  1空闲状态 2.中奖 3.未中奖4.超时 5.正在转
	var bgm = new Bgm({
		//背景音乐
		sparetime : ['mp3/1.mp3','mp3/2.mp3'] ,
		yes : 'mp3/3.mp3' , //中奖
		no : 'mp3/4.mp3' , //没中奖
		timeout : 'mp3/5.mp3' ,//超时音乐
		playing : 'mp3/6.mp3' , //正在抽奖音乐
		time : 2000 , //背景音乐每隔多久换一次
		callbacks : {
			//超时回调
			timeout : function(){
				bgm.setState(1);
				alertBox("超时了") ;
			}
		}
	}) ;
	
	
	//播放背景音乐
	/*
	bgm.setState(1);
	document.addEventListener("WeixinJSBridgeReady", function () {
		bgm.setState(1);
	}, false);
	*/
	
	bouns.start();
});

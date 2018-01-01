(function(){
	var Bgm = function(options){
		return this.init(options||{});
	}
	
	function Extend(s,d){for( var p in d ){s[p] = d[p] ;} return s ;}
	
	Bgm.prototype = {
		init : function(options){
			
			this.ops = Extend({
				sparetime : [] ,
				playing: '' ,
				timeout : '' ,
				yes : '' ,
				no : '' ,
				time : 2000 ,
				
				callbacks : {
					timeout : null ,
				}
				
			},options) ;
			var _this = this ;
			//0 未播放状态  1空闲状态 2.中奖 3.未中奖4.超时 5.正在转
			this.state = 0 ;
			
			//超时定时器
			this.timeoutr = null ;
			//空闲播放定时器
			this.playTimer = null ;
			this.playIndex = 0 ;
			
			
			this.audioElem = document.createElement("audio");
			this.audioElem.addEventListener("ended",function(){
				_this.stopPlaytime() ;
				if( _this.state == 1 ){
					
					_this.playTimer = setTimeout(function(){
						var max = _this.ops.sparetime.length  ;
						_this.playIndex++ ;
						if( _this.playIndex >= max ){
							_this.playIndex = 0 ;
						}
						_this.playBgm();	
					},_this.ops.time);
				}
				if( _this.state == 4 ){
					if( typeof _this.ops.callbacks.timeout == "function" ){
						_this.ops.callbacks.timeout();
					}
				}
			});
			
			
			return this ;
		},
		play : function(url){
			if( url ){
				this.stop() ;
				this.audioElem.src = url ;
				this.audioElem.play();
			}
		},
		stop : function(){
			this.audioElem.currentTime = 0 ;
			this.audioElem.pause();
		},
		setState:function(state){
			this.state = state ;
			switch (this.state){
				case 1 :
					this.playIndex = 0 ;
					this.playBgm() ;
					break;
				case 2 :
					this.play(this.ops.yes);
					break;
				case 3 :
					this.play(this.ops.no);
					break;
				case 4 :
					this.stopTimeout();
					this.stopPlaytime();
					this.play(this.ops.timeout);
					break;
				case 5 :
					this.play(this.ops.playing);
					break;
				default:
					break;
			}
		},
		
		playBgm:function(){
			var url = this.ops.sparetime.length ? this.ops.sparetime[this.playIndex] : null ;
			url && this.play(url);
		},
		
		//开始计时
		initTimeout:function(time){
			time = time || 15 ;
			var _this = this ;
			var currentTime = 0 ;
			this.stopTimeout() ;
			this.stopPlaytime();
			this.timeoutr = setInterval(function(){
				currentTime++ ;
				if( currentTime >= time){
					_this.setState(4);
				}
			},1000) ;
		},
		stopTimeout : function(){
			clearInterval(this.timeoutr);
			this.timeoutr = null ;
		},
		stopPlaytime : function(){
			clearTimeout(this.playTimer) ;
			this.playTimer = null ;
		}
		
		
	}
	
	
	window.Bgm = Bgm ;
	
})();

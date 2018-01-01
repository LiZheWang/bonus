(function(){
	var Bouns = function(options){
		return this._init(options||{});
	}
	
	Bouns.prototype = {
		_init : function(options){
			this.ops = $.extend({
				unit : '元' ,
				min:1 ,
				max:3 ,
				elem : 'body' ,
				time : 30 , //单位秒
				intervalTime : 400 ,
				readyTime : 5 ,  //单位秒
				timeout : null ,
			},options);
			
			
			this.money = 0 ;
			this.timer = null ;
			this.timeoutTimer = null ;
			this.readyTimer = null ;
			
			
			this._bindEvent();
			
			return this ;
		},
		
		
		_createText : function(){
			$(this.ops.elem).append('<div id="bonus_show" class="showTxt bonus_show"><span>+</span><span class="bonus_price"></span><span class="bonus_unit">'+this.ops.unit+'</span></div>');
			this.bonus_show = $(".bonus_show").last() ;
			this.bonus_price = $(".bonus_price").last() ;
			this.bonus_unit = $(".bonus_price").last() ;
		},
		_textShow : function(x,y){
			this._createText() ;
			var _this = this ;
			var price = this._getRandom();
			this.money += price * 100000 ;
			this.bonus_price.text(price);
			this.bonus_show.css({left : x ,top:y}).addClass("on") ;
		},
		
		_bindEvent : function(){
			var _this = this ;
			$(this.ops.elem).on("touchmove",function(e){
				e.preventDefault() ;
				e.stopPropagation() ;
			});
			$("body").on("click",".bonusList",function(e){
				var offset = $(this).offset() ;
				_this._textShow(offset.left,offset.top);
				$(this).remove();
			});
		},
		
		
		_getRandom : function(){
			var random = Math.random() ;
			random == 0 ? 1 : random ;//如果随机数是0   运气爆棚，直接给个最大奖
			var val = random * this.ops.max ;
			val = val.toFixed(1) ;
			return parseFloat(val) ;
		},
		
		
		_createItems : function(){
			var _this = this ;
			var left = $(window).width() * Math.random() - 60;
			left = left<0 ? 0 : left > 750 ? 750 : left ;
			var angle = Math.random() * 90 - 45 ;
			var scale = (Math.random()*40 + 60) / 100 ;
			scale = scale.toFixed(1) ;
			var transformStyle = "-webkit-transform:rotate("+angle+"deg) scale("+scale+");" ;
				transformStyle +="transform:rotate("+angle+"deg) scale("+scale+");";
			var itemHtml = '<a class="bonusList" style="left:'+left+'px;  '+transformStyle+'"  href="javascript:;" ></a>' ;
			$(this.ops.elem).append(itemHtml);
			setTimeout(function(){
				$(_this.ops.elem).find(".bonusList").last().addClass("down");
			},50);
		},
		
		getMoney:function(){
			return this.money / 100000 ;
		},
		
		stop : function(){
			clearTimeout(this.timer) ;
			this.timer = null ;
			$(this.ops.elem).find(".bonusList").remove();
			if(this.timeoutBox ) this.timeoutBox.remove();
			clearInterval(this.timeoutTimer) ;
			this.timeoutTimer = null ;
		},
		
		_createTimeout:function(){
			var html = '<div class="timeoutBox" id="timeoutBox"></div>' ;
			$(this.ops.elem).append(html);
			this.timeoutBox = $("#timeoutBox") ;
		},
		
		showSuccess :function(){
			var _this = this ;
			var result = this.getMoney() + this.ops.unit;
			var html =  '<div class="createAlertInfo" id="createAlertInfo">'+
							'<div class="con">'+
								'<img src="img/gx.png" />'+
								'<p>恭喜获得：'+result+'</p>'+
								'<a href="javascript:;" id="closeShow">关闭</a>'+
							'</div>'+
						'</div>';
			$(this.ops.elem).append(html);
			this.createAlertInfo = $("#createAlertInfo") ;
			setTimeout(function(){_this.createAlertInfo.find(".con").addClass("on");},10);
			$("#closeShow").on("click",function(){
				_this.hideSuccess();
			});
		},
		
		hideSuccess :function(){
			var _this = this ;
			this.createAlertInfo.find(".con").removeClass("on");
			setTimeout(function(){_this.createAlertInfo.remove();},300);
		},
		
		
		start : function(){
			var _this = this ;
			var spans = [] ;
			for( var i=this.ops.readyTime;i>=0;i-- ){
				var txt = i ;
				if( i == 0 ){txt = "GO!"}
				spans.push('<span class="readyTimeSpan">'+txt+'</span>');
			}
			
			var html =  '<div class="readyTimeBox" id="readyTimeBox">'+
							spans.join("")+
						'</div>';
			$(this.ops.elem).append(html);
			this.readyTimeBox = $("#readyTimeBox") ;
			this.readyTimeSpans = $(".readyTimeSpan") ;
			
			
			function showText(){
				_this.readyTimeSpans.removeClass("on").removeAttr("style");
				var current = _this.readyTimeSpans.eq(timeIndex) ;
				current.css({
					webkitTransition : '0.3s' ,
					transition:"0.3s"
				})
				setTimeout(function(){current.addClass("on");},10);
			}
			var initTime = 0 , max = this.ops.readyTime*1000 , timeIndex = 0;
			showText();
			this.readyTimer = setInterval(function(){
				initTime += 1000 ;
				timeIndex++ ;
				showText();
				if( initTime >= max ){
					clearInterval(_this.readyTimer);
					_this.readyTimer = null ;
					setTimeout(function(){
						_this.readyTimeBox.remove() ;
						_this.play();
					},1000);
				}
			},1000);
			
		},
		play : function(){
			this.stop();
			var _this = this ;
			function move(){
				_this._createItems();
				_this.timer = setTimeout(move,_this.ops.intervalTime);
			}
			move();
			
			var currentTime = 0 ;
			var maxTime = _this.ops.time*1000 ;
			_this._createTimeout();
			setTimeout(function(){timeoutStart();},5)
			function timeoutStart(){
				currentTime += 1000 ;
				if( currentTime > maxTime ){
					_this.stop();
					_this.showSuccess();
					$(_this.timeoutBox).css({left:"100%"});
					_this.ops.timeout && _this.ops.timeout();
				}else{
					var scale = Math.floor(currentTime / maxTime * 100) ;
					$(_this.timeoutBox).css({left:scale+"%"});
				}
			}
			this.timeoutTimer = setInterval(timeoutStart,1000);
		},
		
	}
	
	window.Bouns = Bouns ;
})();

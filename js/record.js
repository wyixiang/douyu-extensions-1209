function recordAssitant() {
	var colorObj = {
		white: '#e0e0e0',
		brown: '#DEB887',
		yellow: '#ffd700',
		red: '#FF2500',
		orange: '#FFA500',
		green: '#86e495',
		blue: '#00cfff',
		violet: '#ff82ff',
		pink: '#FF8080',
        pink2: '#ff69b4',
		beige: '#F5F5DC'
	};
    var nobleColor = {
        '伯爵': 'rgba(30,135,240,.4)',
        '公爵': 'rgba(155,57,244,.4)',
        '国王': 'rgba(255,0,0,.4)',
        '皇帝': 'rgba(255,127,0,.4)'
    }
    var levelColor = {
        '1': 'rgb(236,191,131)',
        '15': 'rgb(143,230,158)',
        '30': 'rgb(105,215,248)',
        '40': 'rgb(92,150,238)',
        '50': 'rgb(132,123,253)',
        '60': 'rgb(160,100,250)',
        '70': 'rgb(182,63,217)',
        '80': 'rgb(245,41,142)',
        '90': 'rgb(232,22,40)',
        '100': 'rgb(255,32,9)',
        '110': 'rgb(255,114,0)',
        '120': 'rgb(255,204,2)'
    }
	var recordLevel = '45';
	
	var specialID = [];

	var roomid = $("link[rel=canonical]").attr("href").split('/')[3];
	
	function domInit() {
		
		var $recordBox = $('<div id="gift_record" class="record_box"></div>')
						.appendTo('#js-room-video');
		$('<div class="record_div"><ul class="nav nav-tabs"><li role="presentation" class="active"><a href="#danmu_tab" aria-controls="danmu_tab" role="tab" data-toggle="tab">弹幕</a></li><li role="presentation"><a href="#gift_tab" aria-controls="gift_tab" role="tab" data-toggle="tab">礼物</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane active" id="danmu_tab"></div><div role="tabpanel" class="tab-pane" id="gift_tab"></div></div></div>').appendTo($recordBox);
		$('<a href="javascript:;"></a>')
		.addClass('record_btn')
		.css('background-image','url('+ chrome.extension.getURL("../res/btn.png") +')')
		.appendTo($recordBox)
		.on('click', function (e) {			
			var $record = $('#gift_record>.record_div');
			if($record.hasClass('div_open')){
				$record.removeClass('div_open');
				$record.next('.record_btn').removeClass('btn_open');
			}else{
				$record.addClass('div_open');
				$record.next('.record_btn').addClass('btn_open');
			}
		});
		$('#gift_record>.record_div>ul a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        });

	}

	function giftRecord() {
        var colorObj = {
            white: '#e0e0e0',
            brown: '#DEB887',
            yellow: '#ffd700',
            red: '#FF2500',
            orange: '#FFA500',
            green: '#86e495',
            blue: '#00cfff',
            violet: '#ff82ff',
            pink: '#FF8080',
            pink2: '#ff69b4',
            beige: '#F5F5DC'
        };
        var specialID = $('body').attr('specialID') ? $('body').attr('specialID').split(',') : [];
		var lastGift = '';
        var roomGift = [];
		$('#gift-content>.g-list .gift-item').each(function( index ) {
			var $gift = $(this);
            var giftInfo = {
                id:$gift.data('giftid'),
                name:$gift.data('giftname'),
                devote:$gift.data('devote')
            };
            roomGift.push(giftInfo);
            console.log( giftInfo.id, giftInfo.name, giftInfo.devote );
		});        
		var giftbatterObserver = document.querySelector('#js-chat-cont>.giftbatter-box');
		if(giftbatterObserver) {
		if(specialID.length)
			$(giftbatterObserver).css('opacity', '.6');
		new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {					
				if( mutation.addedNodes !== null ) {
				var $target = $(mutation.target);
				var isBox = $target.hasClass( "giftbatter-box" );
				var nStr = '';
                var sStr = '';
				var gift = '';
				var user = '';
				var giftDevote = 0;
                var giftId = 0;
                var isNoble = false;
				mutation.addedNodes.forEach(function(e) {
                    if(!isBox && !$(e).parent().hasClass('multiple-nums'))
                        return;
					var $node = isBox ? $(e) : $target.parents('.normal-gift-banner').first();                    
                    if($node.hasClass('noble-banner-item')){
                        isNoble = true;
                        user = $node.find('span.item-name-inner').text();
                        nStr = $node.find('span.item-action').text();
                        gift = $node.find('span.noble-name').text();
                    } else if($node.hasClass('normal-gift-banner')) {
						giftId = parseInt($node.attr('id').split("-").pop());
                        user = $node.find('.gift-banner-info>h4').text();                        
                        $node.find('.multiple-num-s>.multiple-nums>span').each(function () {
                            sStr += $(this).attr('class').slice(-1);
                        });
                        gift = sStr + $node.find('.gift-banner-info>p>span').text();
                        if(isBox) {                            
                            $node.find('.multiple-num-l>.multiple-nums>span').each(function () {
                                nStr += $(this).attr('class').slice(-1);
                            });                            
                        } else {
                            nStr += $(e).attr('class').slice(-1);
                        }
                        
                        giftDevote = $node.hasClass('big-gift-banner') ? 999 : 1;                        
                        
                        var i = roomGift.length;
                        while(i--){
                            if(roomGift[i].id===giftId){
                                giftDevote = sStr ? roomGift[i].devote*parseInt(sStr) : roomGift[i].devote;
                                break;
                            }
                        }
                                               						
                    }
				});
				//console.log('user='+user, 'nStr='+nStr, 'gift='+gift, 'giftDevote='+giftDevote);
                var giftStr = user + nStr + gift;
                if(nStr && giftStr !== lastGift){
                    lastGift = giftStr;
                    if(isNoble){
                        var now = new Date();
                        $('<div>['+now.toLocaleTimeString()+']<span>'+user+'</span>'+nStr+'<span>'+gift+'</span></div>')
                        .addClass('record_li')
                        .prependTo($('#gift_tab'));
                    } else if( giftDevote >= 300 ) {
						var now = new Date();
						var $recordLi=$('<div>['+now.toLocaleTimeString()+']<span>'+user+'</span>送出<span>'+nStr+'</span>发</div>')
							.addClass('record_li')
                            .prependTo($('#gift_tab'));												
						var giftColor = colorObj.brown;
                        if(giftDevote >= 10000){
                            giftColor = colorObj.red;
                        } else if(giftDevote >= 3000) {
                            giftColor = colorObj.pink;
                        } else if(giftDevote >= 1000) {
                            giftColor = colorObj.violet;
                        } else if(giftDevote >= 100) {
                            giftColor = colorObj.blue;
                        } else if(giftDevote >= 10) {
                            giftColor = colorObj.green;
                        }						
						$('<span>'+gift+'</span>').css('color',giftColor).appendTo($recordLi);
						if(specialID.indexOf(user)>=0)
							$recordLi.find('span').first().css('color',colorObj.violet);
                    }
                }					
                }
            });
		}).observe(giftbatterObserver, {
			childList : true,
			subtree : true
		});
		}		
        
		new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {				
				if (mutation.addedNodes !== null) {
					mutation.addedNodes.forEach(function (e) {
						$node = $(e);
						if($node.hasClass('giftbatter-noble-notify')){
							//console.log($(e).html());
                            var names = $node.find('.nick-new')
                            var sendername = names.first().text();                            
                            var roomname = names.length > 1 ? names.eq(1).text() : "";
                            var receivername = names.length > 2 ? names.eq(2).text() : "";
                            var desc = "";
                            if(roomname){                                
                                if(roomname !== $ROOM.owner_name)
                                    desc += "在"+roomname+"直播间";
                                if(receivername)
                                    desc += '给<span>'+receivername+'</span>';
                            }
                            var now = new Date();
                            $('<div>['+now.toLocaleTimeString()+']<span>'+sendername+'</span>'+desc+$node.find('.open-noble-desc').last().text().slice(0,3) +'<span>'+$node.find('.noble-name').text()+'</span></div>')
								.addClass('record_li')
                                .prependTo($('#gift_tab'));															
						}else if(specialID.length){
							$node.css('opacity', '.6');
						}/*
                        else if(!$node.hasClass('sharkbaby-enternotice') && !$node.hasClass('gift-bigPlane') && !$node.hasClass('gift-frog') && !$node.hasClass('gift-box-2000')){
							console.log(e);
						}*/
					});
				}
			});
		}).observe(document.querySelector('#js-chat-cont'), {
			childList : true
		});

        var nobleOpen = document.querySelector('#js-chat-cont>.noble-open-animation');
        if(nobleOpen){
		new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {				
				if (mutation.addedNodes !== null) {
				mutation.addedNodes.forEach(function (e) {
                    console.log(e);
                });
				}
			});
		}).observe(nobleOpen, {
			childList : true
		});        
        }
        
        
        
        var $chatContWrap = $('#js-chat-cont [data-type="chat-cont"]');        
        $chatContWrap.on("scroll", function (e) {
            var scrollTop = $chatContWrap[0].scrollTop;
            var scrollHeight = $chatContWrap[0].scrollHeight;
            var charHeight = $chatContWrap.height();            
            if(scrollHeight-scrollTop > charHeight){
            //console.log('scrollHeight='+scrollHeight,'scrollTop='+scrollTop,scrollHeight-scrollTop);
                if($('#js-chat-cont [data-type="chat-cls"]').hasClass('hide')){
                    $chatContWrap.scrollTop(scrollHeight)
                }
            }
		});
        
		if(specialID.length)
			$('#js-chat-cont>.giftbatter-noble-enter').css('opacity', '.6');
		new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				var newNodes = mutation.addedNodes;
				newNodes &&	newNodes.forEach(function (e) {
					//console.log($(e).html());
                    var nameStr = $(e).find('h2').first().text();
                    if(specialID.indexOf(nameStr)>=0){
						var now = new Date();
						var $rec = $('<div>['+now.toLocaleTimeString()+']<span>'+nameStr+'</span>来到本直播间</div>')
									.addClass('record_li')
                                    .prependTo($('#danmu_tab'));												
						$rec.find('span').css('color',colorObj.violet);
					}
					$(e).find('object').remove();
				});				
			});
		}).observe(document.querySelector('#js-chat-cont>.giftbatter-noble-enter'), {
			childList : true
		});    
	}
	
	function danmuRecord() {

		var danmuObserver = new MutationObserver(function (mutations) {
				
			mutations.forEach(function (mutation) {
				var newNodes = mutation.addedNodes; // DOM NodeList
				if (newNodes !== null) { // If there are new nodes added
					var $nodes = $(newNodes); // jQuery set
					$nodes.each(function () {
						var $li = $(this);
						if($li.hasClass('hy-chat')){
							var $li = $(this);
							var $danmuText = $li.find('span').last();
							var role = $li.find('.icon-role').first();//房管
							var noble = $li.hasClass('noble-chart');//贵族
							var female = $li.hasClass('girl-chart');//小姐姐
							var chartli = $li.hasClass('chartli');	//记录了半天，全是false，不知道是啥							
							var level = $li.data('level');
							var fans = $li.find('.chat-icon-pad').data('fans');
							var fanslevel = $li.find('.fans-badge-icon').data('uiLevel');
							var position = noble ? 2 : 0;
							var textHtml = $danmuText.html();
							var chatid = $danmuText.attr('chatid');//看起来是弹幕的唯一识别号
							var danmuColor = $danmuText.attr('style') ? 'rgba(' + $danmuText.css('color').split('(')[1].split(')')[0] + ',.6)' : false;
							var danmuBlock = false;
							//console.log('role='+role.length+role);
							if(danmuColor)
								position = 1;								

							var $name = false;
							var superAdmin = false;
							var isAnchor = false;	
							if (role.length) {
								var gifSrc = role.first().attr('src');
								if(gifSrc.indexOf("super_admin.")!=-1){
									nameColor = colorObj.red;
									superAdmin = true;
								}else if(gifSrc.indexOf("anchor.")!=-1){										
									isAnchor = true;										
									position = 2;
								}else{
									nameColor = colorObj.orange;
								}									
							} else if (level >= 15) {
								if (level < 30) {										
									//if(danmuCount < midLevelFilter)											
										nameColor = colorObj.green;
								} else if (level < 50) {										
									//if(danmuCount < highLevelFilter)
										nameColor = colorObj.blue;
								} else if (level < 80) {
									nameColor = colorObj.violet;
								} else {
									nameColor = colorObj.pink;
								}
							} 
							
							$name = $li.find('.name');
							var nameStr = $name.text();
							var isSpecial = specialID.indexOf(nameStr.slice(0,-1))>=0 ? true : false;                                    
							if(isSpecial || superAdmin || level>=parseInt(recordLevel) || noble || role.length || (fans===roomid&&fanslevel>=23)){
								var now = new Date();
								var nobleTitle = $li.find('.user-noble>img').attr('title');
								var nobleBg = nobleTitle && nobleColor[nobleTitle.slice(0,2)];
								var $rec = $('<div>['+now.toLocaleTimeString()+']<strong>['+level+']</strong><span>'+nameStr+'</span>'+textHtml+'</div>')
											.addClass('record_li')
											.prependTo($('#danmu_tab'));
								$rec.find('strong').css('color',levelColor[level<15?1:(level<30?15:Math.floor(level/10)*10)]);
								nobleBg && $rec.find('span').css('background-color',nobleBg);
								if(superAdmin){
									$rec.find('span').css('color',colorObj.red);
								}else if(isSpecial){
									//$rec.find('span').css('color','#f83fa5');
									$rec.find('span').css('color',colorObj.violet);
								}else if(isAnchor){                                            
									$rec.find('span').css('color',colorObj.pink);
								}else if(!role.length){
									$rec.find('span').css('color',colorObj.brown);
								}
							}
							
						} 
					});
				}
			});
		}).observe(document.querySelector('#js-chat-cont>.chat-cont-wrap>.c-list'), {
			childList : true
		});
	}
    
    function mainTask() {
		domInit();
        giftRecord();		
		danmuRecord();      
    }
    
	function flashReady() {
        //if ($('#anchor-info>.btn-group>.focus-box>.focus-box-con>.r-num>span').text().length>0 && $('#js-fans-rank .vip>span>em').text().length>0) {
        if ($('#gift-content>.g-list .gift-item').length>0) {            
            setTimeout(mainTask, 100);
		} else {            
			setTimeout(flashReady, 100);
		}
	}
    
	flashReady();
	
}

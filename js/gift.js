function AutoGift() {

	var gift_panel = document.querySelector('#gift-content>.g-list>.gift-info-panel>.gift-info-panel-cont');
	if(gift_panel){
		new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.addedNodes !== null) {
				mutation.addedNodes.forEach(function(e){
					var $e = $(e);
					//礼物区
					if($(e).hasClass('gift-not-batch')){
						var giftName = $e.find('strong').text();
						var $giftDiv = $('<div />').addClass('form-inline').css('margin-bottom','10px').insertAfter($e);
						$('<input />').attr({
							'class': 'form-control',
							id: 'giftInput',
							type: 'text',
							maxlength: '4',
							placeholder: '赠送'+giftName+'次数'
						}).css({
							'width': '65%',
							'height': '20px',
							'margin-left': '15px'
						}).numeric({negative: false}).appendTo($giftDiv);
						$('<button type="button">赠送</button>')
						.addClass('btn btn-warning')
						.css('margin-left','10px')
						.appendTo($giftDiv)
						.on('click', function (e) {
							var count = parseInt($('#giftInput').val());
							if(count){								
								function send_gift(){
									count--;
									if(count>=0){										
										$("#gift-content>.g-list").find(".gift-item[data-giftname='"+giftName+"']>.g-img").first().click();
										setTimeout(send_gift,300);
									}
								}
								send_gift();
							}
						});
						//}
					}
				});
				}
			});
		}).observe(gift_panel, {
			childList : true
		});
	}
	var mouseItemIndex = 0;
	var itemBag = document.querySelector('#js-stats-and-actions>.uinfo-ywyc>.backpack');
	if(itemBag){
		new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.addedNodes !== null) {
					mutation.addedNodes.forEach(addItemSendEvent);
				}
			});
		}).observe(itemBag, {
			childList : true
		});
	}        
	function addItemSendEvent(element){
		var $element = $(element);
		if($element.hasClass('prop-wrap')){          
			$element.find('.prop.effect').on("mouseenter", function() {                    
				mouseItemIndex = $(this).attr('data-index');
				//console.log('mouseItemIndex='+mouseItemIndex);
			});                
		}else if($element.hasClass('prop-info-panel')){
			new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.addedNodes !== null) {
						mutation.addedNodes.forEach(addItemSendDom);
					}
				});
			}).observe(element, {
				childList : true
			});                
		}
	}
	function addItemSendDom(e){
		var itemName = $(e).find('.name').text().trim();
		var itemCount = $(e).find('.prop-count').text();
		//背包区
		if(itemCount > 9){
			var $giftDiv = $('<div />').addClass('form-inline').css('margin-bottom','10px').appendTo(e);
			$('<input />').attr({
				'class': 'form-control',
				id: 'itemInput',
				type: 'text',
				maxlength: '4',
				placeholder: '赠送'+itemName+'次数'
			}).css({
				'width': '65%',
				'height': '20px',
				'margin-left': '15px'
			}).numeric({negative: false}).appendTo($giftDiv);
			$('<button type="button">赠送</button>')
			.addClass('btn btn-warning')
			.css('margin-left','10px')
			.appendTo($giftDiv)
			.on('click', function (e) {                
							
				var count = parseInt($('#itemInput').val());
				if(count){
					var itemIndex = mouseItemIndex;
					function send_item(){
						//console.log('itemIndex='+itemIndex);
						count--;
						if(count>=0){										
							var $itme = $(itemBag).find('.prop-page>[data-index="'+itemIndex+'"]');
							if($(itemBag).css('display')==='block' && $itme.length===1 && $itme.find('span').text() !== '')
								$itme.find('img').click();
							setTimeout(send_item,300);
						}
					}
					send_item();
				}
			});  
		}
	}       
	
}

function flashReady() {
	if ($('#gift-content>.g-list .gift-item').length>0) {            
		setTimeout(AutoGift, 100);
	} else {            
		setTimeout(flashReady, 100);
	}
}

//if (switchStates.AutoGiveGift)
	//flashReady();
//console.log('switchStates.AutoGiveGift='+switchStates.AutoGiveGift);


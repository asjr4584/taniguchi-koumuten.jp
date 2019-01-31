$(function() {

	$("a.swipebox img").each(function(){
		var ttl = $(this).attr("title");
		$(this).parent("a").attr("title", ttl);
	});

	$("#contents").attr("class", $("#contents").attr("class").replace(".html", ""));

	$("nav#spNav").mmenu({
		classes: 'mm-light',
//		slidingSubmenus: false,
		extensions: [
			"pagedim-black"
		],
		offCanvas: {
			position : 'right', //left(デフォルト)・right・top・bottom
			zposition : 'front' //back(デフォルト)・front・next
		}
	});

/* レスポンシブ画像切り替え */
	var $setElem = $(".rpImg"),
	pcName = "_pc",
	spName = "_sp",
	brPoint = 750;
 
	$setElem.each(function(){
		var $this = $(this);
		function imgSize(){
			var ww = parseInt($(window).width());
			if(ww > brPoint) {
				$this.attr("src",$this.attr("src").replace(spName,pcName));
			} else if(ww <= brPoint) {
				$this.attr("src",$this.attr("src").replace(pcName,spName));
			}
		}
		imgSize();
		$(window).resize(function(){imgSize();});
	});


/* matchMedia JS切り替え */
	var opacity_level = "";
	if (window.matchMedia('screen and (max-width:750px)').matches) { 
		opacity_level = 1;
	}else{
		opacity_level = 0.7;
	}
	$('.light').hover(
		function() {
			$(this).css({
				opacity: opacity_level,
				filter: 'alpha(opacity=' + opacity_level * 100 + ')'
			});
		},
		function() {
			$(this).css({
				opacity: 1,
				filter: 'alpha(opacity=100)'
			});
		}
	);

  $("#head .tel span,.contactBox .tel span,#foot .tel,.telNum").click(function(){
    if(spTel()){
      window.location.href = $(this).attr("data-tel");
    }
  });
	
	wResize();
});

$(window).on("resize", function(){
	wResize();
});

$(function(){
	$(".swipebox").swipebox({
		'removeBarsOnMobile': false
	});

	$(".unitSld").slick({
		infinite:false,
		fade: true,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		draggable:false,
		centerMode:true,
		touchMove:false,
		adaptiveHeight:true,
		asNavFor: ".unitSldNav",
		responsive:[{
			breakpoint:750,
			settings:{
				adaptiveHeight:true,
				respondTo:"slider"
				
			}
		}]
	});
	$(".unitSldNav").slick({
		infinite:false,
		slidesToShow: 5,
		slidesToScroll: 1,
//		appendArrows:$(".unitSldNav"),
//		centerMode:true,
//		centerPadding: '60px',
		asNavFor: ".unitSld",
		focusOnSelect: true,
		responsive:[{
			breakpoint:750,
			settings:{
				slidesToShow: 3,
				
			}
		}]
	});


});

function wResize() {
	if (window.matchMedia('screen and (max-width:750px)').matches) { 
		$(".fNav .rCol").each(function(){
			$(this).removeAttr("style");
		});
		$(".unitSldNav .slick-slide").height($(".unitSldNav .slick-slide").width());
	}else{
		var colH = $(".fNav li").outerHeight(true);
		$(".fNav .rCol").each(function(index){
			$(this).css("margin-top", colH * (index - ($(".fNav .rCol").length + 1)));
		});
	}
}
function spTel(){
  return ($(window).width() < 750);
}

$(window).on("load", function(){
	var sl = ".unitSldNav .slick-slide img";
	$(sl).each(function(){
		var w = $(this).width();
		var h = $(this).height();
		if (w < h) {
//			$(this).css({"width":"125px","height":"auto"});
			$(this).addClass("portrait");
		}
	});
});


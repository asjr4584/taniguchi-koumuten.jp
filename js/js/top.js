
$(function(){
	var rotation = function (){
		$(this).rotate({
			angle:0,
			animateTo:360,
			duration: 4000,
			center: ["50%", "50%"],
			callback: rotation,
			easing: function (x,t,b,c,d){// t: current time, b: begInnIng value, c: change In value, d: duration
				return c*(t/d)+b;
			}
		});
	};
	$(".ttlBox .bg").each(rotation);

	$(".mainSld").slick({
		infinite: true,
		dots: false,
		draggable:false,
		fade:true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [{
			breakpoint: 750,
			settings: {
				centerMode: false,
				draggable:true,
			}
		}]
	});

	$(".serviceBlk .lnkWrap").slick({
		dots: false,
		infinite: false,
		speed: 300,
		appendArrows:$(".sldWrap"),
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [{
			breakpoint: 750,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}]
	});

	$('.spSlide .lnkWrap').slick({
		slide:"li",
		responsive: [{
			breakpoint: 750,
			settings: {
				slide:"div",
				accessibility: false,
				dots: true,
				arrows: false,
				infinite: false,
				centerMode: true,
				centerPadding: "9%",
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}]
	});

//	var maxHeight = 0;
//	$(".entBox .lnkBox a").each(function(){
//		if($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//	});
//	$(".entBox .lnkBox").height(maxHeight);
	
	wr();
});

$(window).on("load", function(){
	var maxHeight = 0;
	$(".entBox .lnkBox a").each(function(){
		if($(this).height() > maxHeight) { maxHeight = $(this).height(); }
	});
	$(".entBox .lnkBox a").height(maxHeight);
});

$(window).on("resize", function(){
	wr();
});

function wr() {
	var bgH = $(".ttlBox .bg img").height();
	var lnkImgW = $(".entryBlk .lnkBtn .img").width();
	var blgImgW = $(".entBox .lnkBox .img").width();
	if (window.matchMedia('screen and (max-width:750px)').matches) { 
		$(".ttlBox, .ttlBox .bg").height(bgH);
		$(".entryBlk .lnkBtn .img").height(lnkImgW * 300 / 530);
		$(".entBox .lnkBox .img").height(blgImgW * 140 / 225);
	}else{
		$(".ttlBox, .ttlBox .bg").height(bgH);
		$(".entryBlk .lnkBtn .img").height(200);
		$(".entBox .lnkBox .img").height(140);
	}
}


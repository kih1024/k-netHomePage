$(function(){
	var menuA = $('.menu>li>a');
	var ul = $('.menu>li>ul');
	menuA.on("mouseenter focus",function(){
		if(menuA.target){
			$(menuA.target).next().hide();
			$(this).next().show();
		}else{
			$(this).next().show();
		}
		menuA.target=this;		
	});
	menuA.mouseleave(function(){
		$(this).next().hide();
	});
	ul.hover(function(){
		$(this).show();
	},function(){
		$(this).hide();
	});
});
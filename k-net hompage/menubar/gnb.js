$(function(){
	var gnbA = $('#gnb>li>a');
	var ul = $('#gnb>li>ul');
	gnbA.on("mouseenter focus",function(){
		if(gnbA.target){
			$(gnbA.target).next().hide();
			$(this).next().show();
		}else{
			$(this).next().show();
		}
		gnbA.target=this;		
	});
	gnbA.mouseleave(function(){
		$(this).next().hide();
	});
	ul.hover(function(){
		$(this).show();
	},function(){
		$(this).hide();
	});
});
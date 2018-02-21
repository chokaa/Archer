var kanvas;
var max_size = 50;
var min_size = 3;

var c = document.querySelector('canvas');

c.width = window.innerWidth;
c.height = window.innerHeight;

kanvas = c.getContext('2d');

var krugovi=[];

var init = function(){

	for(let i=0;i<500;i++){



		let poluprecnik = Math.random()*20;

		let x = Math.random()*(window.innerWidth-2*poluprecnik) + poluprecnik;

		let y = Math.random()*(window.innerHeight-2*poluprecnik) + poluprecnik;

		var krug = new Krug(x,y,poluprecnik,Math.random()*2,Math.random()*2);

		krug.draw();

		krugovi.push(krug);
	}
}
init();
animate();


window.onresize= function(){
	krugovi.length=0;
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	init();

};
function animate(){
	
	requestAnimationFrame(animate);

	kanvas.clearRect(0,0,innerWidth,innerHeight);

	krugovi.forEach(function(element){
		element.update();
	})
	
}

window.addEventListener('mousemove',function(event){

	krugovi.forEach(function(element){
		if(( event.x-element.x < 50 &&  event.x-element.x > -50) && element.poluprecnik < max_size && ( event.y-element.y < 50 && event.y-element.y > -50) )
			element.poluprecnik+=1;
		else if( element.poluprecnik > element.min_radius && element.poluprecnik>=1)
			element.poluprecnik-=1;

		if(( event.x-element.x < 50 &&  event.x-element.x > -50) && element.poluprecnik < max_size && ( event.y-element.y < 50 && event.y-element.y > -50) )
			element.poluprecnik+=1;
		else if( element.poluprecnik > element.min_radius && element.poluprecnik>=1)
			element.poluprecnik-=1;
	})

});



function Krug(x,y,poluprecnik,dx,dy){
	this.x=x;
	this.y=y;
	this.dx=dx;
	this.dy=dy;
	this.poluprecnik = poluprecnik;
	this.min_radius = poluprecnik;
	this.red = Math.floor(Math.random()*256);
	this.green = Math.floor(Math.random()*256);
	this.blue = Math.floor(Math.random()*256);
	this.draw = function(){

		kanvas.beginPath();
		kanvas.arc(this.x,this.y,this.poluprecnik,0,Math.PI*2,false);
		kanvas.strokeStyle = 'rgb('+this.red.toString()+','+this.green.toString()+','+this.blue.toString()+')';
		kanvas.fillStyle = 'rgb('+this.red.toString()+','+this.green.toString()+','+this.blue.toString()+')';
		kanvas.fill();
		kanvas.stroke();
	}
	this.update = function(){

		if( this.x + this.poluprecnik >= c.width || this.x - this.poluprecnik <= 0 )
			this.dx=this.dx*(-1);
		if( this.y+ this.poluprecnik >= c.height || this.y - this.poluprecnik <= 0 )
			this.dy=this.dy*(-1);

		this.x+=this.dx;
		this.y+=this.dy;

		this.draw();

	}
}
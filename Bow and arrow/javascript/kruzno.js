var kanvas;

var c = document.querySelector('canvas');

c.width = window.innerWidth;
c.height = window.innerHeight;

kanvas = c.getContext('2d');

var tacke=[];
var x_pocetno = (window.innerWidth/2);
var y_pocetno = (window.innerHeight/2);

window.addEventListener('mousemove',function(event){
	x_pocetno=event.clientX;
	y_pocetno=event.clientY;
})
window.onresize= function(){
	krugovi.length=0;
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	init();
	animate();

};
window.o

var init = function(){

	for(let i = 0 ; i < 35 ; i++ ){

		const sirina = Math.random()*2 + 1;

		let x = (window.innerWidth/2);//Math.random()*(window.innerWidth-2*poluprecnik) + poluprecnik;

		let y = (window.innerHeight/2);//Math.random()*(window.innerHeight-2*poluprecnik) + poluprecnik;

		
		var tacka = new Tacke(x,y,Math.random()*Math.PI*2,sirina);


		tacke.push(tacka);
	}
		
}
function animate(){
	
	requestAnimationFrame(animate);

	//kanvas.clearRect(0,0,innerWidth,innerHeight);

	kanvas.fillStyle='rgba(255,255,255,0.05';
	kanvas.fillRect(0,0,c.width,c.height);

	tacke.forEach(function(element){
		element.update();
	})
	
}

var Tacke = function(x,y,radiani,poluprecnik){

	this.x=x;
	this.y=y;
	this.poluprecnik=poluprecnik;
	this.radiani = radiani;
	this.red = Math.floor(Math.random()*256);
	this.green = Math.floor(Math.random()*256);
	this.blue = Math.floor(Math.random()*256);
	this.mouse_point = {x:x_pocetno,y:y_pocetno};


	this.random_vrednost = (Math.random()*70+50);

	this.draw = function(past_point){
		kanvas.beginPath();
		//kanvas.arc( this.x,this.y,this.poluprecnik,0,Math.PI*2,false);
		kanvas.strokeStyle = 'rgb('+this.red.toString()+','+this.green.toString()+','+this.blue.toString()+')';
		//kanvas.fillStyle = 'rgb('+this.red.toString()+','+this.green.toString()+','+this.blue.toString()+')';
		kanvas.lineWidth = this.poluprecnik;
		kanvas.moveTo(past_point.x,past_point.y);
		kanvas.lineTo(this.x,this.y);
		kanvas.stroke();
		kanvas.closePath();

	}

	this.update = function(){

		var past_point = { x : this.x, y : this.y };
		this.mouse_point.x+=(x_pocetno-this.mouse_point.x)*0.05;
		this.mouse_point.y+=(y_pocetno-this.mouse_point.y)*0.05;

		this.x = this.mouse_point.x+Math.cos(this.radiani)*this.random_vrednost;
		this.y = this.mouse_point.y+Math.sin(this.radiani)*this.random_vrednost;
		this.radiani+=0.05;
		this.draw(past_point);

	}


}

init();
animate();
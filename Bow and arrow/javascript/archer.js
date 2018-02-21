var kanvas;
var max_speed = -2;
var min_speed = 0.3;
var poluprecnik = 20;
var c = document.querySelector('canvas');

c.width = window.innerWidth;
c.height = window.innerHeight;

kanvas = c.getContext('2d');

var krugovi = [];
var strele = [];

var visina_igraca = 200;
var sirina_igraca = 200;
var pozicija_igraca = 200;
var broj_strela = 50;
var sirina_strele = 20;
var duzina_strele = 150;

var igrac = new Igrac(window.innerHeight/2,document.getElementById('slika_igraca'));

var init = function(){


	for(let i=0;i<100;i++){


		let x = Math.random()*(window.innerWidth*(1/3)) + window.innerWidth*(2/3);

		let y = window.innerHeight-(poluprecnik+5);

		window.setTimeout(()=>{
		var krug = new Krug(x,y,poluprecnik,Math.random()*min_speed,(Math.random()*max_speed)-1);
		krugovi.push(krug);
		},i*10000*Math.random());
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

	if(igrac.broj_strela>0)	
	requestAnimationFrame(animate);
	else
	window.alert("NEMA VISE STRELE BRATMI");

	kanvas.clearRect(0,0,innerWidth,innerHeight);

	krugovi.forEach(function(element){
		element.update();
	})
	strele.forEach(function(element){
		element.update();
	})
	igrac.draw();


	krugovi.forEach(function(element_kruga){
		strele.forEach(function(element_strele){
			if(element_kruga.x-element_kruga.poluprecnik<=element_strele.x+element_strele.duzina_strele && element_strele.x+element_strele.duzina_strele<=element_kruga.x+element_kruga.poluprecnik
				&& ( element_kruga.y-element_kruga.poluprecnik <= element_strele.y+element_strele.sirina_strele &&  element_strele.y+element_strele.sirina_strele <= element_kruga.y+element_kruga.poluprecnik)){
				var obrisi_element = krugovi.indexOf(element_kruga);
				krugovi.splice(obrisi_element,1);
			}
	})
	})


}

window.addEventListener('mousemove',function(event){

	igrac.move(event.clientY-igrac.sirina_igraca/2);

});

window.addEventListener('click',function(event){

	var strela = new Strela(event.clientY,document.getElementById('slika_strele'));
	strela.ispali_strelu();
	strele.push(strela);

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

		if( this.x - this.poluprecnik >= c.width || this.x - this.poluprecnik <= 0 ){
			var ukloni = krugovi.indexOf(this);
			krugovi.splice(ukloni,1);
		}
		if( this.y+ this.poluprecnik >= c.height || this.y - this.poluprecnik <= 0 ){
			var ukloni = krugovi.indexOf(this);
			krugovi.splice(ukloni,1);
		}

		this.x+=this.dx;
		this.y+=this.dy;

		this.draw();

	}
}
function Igrac(y,src){
	this.broj_strela = broj_strela;
	this.y=y;
	this.x=pozicija_igraca;
	this.sirina_igraca=sirina_igraca;
	this.visina_igraca=visina_igraca;
	this.image = src;
	this.move = function(y){
		this.y=y;
		this.draw();
	}

	this.draw = function(){
		kanvas.drawImage(this.image,this.x,this.y,this.sirina_igraca,this.visina_igraca);
	}
}

function Strela(y,src){
	this.x=pozicija_igraca+sirina_igraca;
	this.y=y;
	this.image=src;
	this.sirina_strele = sirina_strele;
	this.duzina_strele = duzina_strele;
	this.ispali_strelu = function(){
		igrac.broj_strela-=1;
		this.update();
	}
	this.draw = function(){
		kanvas.drawImage(this.image,this.x,this.y,this.duzina_strele,this.sirina_strele);
	}
	this.update = function(){
		this.x+=10;
		if(this.x>=window.innerWidth-this.duzina_strele){
			var obrisi_element = strele.indexOf(this);
				strele.splice(obrisi_element,1);
		}
		this.draw();
	}
}
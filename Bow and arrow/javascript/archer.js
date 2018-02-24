var kanvas;
var max_speed = -3;
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
var broj_strela = 20;
var sirina_strele = 15;
var duzina_strele = 150;
var igrac;
var broj_preostalih_balona;
var score;
var init = function(){


	for(let i=0;i<broj_preostalih_balona;i++){


		let x = Math.random()*(window.innerWidth*(1/3)) + window.innerWidth*(2/3);

		let y = window.innerHeight-(poluprecnik+5);

		window.setTimeout(()=>{
		var krug = new Krug(x,y,poluprecnik,Math.random()*min_speed,(Math.random()*max_speed)-1);
		krugovi.push(krug);
		},i*2500*Math.random());
	}
}
function httpGet(theUrl,callback){
    //document.write(theUrl);
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.onreadystatechange = handleReadyStateChange;
    xmlHttp.send(null);

    function handleReadyStateChange() {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {

        score = JSON.parse(xmlHttp.responseText);

		if($("#username").val()==""){
			$("#username").css({ "border-color": "red", "background-color": "#FAEDEC" }).attr("placeholder", "You must enter user name");
		}
		else{
			$('#myModal').modal('hide');	
			setTimeout(()=>{

				//callback();   
				broj_preostalih_balona=100;
				igrac = new Igrac(window.innerHeight/2,document.getElementById('slika_igraca'));
				init();
				animate();
			},1000)
		}

        }
      }

		callback();
    } 
}



function initTable(){

	var tabelica = "<table class='table table-striped table-bordered table-hover table-condensed'><thead><tr><th>Player</th><th>Score</th></tr></thead><tbody>";

	score.sort(function(a, b){
  	return a.Score < b.Score;
	});
	score.length=20;
	score.forEach(function(element){

		tabelica= tabelica + "<tr>"+"<td>"+ element.UserName.toString() + "</td>"+ "<td>"+ element.Score.toString() + "</td>"+"</tr>";

	});
	tabelica += "</tbody></table>"
	
	document.getElementById("tabela").innerHTML = tabelica;
}

function httpPost(igrac){
$.ajax( { url: "https://api.mlab.com/api/1/databases/archersdata/collections/users?apiKey=QAqaBafQpwLnvobFPsQCxBSfjQSzE2AI",
		  data: 
		  JSON.stringify( { 
		  	"UserName" : igrac.username,
		  	"Score" : igrac.broj_pogodjenih_balona
		  } ),
		  type: "POST",
		  contentType: "application/json" } );


}

function startApp(){

	httpGet("https://api.mlab.com/api/1/databases/archersdata/collections/users?apiKey=QAqaBafQpwLnvobFPsQCxBSfjQSzE2AI",initTable);


	//MORA DA CEKAS GET MAJKU TI JEBEM!

}

window.onresize= function(){
	krugovi.length=0;
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	init();

};
function animate(){

	
	if(igrac.broj_strela==0 && strele.length==0){
		httpPost(igrac);
		window.alert("NEMA VISE STRELE "+igrac.username.toString()+", A OBALIJA SI GI : " + igrac.broj_pogodjenih_balona.toString());
		krugovi.length=0;
		strele.length=0;
		startApp();
	}
	else if(broj_preostalih_balona==0){
		httpPost(igrac);
		window.alert("NEMA VISE BALONI BRATMI, A OBALIJA SI GI : " + igrac.broj_pogodjenih_balona.toString());
		krugovi.length=0;
		strele.length=0;
		startApp();
	}
	else
		requestAnimationFrame(animate);

	kanvas.clearRect(0,0,innerWidth,innerHeight);

	strele.forEach(function(element){
		element.update();
	})
	krugovi.forEach(function(element){
		element.update();
	})
	
	igrac.draw();


	krugovi.forEach(function(element_kruga){
		strele.forEach(function(element_strele){
			if(((element_kruga.x-element_kruga.poluprecnik)<(element_strele.x+element_strele.duzina_strele)) && ((element_strele.x+element_strele.duzina_strele)<(element_kruga.x+element_kruga.poluprecnik))
				&& ( (element_kruga.y-element_kruga.poluprecnik) < (element_strele.y+element_strele.sirina_strele)  &&  (element_kruga.y+element_kruga.poluprecnik) > (element_strele.y) )){
				var obrisi_element = krugovi.indexOf(element_kruga);
				krugovi.splice(obrisi_element,1);
				broj_preostalih_balona-=1;
				igrac.broj_pogodjenih_balona+=1;
			}
	})
	})


}

window.addEventListener('mousemove',function(event){

	igrac.move(event.clientY-igrac.sirina_igraca/2);

});

window.addEventListener('click',function(event){
	if(igrac.broj_strela>0){

		igrac.broj_strela-=1;
		var strela = new Strela(event.clientY,document.getElementById('slika_strele'));
		strela.ispali_strelu();
		strele.push(strela);
	}

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
			broj_preostalih_balona-=1;
		}
		if( this.y- this.poluprecnik >= c.height || this.y + this.poluprecnik <= 0 ){
			var ukloni = krugovi.indexOf(this);
			krugovi.splice(ukloni,1);
			broj_preostalih_balona-=1;
		}

		this.x+=this.dx;
		this.y+=this.dy;

		this.draw();

	}
}
function Igrac(y,src){
	this.broj_strela = broj_strela;
	this.broj_pogodjenih_balona=0;
	this.username=$("#username").val();
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
		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgb(255,102,255)";
		kanvas.textAlign = "center";
		kanvas.fillText(this.username.toString(), this.x+sirina_igraca/2, this.y-10);

		kanvas.drawImage(this.image,this.x,this.y,this.sirina_igraca,this.visina_igraca);

		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgb(102,255,255)";
		kanvas.textAlign = "center";
		kanvas.fillText(igrac.broj_strela.toString(), this.x+sirina_igraca/2, this.y+this.visina_igraca);


		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgba(0,255,0,0.5)";
		kanvas.textAlign = "center";
		kanvas.fillText(igrac.broj_pogodjenih_balona.toString(), this.x+sirina_igraca/2, 30);
	}
}

function Strela(y,src){
	this.x=pozicija_igraca+sirina_igraca;
	this.y=y;
	this.image=src;
	this.sirina_strele = sirina_strele;
	this.duzina_strele = duzina_strele;
	this.ispali_strelu = function(){
		if(igrac.broj_strela>0){
			this.update();
		}
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

var kanvas;
var max_speed = -3;
var min_speed = 0.3;
var poluprecnik = 20;
var c = document.querySelector('canvas');

c.width = window.innerWidth;
c.height = window.innerHeight;

kanvas = c.getContext('2d');

var timeouts = [];
var krugovi = [];
var strele = [];
var visina_igraca = 200;
var sirina_igraca = 200;
var pozicija_igraca = 200;
var broj_strela = 20;
var sirina_strele = 40;
var duzina_strele = 160;
var igrac;
var broj_iniciranih_balona=50;
var score;

var iscrtajBalone = function(broj_balona){

	let brzina = max_speed-(Math.random()*2);
	if(igrac.frenzi){
		brzina=krugovi[0].dy;
	}

	for(let i=0;i<broj_balona;i++){
		let x = Math.random()*(window.innerWidth*(1/3)) + window.innerWidth*(2/3)-poluprecnik;

		let y = window.innerHeight+i*window.innerHeight*(Math.random()+0.01);

		var krug = new Krug(x,y,poluprecnik,brzina);
		krugovi.push(krug);
	}

}
var inicirajBalone = function(broj_balona){

	krugovi.length=0;
	for(let i=0;i<5;i++)
		iscrtajBalone(broj_balona);

}



var init = function(){

	inicirajBalone(broj_iniciranih_balona);

}

function httpGet(theUrl,callback){

    ugasiPomeranjeMisem();
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
		else if($("#username").val().length>20){
			$("#username").css({ "border-color": "red", "background-color": "#FAEDEC" }).attr("placeholder", "You must enter user name shorter than 20 characters");
		}
		else{
			$('#myModal').modal('hide');	
			setTimeout(()=>{
				krugovi.length=0;
				igrac = new Igrac(window.innerHeight/2,document.getElementById('slika_igraca'));
				init();
				animate();
				callback();

				upaliPomeranjeMisem();   
			},500)
		}

        }
      }
    } 
}



function initTable(){

	if(score !== undefined){
	var tabelica = "<table class='table table-striped table-bordered table-hover table-condensed'><thead><tr><th>Player</th><th>Score</th></tr></thead><tbody>";
	
	score.sort(function(a, b){
  	return b.Score-a.Score;
	});
	score.length=20;
	score.forEach(function(element){

		tabelica= tabelica + "<tr>"+"<td>"+ element.UserName.toString() + "</td>"+ "<td>"+ element.Score.toString() + "</td>"+"</tr>";

	});
	tabelica += "</tbody></table>"
	
	document.getElementById("tabela").innerHTML = tabelica;
	}
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
	igrac=undefined;
	krugovi.length=0;
	for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
	}
	httpGet("https://api.mlab.com/api/1/databases/archersdata/collections/users?apiKey=QAqaBafQpwLnvobFPsQCxBSfjQSzE2AI",initTable);
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
	else if(krugovi.length==0){
		httpPost(igrac);
		window.alert("NEMA VISE BALONI "+igrac.username.toString()+", A OBALIJA SI GI : " + igrac.broj_pogodjenih_balona.toString());
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
			let x = (element_strele.x+element_strele.duzina_strele-element_kruga.x)*(element_strele.x+element_strele.duzina_strele-element_kruga.x);
			let y = (element_strele.y-element_kruga.y+element_kruga.poluprecnik)*(element_strele.y-element_kruga.y+element_kruga.poluprecnik);
			let razdaljina = Math.sqrt(x+y);
			if(  razdaljina < element_kruga.poluprecnik  ){
				var obrisi_element = krugovi.indexOf(element_kruga);
				igrac.broj_pogodjenih_balona+=1;
				if(element_kruga.frenzi){
					igrac.frenziFunction(10);
				}
				if(element_kruga.freez){
					igrac.freezFunction();
				}
				if(element_kruga.bomb){
					igrac.bombFunction();
				}
				krugovi.splice(obrisi_element,1);
			}
	})
	})


}
var reakcijaMisa = function(event){
	igrac.move(event.clientY-igrac.sirina_igraca/2);
}


var ugasiPomeranjeMisem = function(){
	window.removeEventListener('mousemove',reakcijaMisa);
}

var upaliPomeranjeMisem = function (){
	window.addEventListener('mousemove',reakcijaMisa);
}


window.addEventListener('click',function(event){

	if(igrac.broj_strela>0){
		igrac.broj_strela-=1;
		var strela = new Strela(event.clientY,document.getElementById('slika_strele'));
		strela.ispali_strelu();
		strele.push(strela);
	}

});



function Krug(x,y,poluprecnik,dy){
	this.frenzi = Math.random()*100<2?1:0;
	if(this.frenzi==0)
		this.freez = Math.random()*100<2?1:0;
	if(this.frenzi==0 && this.freez==0)
		this.bomb = Math.random()*100<2?1:0;

	this.x=x;
	this.y=y;
	this.dy=dy;
	this.poluprecnik = poluprecnik;
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
		if(this.frenzi){
			kanvas.font = "10px Comic Sans MS";
			kanvas.fillStyle = "rgb(0,0,0)";
			kanvas.textAlign = "center";
			kanvas.fillText("FRENZY", this.x, this.y);
		}
		if(this.freez){
			kanvas.font = "10px Comic Sans MS";
			kanvas.fillStyle = "rgb(0,0,0)";
			kanvas.textAlign = "center";
			kanvas.fillText("FREEZ", this.x, this.y);
		}
		if(this.bomb){
			kanvas.font = "10px Comic Sans MS";
			kanvas.fillStyle = "rgb(0,0,0)";
			kanvas.textAlign = "center";
			kanvas.fillText("BOMB", this.x, this.y);
		}
	}
	this.update = function(){
		if(this.y + this.poluprecnik <= 0 ){
			var ukloni = krugovi.indexOf(this);
			krugovi.splice(ukloni,1);
		}
		else{
			this.y+=this.dy;
			this.draw();
		}
	}
}
function Igrac(y,src){
	this.frenzi=0;
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
		kanvas.fillText(this.username.toString(), this.x+sirina_igraca/2, this.y);

		kanvas.drawImage(this.image,this.x,this.y,this.sirina_igraca,this.visina_igraca);

		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgb(102,255,255)";
		kanvas.textAlign = "center";
		kanvas.fillText("Strele : "+igrac.broj_strela.toString(), this.x+sirina_igraca/2, this.y+this.visina_igraca+10);


		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgba(0,255,0,0.5)";
		kanvas.textAlign = "center";
		kanvas.fillText("Baloni : "+igrac.broj_pogodjenih_balona.toString(), this.x+sirina_igraca/2, 30);
	}

	this.frenziFunction = function(duzina_frenzija){
		this.frenzi=1;
		krugovi.forEach(function(element){
			element.dy*=2;
		})

		for(let i=0;i<10;i++)
			iscrtajBalone(duzina_frenzija);

		timeouts.push(window.setTimeout(function(){
			krugovi.forEach(function(element){
			element.dy/=2;
			})
			this.frenzi=0;
		},10000));

	}
	this.freezFunction = function(){
		krugovi.forEach(function(element){
			element.dy/=5;
		})
		timeouts.push(window.setTimeout(function(){
			krugovi.forEach(function(element){
			element.dy*=5;
			})
		},10000));
	}
	this.bombFunction = function(){
		krugovi.forEach(function(element){
			if(element.y<window.innerHeight){
				igrac.broj_pogodjenih_balona+=1;
				if(element.freez)
					igrac.freezFunction();
				else if(element.frenzi)
					igrac.frenziFunction(10);
				let ukloni = krugovi.indexOf(element);
				krugovi.splice(ukloni,1);
			}
		})
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
		this.x+=15;
		if(this.x>=window.innerWidth-this.duzina_strele){
			var obrisi_element = strele.indexOf(this);
			strele.splice(obrisi_element,1);
		}
		else
			this.draw();
	}
}

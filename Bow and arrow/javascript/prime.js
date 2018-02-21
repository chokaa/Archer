//u niz prosti se upisuju prosti brojevi iz koga na kraj uzimamo element koji
//je prosledjen kao argument

var prosti = [];

function moj_nadji_prost(number){
	//pocinjemo od trojke i proveravamo samo za neparne brojeve ( i+=2 )
	//jer parni ne mogu biti prosti, kad niz dostigne duzinu zeljenog rednog prostog broja stajemo.
	//pocinjemo od drugog prostog broja( trojke ), zbog toga vracamo iz niza pretposlednji element ( number-2 )
	let i=3;
	while(1){
		if(prost(i))
			prosti.push(i);
		if(prosti.length==number)
			break;
		i+=2;
	}
	return prosti[number-2];
}

function prost(number){
	//limit do kog idemo je koren istog uvecan za 1 pocinjemo i proveravamo
	//samo brojevima iz niza prostih brojeva jer ukoliko ga ne dele 
	//prosti brojevi sigurno ga ne dele ni slozeni

	let granica = Math.ceil(Math.sqrt(number))+1;
	var i =0;
	while(prosti[i]<granica){
		if(number%prosti[i]==0)
			return false;
		i++;
	}
	return true;
	
}

console.time();
console.log(moj_nadji_prost(1000100));
console.timeEnd();





function validate(){
	let designation = document.getElementById("designation").value;
	document.getElementById("design").innerHTML = designation;
} 

function autocolor(){
	
	let couleur = "#";
	
	
	for (let i = 0; i < 6; i++){
		let b = 2+Math.floor(14*Math.random());
		let a;
		a = b.toString();
		switch(a){
			case "10":
				a = "A";
				break;
			case "11":
				a = "B";
				break;
			case "12":
				a = "C";
				break;
			case "13":
				a = "D";
				break;
			case "14":
				a = "E";
				break;
			case "15":
				a = "F";
				break;
		}
		couleur = couleur+a;
	}
	
	let corps = document.getElementById("body");
	corps.style.backgroundColor = couleur;
	
	return;
}

function changecolor(){
	
	let intervalID;
	intervalID = setInterval(autocolor,50);
	
}
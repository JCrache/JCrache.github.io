function validate(){
	let designation = document.getElementById("designation").value;
	document.getElementById("design").innerHTML = designation;
} 

let list = document.querySelector( '[role="tablist"]' );
let tablist = new window.Tablist( list );


// démarage du plugin
tablist.mount();
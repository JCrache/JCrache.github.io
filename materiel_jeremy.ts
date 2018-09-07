function validate(){
	let designation = document.getElementById("designation").value;
	document.getElementById("design").innerHTML = designation;
} 

let list = document.querySelector( '[role="tablist"]' );

Array.prototype.forEach.call( lists, function( list ) {
  new window.Tablist( list ).mount();
});

let tablist = new window.Tablist( list );

// démarage du plugin
tablist.mount();
var myImage = document.querySelector('img');

myImage.onclick = function() {
	
	var mySrc = myImage.getAttribute('src');
	if(mySrc==='images/trex.png'){
		myImage.setAttribute('src', 'images/Spino.png');
	}
	else{
		myImage.setAttribute('src', 'images/trex.png');
	}
	
}

var myButton = document.querySelector('button');
var myHeading = document.querySelector('h1');

function setUserName(){
	
	var myName = prompt('feed me your name, profligate.');
	localStorage.setItem('name', myName);
	myHeading.textContent = 'Why have you subscribed to such heresy, '+ myName+'?';
	
}
if(!localStorage.getItem('name')){
	setUserName();
}
else{
	var storedName = localStorage.getItem('name');
	myHeading.textContent = 'Why have you subscribed to such heresy, '+ storedName+'?';
}
myButton.onclick = function(){
	setUserName();
}
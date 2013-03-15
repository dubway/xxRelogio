/*

	-----------------------------------------------------------
	Developed by Pedro Galvao & Bruna Calheiros - New York 2013
	----------------------- justinti.me -----------------------

*/

//variables
var canvas, context;
var dateNow, h, m, s, out;

//----------------------------------------------------------------------------- createCanvas(), display();

function createCanvas() {
	//Create Canvas
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;

	//Call a function to display elements on canvas
	display();

}

function display(){
	//Responsive Canvas Size
	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;
	
	//Call Functions
	callBG();
	callTime();
	callFX();

	//Set Loop
	setTimeout(display, 1000);

}

//----------------------------------------------------------------------------- callBG();

function callBG(){
	//draw image on canvas  
	var myIMG = new Image();
	var myIMG_xPos = 0;
	var myIMG_yPos = 0;
	//Set background image source
	myIMG.src = "images/bg.jpg";
	context.drawImage(myIMG, myIMG_xPos, myIMG_yPos, canvas.width, canvas.height);
	//drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
}

//----------------------------------------------------------------------------- callTime();

function callTime(){
	//Variables
	dateNow = new Date();
	h = dateNow.getHours();
	m = dateNow.getMinutes();
	s = dateNow.getSeconds();
	//Check for single characters
	if (h <= 9){
		h = "0" + h;
	}
	if (m <= 9){
		m = "0" + m;
	}
	if (s <= 9){
		s = "0" + s;
	}
	out = h + ":" + m + ":" + s;
	//Make clock responsive
	var wPos =	(canvas.width/100)*3;
	var fSize = (500)*((canvas.width-wPos*2)/(300*6));
	var hPos = ((canvas.height)/2)+(fSize/3);
	//Display time
	context.font = 'normal ' + fSize +'px ack';
	context.fillStyle = 'white';
	context.fillText(out, wPos, hPos);

}

//----------------------------------------------------------------------------- callFX();

function callFX(){

	//quad();

	//pixelate(randomRange(10,30));
	slash(
		randomRange(0,canvas.height*4),
		randomRange(2,60),
		-128);
	slash(
		randomRange(0,canvas.height*4),
		randomRange(2,60),
		60);

	slash(600,60,-192);

	if (randomRange(0,10)>8){
		callTime();
		pixelate(randomRange(20,30));
	}

	if (randomRange(0,10)>8){
		var s =30
		var w = (canvas.height/s)*4;
		for(n=0; n<w; n++){
			var z = 100*n;
			slash(n*s,s,z);
		}
	}

	//pixelate(8);

	//chroma(1, 0, 0, 0, 0, 0);

}

//----------------------------------------------------------------------------- quad();

function quad(){
	var myIMG = new Image();
	myIMG.src = "images/ca001.jpg";

	var cropW = 200;
	var cropH = 250;

	var posX = 0;
	var posY = 0;
	var scaleX = 0.25;
	var scaleY = 0.25;

	var cols = canvas.width/(cropW*scaleX);
    var rows = canvas.height/(cropH*scaleY);



	for(var y=0; y<rows; y++) {

		for(var x=0; x<cols; x++) {

	  		//var nX = cols/(cropW*scaleX);
	  		var cropX = randomRange(0,canvas.width);
				var cropY = randomRange(0,canvas.height);

	  		if (randomRange(0,10)>7){
		  		context.drawImage(myIMG,
					cropX, cropY, cropW, cropH,
					posX+(cropW*scaleX*x), posY+(cropH*scaleY*y), cropW*scaleX, cropH*scaleY
				);
	  		}

		}
	}
}
  
//----------------------------------------------------------------------------- pixelate();

function pixelate(pixelSize){
  	//get image data
	var  imgData = context.getImageData(0, 0, canvas.width, canvas.height); 
	//get pixel data
	var pixelData = imgData.data; //array de pixels
	var cols = imgData.width;
    var rows = imgData.height;
    //mosaic routine
	for(var y=0; y<rows; y += pixelSize) {

		for(var x=0; x<cols; x += pixelSize) {
		
			var r = pixelData[((cols * y) + x) * 4 +0];
			var g = pixelData[((cols * y) + x) * 4 +1];
			var b = pixelData[((cols * y) + x) * 4 +2];
			var a = pixelData[((cols * y) + x) * 4 +3];

			for(var n=0; n<pixelSize; n++){

				for(var m = 0; m < pixelSize; m++) {

					if(x + m < cols) {
						pixelData[((cols * (y + n)) + (x + m)) * 4 + 0] = r;
	                	pixelData[((cols * (y + n)) + (x + m)) * 4 + 1] = g;
	                	pixelData[((cols * (y + n)) + (x + m)) * 4 + 2] = b;
                	}
	            }
			}
		}
	}
	//put image dat back
	context.putImageData(imgData, 0, 0);
}
//----------------------------------------------------------------------------- slash();

function slash(line, stroke, offset){
	//get image data
	var  imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	//get pixel data
	var pixelData = imgData.data;
	var alength = pixelData.length;
	//set slash variables
	var start = canvas.width*line
	var range = canvas.width*stroke;
	var myArray = new Array();
	//slash routine
	for (var j=0; j<range; j+=4){
		myArray[j] = pixelData[j+start];
		myArray[j+1] = pixelData[j+start+1];
		myArray[j+2] = pixelData[j+start+2];
		myArray[j+3] = pixelData[j+start+3];
	}

	for(var n=0; n<range; n++){
		pixelData[n+start+offset] = myArray[n];
	}
	//put image data back
	context.putImageData(imgData, 0, 0);
}
//-----------------------------------------------------------------------------	chroma();

function chroma(displace, glitch, lPos, tPos, rPos, bPos){
	//get image data
	var  imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	//get pixel data
	var pixelData = imgData.data;
	var cols = imgData.width;
    var rows = imgData.height;
	
	//selection
	var lefPos = lPos;
	var topPos = tPos;
	var rigPos = rPos+100;
	var	botPos = bPos+100;
	var selWidth = imgData.width-rigPos;
	var selHeight = imgData.height-botPos;

	var selX = (cols-((imgData.width-lefPos)-selWidth));
	var selY = (rows-((imgData.height-topPos)-selHeight));
	
	//chromatic aberration routine
	for (var y = tPos; y < selY; y++) {
		
		for (var x = lPos; x < selX; x++) {

			var r = pixelData[((cols * y) + x) * 4- (glitch-1) * (displace*20)];
			var g = pixelData[((cols * y) + x) * 4 +1];
			var b = pixelData[((cols * y) + x) * 4 +1 + (glitch-1) * (displace*20)];
			var a = pixelData[((cols * y) + x) * 4 +3];
	
			var bw = r*.3 + g*.59 + b*.11;
	
			pixelData[((cols * y) + x) * 4 +0] = r;
			pixelData[((cols * y) + x) * 4 +1] = g;
			pixelData[((cols * y) + x) * 4 +2] = b;
		}
	}
	//put image data back
	context.putImageData(imgData, 0, 0);
}

//-----------------------------------------------------------------------------

function randomRange(minValue, maxValue){
	var vMin = minValue;
	var vMax = maxValue;
	
	return Math.floor((Math.random()*vMax)+vMin);
}
var h,w,bx,by,js,js2,ctx,b2x,c,b2y;

window.onload = ()=>{

c = document.getElementById("main");

ctx = c.getContext("2d");
c.width = 0.95*window.innerWidth;
c.height = 0.75*window.innerHeight;
w = c.width;
h = c.height;

bx = 0.75*w;
by = h/2;
b2x = 0.25*w;
b2y = h/2;

ctx.fillStyle = "limegreen";

ctx.clearRect(0,0,w,h);

ctx.beginPath();
ctx.arc(bx,by,10,0,2*Math.PI);
ctx.fill();

ctx.beginPath();
ctx.arc(b2x,b2y,10,0,2*Math.PI);
ctx.fill();

//define options if you want, all are optional
var options = {
width: "80px", // css width
height: "80px", // css height
left: "auto", // css left
right: "10px", // css right
top: "auto", // css top
bottom: "10px", // css bottom
limitX: 1, // limit the magnitude of X
limitY: 1 // limit the magnitude of Y
//,cbStart: loop // function that will fire when touchstart event fires. Can also define cbMove and cbEnd for touchmove and touchend events.
}

// create a new joystick object with or without options
js = new Joystick(options);


// spawn a second instance if you want.
options.left = "10px";
options.right = "auto";
js2 = new Joystick(options);

loop();

}

// main game loop
function loop(){

//reference the joystick x and y properties in the game loop.  Magnify as required.
bx += 7*js.x;  
by += 7*js.y;
b2x += 7*js2.x;  
b2y += 7*js2.y; 


//define boundaries of canvas
if(bx >= w-10){bx = w-10;}
if(bx <= 10){bx = 10;}
if(by >= h-10){by = h-10;}
if(by <= 10){by = 10;}
if(b2x >= w-10){b2x = w-10;}
if(b2x <= 10){b2x = 10;}
if(b2y >= h-10){b2y = h-10;}
if(b2y <= 10){b2y = 10;}


//draw display
ctx.clearRect(0,0,w,h);
ctx.beginPath();
ctx.arc(bx,by,10,0,2*Math.PI);
ctx.fill();
ctx.beginPath();
ctx.arc(b2x,b2y,10,0,2*Math.PI);
ctx.fill();

//reference joystick.isPressed property to detect if the stick is being pressed.
//if(js.isPressed){
window.requestAnimationFrame(loop);
//}

}

/*++++++++++++++++++++++
+ Joystick constructor +
++++++++++++++++++++++*/

var Joystick = function(opts){ 

opts = opts || {};

this.x = 0; 
this.y = 0;
this.isPressed = false;

var elem = document.createElement("div");

elem.style.position = "fixed";
elem.style.margin  = "auto";
elem.style.background = "rgba(0,0,0,0.1)";
elem.style.boxShadow = "2px 3px 5px rgba(0,0,0,0.25)";
elem.style.borderRadius = "5px";
elem.style.zIndex = "100";
elem.style.width = opts.width || "100px";
elem.style.height = opts.height || "100px";
elem.style.top = opts.top || "auto";
elem.style.bottom = opts.bottom || "10px";
elem.style.left = opts.left || "0";
elem.style.right = opts.right || "0";

document.body.appendChild(elem);

var rect = elem.getBoundingClientRect();

var stick = document.createElement("div");

if(rect.width <= rect.height){
stick.style.width = Math.round(0.8*rect.width)+"px";
stick.style.height = Math.round(0.8*rect.width)+"px";
}else{
stick.style.width = Math.round(0.8*rect.height)+"px";
stick.style.height = Math.round(0.8*rect.height)+"px";
}

stick.style.borderRadius = "50%";
stick.style.background = "rgba(0,0,0,0.5)";

stick.style.boxShadow = "2px 3px 5px rgba(0,0,0,0.45), inset 5px 5px 15px lightgray, inset -5px -5px 15px rgba(0,0,0,0.75)";

stick.style.margin = "auto"
stick.style.position = "fixed";
stick.style.top = Math.round(rect.top+(0.1*rect.height))+"px";
stick.style.bottom = "auto";
stick.style.left = Math.round(rect.left+(0.1*rect.width))+"px";
stick.style.right = "auto";
stick.style.zIndex = "12";

elem.appendChild(stick);

var srect = stick.getBoundingClientRect();


elem.addEventListener("touchstart",(e)=>{

e.preventDefault();

stick.style.top = Math.round(e.targetTouches[0].clientY-(srect.height/2))+"px";
stick.style.left = Math.round(e.targetTouches[0].clientX-(srect.width/2))+"px";

var tempX = (e.targetTouches[0].clientX-rect.left-(rect.width/2))/(rect.width/2);
var tempY = (e.targetTouches[0].clientY-rect.top-(rect.height/2))/(rect.height/2);

this.x = (opts.limitX && Math.abs(tempX) > opts.limitX)?Math.sign(tempX)*opts.limitX : tempX;
this.y = (opts.limitY && Math.abs(tempY) > opts.limitY)?Math.sign(tempY)*opts.limitY : tempY;
this.isPressed = true;

if(opts.cbStart){opts.cbStart();}

},false);


elem.addEventListener("touchmove",(e)=>{

stick.style.top = Math.round(e.targetTouches[0].clientY-(srect.height/2))+"px";
stick.style.left = Math.round(e.targetTouches[0].clientX-(srect.width/2))+"px";

var tempX = (e.targetTouches[0].clientX-rect.left-(rect.width/2))/(rect.width/2);
var tempY = (e.targetTouches[0].clientY-rect.top-(rect.height/2))/(rect.height/2);

this.x = (opts.limitX && Math.abs(tempX) > opts.limitX)?Math.sign(tempX)*opts.limitX : tempX;
this.y = (opts.limitY && Math.abs(tempY) > opts.limitY)?Math.sign(tempY)*opts.limitY : tempY;

if(opts.cbMove){opts.cbMove();}

},false);


elem.addEventListener("touchend",(e)=>{

stick.style.top = Math.round(rect.top+(0.1*rect.height))+"px";
stick.style.left = Math.round(rect.left+(0.1*rect.width))+"px";

this.isPressed = false;
this.x = 0;
this.y = 0;

if(opts.cbEnd){opts.cbEnd();}

},false);

}

/*++++++++++++++++++++++
+    End constructor   +
++++++++++++++++++++++*/

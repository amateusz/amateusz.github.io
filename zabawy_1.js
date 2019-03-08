// http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=

var gifs= new Array();
var query_input;
var query_text = 'goats';
var mouseDraggedFlag = false;
var mouseDraggedOffset = {x:0, y:0};
var mouseCursorCurrentSize = 15;
var mouseCursorAnimationEasing = 0.15;
var keyScalingPressed = false;
var keyRotatingPressed = false;
var bgColour;


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100); // 300 - 331
  bgColour = color(Math.random() * 31 + 300, 97, 64); // never the same colour (NTSC)
  angleMode(DEGREES);

   noCursor();
   stroke(309,40,100);

   create_input();
   show_input();

}

function draw() {
  background(bgColour);
  //background("#A50365");
  for (var i = 0, len = gifs.length; i < len; i++) {
    // temporarily push away canvas origin
    push();
    translate(gifs[i].positionX, gifs[i].positionY); 
    // transformations
    rotate(gifs[i].rotation);
    scale(gifs[i].scaleX, gifs[i].scaleY);
    shearX(gifs[i].shearX);
    shearY(gifs[i].shearY);
    // and blit

    // console.debug("gif #" + i + ": " + gifs[i].loaded());
    // if (gifs[i].loaded()) {
    //   image(gifs[i], -gifs[i].width/2, -gifs[i].height/2); // actual gif
    // } else {
    //   image(gifs[i].preview, -gifs[i].preview.width/2, -gifs[i].preview.height/2); // if not ready, then only a mere preview
    // } 
    if (gifs[i].elt.complete){
    	// image(gifs[i], -gifs[i].width/2, -gifs[i].height/2); // actual gif
    	gifs[i].position(gifs[i].positionX - gifs[i].width/2, gifs[i].positionY - gifs[i].height/2); // actual gif
    }
    else {
      try{
        // push();
    	 image(gifs[i].preview, -gifs[i].preview.width/2, -gifs[i].preview.height/2); // if not ready, then only a mere preview
       // scale(gifs[i].preview.scale);
       console.log(gifs[i].preview.scale);
       // pop();
      }
      catch (TypeError){}
  	}
    // restore canvas origin
    pop();
  }

  try{
  	gif_intersects_with_mouse();
	  stroke(309,40,100);
  	strokeWeight(5);
  	noFill();
    // rect(mouseX-25, mouseY-25, 50, 50);
    mouseCursorCurrentSize += (15 - mouseCursorCurrentSize) * mouseCursorAnimationEasing
    line(mouseX - mouseCursorCurrentSize, mouseY - mouseCursorCurrentSize, mouseX + mouseCursorCurrentSize, mouseY + mouseCursorCurrentSize);
    line(mouseX - mouseCursorCurrentSize, mouseY + mouseCursorCurrentSize, mouseX + mouseCursorCurrentSize, mouseY - mouseCursorCurrentSize);
  }
  catch {
  	// draw non-selection curor
  	strokeWeight(12);
  	mouseCursorCurrentSize += (0 - mouseCursorCurrentSize) * mouseCursorAnimationEasing
  	line(mouseX - mouseCursorCurrentSize, mouseY - mouseCursorCurrentSize, mouseX + mouseCursorCurrentSize, mouseY + mouseCursorCurrentSize);
    line(mouseX - mouseCursorCurrentSize, mouseY + mouseCursorCurrentSize, mouseX + mouseCursorCurrentSize, mouseY - mouseCursorCurrentSize);
  }

  //try {
  //  if (gifs[0].loaded()) {
  //    console.log(gifs[0].frames());
  //  } else
  //    console.log('gif not loaded');
  //}
  //catch (TypeError) {
  //  console.log(TypeError);
  //}
}

function hide_input() {
  console.log('hide text input');
  query_input.elt.hidden = true;
  // query_input.remove();
  // query_input = null;
}

function create_input(){
	query_input = createInput(query_text);
	query_input.size(200, 30);       
    query_input.position(width/2 - query_input.width/2, height/3  - query_input.height/2);
    query_input.changed(hide_input); // attach callback
    query_input.elt.autofocus = true;
    query_input.onclick = function(){query_input.focus()};
}

function show_input(){
	console.log('created text input');
    query_input.elt.hidden = false;
    query_input.elt.select = true;
}

function keyPressed() {
  if (keyCode == BACKSPACE && query_input.elt.hidden) {
    if (!mouseDraggedFlag) {
      // check for collision with gif. it should be method of FloatingGif object, but not for now..
      //gifs.splice(gifs.length-1, 1);
      try {
        gifs.splice(gif_intersects_with_mouse(true), 1);
      }
      catch (err) {
      }
    }
  } else
    if (keyCode === CONTROL) {
      keyScalingPressed = true;
    } else if (keyCode === ALT || keyCode === OPTION) {
      keyRotatingPressed = true;
    } else {
      if (query_input.elt.hidden) {
        show_input();
        //document.getElementById(this.getAttribute('id')).focus();
      }
      else if (keyCode === ESCAPE){
      	hide_input();
      }

      if (keyCode === ENTER) {
      	// dragging_gif = true;
      	query_text = query_input.value();
		// if (gifs.length === 0)
		get_new_gif(query_text);
        hide_input();
      } else {
      }
    }
  //return false;
}

function keyReleased() {
  if (keyCode === CONTROL) {
    keyScalingPressed = false;
  }
  if (keyCode === ALT || keyCode === OPTION) {
    keyRotatingPressed = false;
  }
  else{
  	query_input.elt.focus();
  }
  return false;
}

function gif_intersects_with_mouse(reverse) {
  if (reverse === undefined) reverse = false; // what is wrong with this language ?!
  if (!reverse) {
    for (var i = 0; i < gifs.length; i++) {
      // check for disjoin
      if ((abs(mouseX - gifs[i].positionX) > gifs[i].width/2) || (abs(mouseY - gifs[i].positionY) > gifs[i].height/2)) {
      } else {
        return i;
      }
    }
  } else {
    for (var i = gifs.length - 1; i >= 0; i--) {
      // check for disjoin
      if ((abs(mouseX - gifs[i].positionX) > gifs[i].width/2) || (abs(mouseY - gifs[i].positionY) > gifs[i].height/2)) {
      } else {
        return i;
      }
    }
  }
  throw error; // something
  throw "not intersecting";
  // return false;
}

function mouseWheel(event) {

  try {
    if (keyScalingPressed) {
      gifs[gif_intersects_with_mouse()].scaleX += map(event.deltaX, 110, -110, -1.0, 1.0);
      gifs[gif_intersects_with_mouse()].scaleY += map(event.deltaY, -110, 110, -1.0, 1.0);
    } else if (keyRotatingPressed) {
      var vect = createVector(event.deltaX, event.deltaY);
      gifs[gif_intersects_with_mouse()].rotation = vect.heading() - 90;
      //console.log(degrees(createVector(event.deltaX, event.deltaX).heading()));
    } else {
      var shearDeltaY = map(event.deltaY, 70, -70, -PI / 4, PI / 4);
      var shearDeltaX = map(event.deltaX, -70, 70, -PI / 4, PI / 4);
      gifs[gif_intersects_with_mouse()].shearX += shearDeltaX;
      gifs[gif_intersects_with_mouse()].shearY += shearDeltaY;
    }
  }
  catch (err) {
  }
  return false;
}

function myInputEvent() {
  console.log('you are typing: ', this.value());
}

function mousePressed() {
  // check for collisions
  try {
  	intersecting = gif_intersects_with_mouse(true);
  	mouseDraggedFlag = true;
  	mouseDraggedOffset = {x: mouseX - gifs[intersecting].positionX, y: mouseY - gifs[intersecting].positionY};
  	mouseCursorCurrentSize = 15;
  }
  catch (err) {}

  if (!mouseDraggedFlag) {
    // if (mouseButton === LEFT) {
      //gifs.push(giphy('computer'));
      // get_new_gif(query_text);
    // }


    var methods = [];
    for (var m in gifs[0]) {
      if (typeof gifs[0][m] == "property") {
        methods.push(m);
      }
    }
    console.log(methods.join("\n"));
  }
}

function mouseDragged() {
  if (mouseDraggedFlag){
  	try {      
		gifs[intersecting].positionX = mouseX - mouseDraggedOffset.x ;
		gifs[intersecting].positionY = mouseY - mouseDraggedOffset.y; // actual gif

    }
    catch{}
  }
  //   gifs[gif_intersects_with_mouse()].rotation += 2;
  // }
  // catch(err) {
  // }
 
}

function mouseReleased() {
  mouseDraggedFlag = false;
  mouseCursorCurrentSize = 0;
}



function get_new_gif(query) {
  giphy(query).then( function(url) {
    // var new_gif = loadGif(url.data.image_url);
    var new_gif = createImg(url.data.image_url);
    
    new_gif.loaded = false;
    new_gif.elt.onload = function (){console.log("LOADED2")}; // 
    new_gif.elt.addEventListener("load", console.log("LOADED")); // strangely enough. these 2 trigger differently. one at the begginig of loading, the other one at the actual end

    // new_gif.draggable = false;
    new_gif.width = url.data.image_width;
    new_gif.height = url.data.image_height;

    //var new_gif = loadGif(url.data.fixed_width_downsampled_url);
    //new_gif.width = url.data.fixed_width_downsampled_width;
    //new_gif.height = url.data.fixed_width_downsampled_height;

    var pat = url.data.id; // id only, no filename // images.fixed_height_small_still.url.split('/')[0]
    //     new_gif.preview = loadImage(url.data.image_url
    //                                 .replace(pat, url.data.images.fixed_height_small_still.url)
    //                                 .split('/giphy.gif')[0] 
    //                                 );

      //     new_gif.preview.width = url.data.images["480w_still"].width;
      //     new_gif.preview.height = url.data.images["480w_still"].height;

    new_gif.positionX = mouseX; //-new_gif.width/2; // centre
    new_gif.positionY = mouseY; //-new_gif.height/2;
    new_gif.shearX = 0;
    new_gif.shearY = 0;
    new_gif.scaleX = 1.0;
    new_gif.scaleY = 1.0;
    new_gif.rotation = 0;

    new_gif.preview = loadImage(url.data.images.downsized_still.url);
    new_gif.preview.scale = new_gif.width / url.data.images.downsized_still.width;

    
    gifs.push(new_gif);
  }
  );
}

function giphy(query) {
  console.debug('fetching: ' + 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+query);
  return fetch('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+query)
    .then(function(response) {
    if (response.status >= 200 && response.status < 400) {
      //console.log(response_json.data.image_url);
      return response.json();
    }
  }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  }
  );
}

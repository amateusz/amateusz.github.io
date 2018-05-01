// http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=

var gifs= new Array();
var query_input;
var query_text = 'goats';
var mouseDraggedFlag = false;
var keyScalingPressed = false;
var keyRotatingPressed = false;
var bgColour;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100); // 300 - 331
  bgColour = color(Math.random() * 31 + 300, 97, 64); // never the same colour (NTSC)
  angleMode(DEGREES);
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
    if (gifs[i].loaded()) {
      image(gifs[i], -gifs[i].width/2, -gifs[i].height/2); // actual gif
    } else {
      image(gifs[i].preview, -gifs[i].preview.width/2, -gifs[i].preview.height/2); // if not ready, then only a mere preview
    }  
    // restore canvas origin
    pop();
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
  console.log('hide text input and perform query');
  query_text = query_input.value();
  if (gifs.length === 0)
    get_new_gif(query_text);
  //query_input.hide();
  query_input.remove();
  query_input = null;
}

function keyPressed() {
  if (keyCode == BACKSPACE && !query_input) {
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
      if (! query_input) {
        console.log('created text input');
        query_input = createInput(query_text);
        query_input.size(200, 30);
        query_input.show();
        query_input.position(width/2 - query_input.width/2, height/3  - query_input.height/2);
        query_input.changed(hide_input);
        //document.getElementById(this.getAttribute('id')).focus();
      }

      if (keyCode === ENTER) {
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
  return false;
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
  if (!mouseDraggedFlag) {
    if (mouseButton === LEFT) {
      //gifs.push(giphy('computer'));
      get_new_gif(query_text);
    }


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
  try {
    gifs[gif_intersects_with_mouse()].rotation += 2;
  }
  catch(err) {
  }
}

function mouseReleased() {
  mouseDraggedFlag = false;
}



function get_new_gif(query) {
  giphy(query).then( function(url) {
    var new_gif = loadGif(url.data.image_url);
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

    new_gif.preview = loadImage(url.data.images.downsized_still.url)
      //     new_gif.preview.width = url.data.images["480w_still"].width;
      //     new_gif.preview.height = url.data.images["480w_still"].height;

    new_gif.positionX = mouseX; //-new_gif.width/2; // centre
    new_gif.positionY = mouseY; //-new_gif.height/2;
    new_gif.shearX = 0;
    new_gif.shearY = 0;
    new_gif.scaleX = 1.0;
    new_gif.scaleY = 1.0;
    new_gif.rotation = 0;
    gifs.push(new_gif);
  }
  );
}

function giphy(query) {
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

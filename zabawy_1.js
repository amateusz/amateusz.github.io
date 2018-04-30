// http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=

var gifs= new Array();
var query_input;
var query_text = 'cats';

function setup() {
  createCanvas(1000, 600);
  background(0);
}

function hide_input() {
  console.log('hide and query');
  query_text = query_input.value();
  get_new_gif(query_text);
  //query_input.hide();
  query_input.remove();
  query_input = null;
}

function keyPressed() {
  if (! query_input) {
    console.log('created');
    query_input = createInput(query_text);
    query_input.size(200, 30);
    query_input.show();
    query_input.position(width/2 - query_input.width/2, height/3  - query_input.height/2);
    query_input.changed(hide_input);
  }

  if (keyCode !== ENTER) {
  } else
    hide_input();
    
  //console.log(Object.getOwnPropertyNames(query_input.elt))
  var methods = [];
  for (var m in query_input) {
    if (typeof query_input[m] == "property") {
      methods.push(m);
    }
  }
  console.log(methods.join("\n"));
}

//function show_input() {
//  if (keyCode !== ENTER) {
//    if (!query_input) {
//      console.log(' input');
//      query_input = createInput();
//      query_input.position(mouseX, mouseY);
//      query_input.input(show_input);
//      query_input.changed(hide_input);
//    }
//    else
//    console.log('not an input');
//  }
//}

function myInputEvent() {
  console.log('you are typing: ', this.value());
}

function mouseClicked() {
  //gifs.push(giphy('computer'));
  get_new_gif(query_text);
}

function draw() {
  background(0);
  for (var i = 0, len = gifs.length; i < len; i++) {
    image(gifs[i], gifs[i].positionX, gifs[i].positionY);
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


//function giphy(query) {
//  //document.addEventListener('DOMContentLoaded', function () {
//  //query = "computer"; // search query
//  request = new XMLHttpRequest();
//  request.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+query, true);
//  request.onload = function() {
//    if (request.status >= 200 && request.status < 400) {
//      data = JSON.parse(request.responseText).data.image_url;
//      //data_small = JSON.parse(request.responseText).data.fixed_width_small_url;
//      //console.log(data_small);
//      //console.log(data);
//      //document.getElementById("giphyme").innerHTML = '<center><img src = "'+data+'"  title="GIF via Giphy"></center>';
//    } else {
//      console.log('reached giphy, but API returned an error');
//    }
//  };
//  request.onerror = function() {
//    console.log('connection error');
//  };
//  request.send();
//  //});
//}

function get_new_gif(query) {
  giphy(query).then( function(url) {
    //var new_gif = loadGif(url.data.image_url);
    var new_gif = loadGif(url.data.fixed_width_downsampled_url);
    new_gif.width = url.data.fixed_width_downsampled_width;
    new_gif.height = url.data.fixed_width_downsampled_height;

    new_gif.positionX = mouseX-new_gif.width/2;
    new_gif.positionY = mouseY-new_gif.height/2;
    gifs.push(new_gif);
  }
  );
}

function giphy(query) {
  return fetch('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+query)
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

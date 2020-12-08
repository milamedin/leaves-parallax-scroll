//html setup
var itemsHTMLCollection = document.getElementsByClassName("parallex-item");
var itemsArray = Array.from(itemsHTMLCollection);

// input
var input = {
  mouseX: {
    start: 0,
    end: window.innerWidth,
    current: 0
  },
  mouseY: {
    start: 0,
    end: window.innerHeight,
    current: 0
  },
  scrollY: {
    start: 0,
    end: document.documentElement.scrollHeight - window.innerHeight,
    current: 0
  }
};
input.mouseX.range = input.mouseX.end - input.mouseX.start;
input.mouseY.range = input.mouseY.end - input.mouseY.start;
input.scrollY.range = input.scrollY.end - input.scrollY.start;

// output
var output = {
  x: {
    start: -150,
    end: 150,
    current: 0
  },
  y: {
    start: -150,
    end: 150,
    current: 0
  },
  scrollY: {
    start: 0,
    end: 500,
    current: 0
  },
  zIndex: {
    range: 10000
  },
  scale: {
    start: 1,
    end: 0.3
  },
  blur: {
    startingDepth: 0.15,
    range: 10
  }
};
output.x.range = output.x.end - output.x.start;
output.y.range = output.y.end - output.y.start;
output.scrollY.range = output.scrollY.end - output.scrollY.start;
output.scale.range = output.scale.end - output.scale.start;

var mouse = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.5
};

var updateInputs = function () {
  // mouse x input
  input.mouseX.current = mouse.x;
  input.mouseX.fraction =
    (input.mouseX.current - input.mouseX.start) / input.mouseX.range;
  // mouse y input
  input.mouseY.current = mouse.y;
  input.mouseY.fraction =
    (input.mouseY.current - input.mouseY.start) / input.mouseY.range;
  //scrollY input
  input.scrollY.current = document.documentElement.scrollTop;
  input.scrollY.fraction =
    (input.scrollY.current - input.scrollY.start) / input.scrollY.range;
};

var updateOutputs = function () {
  // output x  i y da se pomjeraju suprotno od misa
  output.x.current = output.x.end - input.mouseX.fraction * output.x.range;
  output.y.current = output.y.end - input.mouseY.fraction * output.y.range;
  // output x i y da prate misa
  //output.x.opposite = output.x.start + (input.mouseX.fraction * output.x.range);
  //output.y.opposite = output.y.start + (input.mouseY.fraction * output.y.range);
  //scrollY
  output.scrollY.current = output.scrollY.start + input.scrollY.fraction * output.scrollY.range;
};

var updateEachParallaxItem = function () {
  //apply output to HTML
  itemsArray.forEach(function (item, k) {
    var depth = parseFloat(item.dataset.depth, 10);
    var itemInput = {
      scrollY: {
        start: item.offsetParent.offsetTop,
        end: item.offsetParent.offsetTop + window.innerHeight
      }
    };
    itemInput.scrollY.range = itemInput.scrollY.end - itemInput.scrollY.start;
    itemInput.scrollY.fraction =
    (input.scrollY.current - itemInput.scrollY.start) / itemInput.scrollY.range;
    var itemOutputYCurrent = output.scrollY.start + itemInput.scrollY.fraction * output.scrollY.range;

    var itemOutput = {
      x: output.x.current - output.x.current * depth,
      y: (itemOutputYCurrent * depth) + (output.y.current - (output.y.current * depth)) ,
      zIndex: output.zIndex.range - output.zIndex.range * depth,
      scale: output.scale.start + output.scale.range * depth,
      blur: output.blur.range * (depth - output.blur.startingDepth)
    };
    item.style.filter = "blur(" + itemOutput.blur + "px)";
    item.style.zIndex = itemOutput.zIndex;
    item.style.transform =
      "scale(" +
      itemOutput.scale +
      ") translate(" +
      itemOutput.x +
      "px, " +
      itemOutput.y +
      "px)";
  });
  //console.log('output.x.current', output.x.current)
};

var handleMouseMove = function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  updateInputs();
  updateOutputs();
  updateEachParallaxItem();
};

var handleResize = function () {
  input.mouseX.end = window.innerWidth;
  input.mouseX.range = input.mouseX.end - input.mouseX.start;
  input.mouseY.end = window.innerHeight;
  input.mouseY.range = input.mouseY.end - input.mouseY.start;
  input.scrollY.end = document.documentElement.scrollHeight - window.innerHeight;
  input.scrollY.range = input.scrollY.end - input.scrollY.start;
};

var handleScroll = function () {
  updateInputs();
  updateOutputs();
  updateEachParallaxItem();
  //var scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  //console.log("scrollMax", scrollMax);
};

window.addEventListener('mousemove', handleMouseMove);
document.addEventListener("scroll", handleScroll);
window.addEventListener("resize", handleResize);


updateInputs();
updateOutputs();
updateEachParallaxItem();

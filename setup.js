document.querySelector("#canvas").addEventListener("mousemove", mousemove);
function mousemove(e) {
  document.title = e.offsetX + " " + e.offsetY;
}
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("index");
const widthParam = urlParams.get("width");
const heightParam = urlParams.get("height");
const samplesParam = urlParams.get("samples");
const jitterParam = urlParams.get("jitter");

sceneIndex = myParam ? myParam : 8;
width = widthParam ? parseInt(widthParam) : 400;
height = heightParam ? parseInt(heightParam) : 400;
samples = samplesParam ? samplesParam : 1;
jitterAmount = jitterParam ? jitterParam : 0;

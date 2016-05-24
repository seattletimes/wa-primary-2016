// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var $ = require("./lib/qsa");

var map = document.querySelector(".map svg");
var results = document.querySelector(".results");

var rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`;

var palette = {
  Clinton: rgb(202, 105, 81),
  Sanders: rgb(121, 143, 113),
  Carson: rgb(123, 90, 166),
  Cruz: rgb(163, 193, 221),
  Kasich: rgb(248, 158, 93),
  Trump: rgb(192, 33, 138)
};

var paint = function(party) {
  for (var c in window.counties) {
    var path = map.querySelector("#" + c.replace(/\s/g, "_"));
    var data = window.counties[c];
    if (data.winner[party]) {
      path.style.fill = palette[data.winner[party].last];
    } else {
      path.style.fill = null;
    }
  }
};

var repaint = function(e) {
  document.querySelector(".map-controls .selected").classList.remove("selected");
  e.target.classList.add("selected");
  paint(e.target.getAttribute("data-party"));
};

paint(map.getAttribute("data-party") || "Dem");
$("[data-party]").forEach(el => el.addEventListener("click", repaint));

var onCounty = function(e) {
  e.preventDefault();
  var p = e.target;
  var className = p.getAttribute("class");
  if (className != "county") return;
  results.setAttribute("data-mode", "county");
  var c = p.id.replace(/_/g, " ");
  var county = window.counties[c];
  county.results.sort((a, b) => a.last < b.last ? -1 : 1);
  var dem = county.results.filter(r => r.party == "Dem");
  var gop = county.results.filter(r => r.party == "GOP");
  results.querySelector(".county-name").innerHTML = c;
  var demList = results.querySelector(".county .democratic");
  demList.innerHTML = dem.map(r => `<li class="${r.last} ${r.winner ? "winner" : "" }"> ${r.last}: ${r.votepct.toFixed(1)}%`);
  var gopList = results.querySelector(".county .republican");
  gopList.innerHTML = gop.map(r => `<li class="${r.last} ${r.winner ? "winner" : "" }"> ${r.last}: ${r.votepct.toFixed(1)}%`);
};

map.addEventListener("click", onCounty);
map.addEventListener("touchstart", onCounty);

document.querySelector(".back-to-state").addEventListener("click", () => results.setAttribute("data-mode", "state"));
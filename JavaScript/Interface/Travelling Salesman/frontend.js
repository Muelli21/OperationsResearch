const TSP_MAP = "map";

var tspMap;
var tspLocations = [];
var tspMapMarkers = new Map();
var tspPolyline;

var displayedLocation;
var timer;

window.onload = function () {
	displayMap();
}

function displayMap() {

	tspMap = L.map(TSP_MAP).setView([48.1, 11.5], 10);
	let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
	});

	tileLayer.addTo(tspMap);
	L.control.scale().addTo(tspMap);
}

function searchInput() {
	clearTimeout(timer);
	timer = setTimeout(processInput.bind(this), 500);
}

function processInput() {
	let inputElement = document.getElementById("tspLocationInput");
	let input = inputElement.value;

	if (input == null || input == "") {
		let resultsWrapper = document.getElementById("tspResultsWrapper");
		clearElement(resultsWrapper);
	} else {
		getGeoData(input).then(data => displayInput(data));
	}

	console.log("now");
}

function displayInput(data) {

	let resultsWrapper = document.getElementById("tspResultsWrapper");
	let geoDataArray = data.features;

	clearElement(resultsWrapper);

	for (geoData of geoDataArray) {
		let properties = geoData.properties;
		let name = properties.name;
		let state = properties.state;
		let country = properties.country;
		let osmId = properties.osm_id;

		setTextButton(resultsWrapper, osmId, "resultButton", name + ", " + state + ", " + country, (function (variable) {
			return function () {
				displayLocation(variable);
			};
		})(geoData));
	}

	console.log(geoDataArray);
}

async function getGeoData(string) {
	let response = await fetch("https://photon.komoot.de/api/?q=" + string + "&limit=5");
	let data = response.json();
	return data;
}

function clearInput() {
	let inputElement = document.getElementById("tspLocationInput");
	let resultsWrapper = document.getElementById("tspResultsWrapper");
	inputElement.value = "";
	clearElement(resultsWrapper);
}

function displayLocation(geoData) {
	let geometry = geoData.geometry;
	let coordinates = [...geometry.coordinates].reverse();

	tspMap.setView(coordinates, 13);
	displayedLocation = geoData;
}

function addCurrentLocation() {

	let geoData = displayedLocation;

	if (geoData == undefined || geoData == null) { return; }

	let properties = geoData.properties;
	let name = properties.name;
	let country = properties.country;
	let osmId = properties.osm_id;
	let geometry = geoData.geometry;
	let coordinates = [...geometry.coordinates].reverse();

	tspLocations.push(geoData);
	displayedLocation = null;
	clearInput();

	if (!tspMapMarkers.has(osmId)) {
		let marker = L.marker(coordinates, { icon: markerIcon }).addTo(tspMap).bindPopup(name + ", " + country);
		tspMapMarkers.set(osmId, marker);
	}

	console.log(geoData);
	displayLocationList();
}

function removeLocation(geoData) {
	let properties = geoData.properties;
	let osmId = properties.osm_id;

	tspLocations.remove(geoData);
	if (tspMapMarkers.has(osmId)) {
		let marker = tspMapMarkers.get(osmId);
		tspMap.removeLayer(marker);
		tspMapMarkers.delete(osmId);
	}

	if(tspPolyline != null) {
		tspMap.removeLayer(tspPolyline);
		tspPolyline = null;
	}

	displayLocationList();
}

function displayLocationList() {

	let listWrapper = document.getElementById("tspListWrapper");
	let geoDataList = tspLocations;

	clearElement(listWrapper);
	clearInput();

	for (let geoData of geoDataList) {

		let properties = geoData.properties;
		let name = properties.name;
		let country = properties.country;
		let osmId = properties.osm_id;

		let locationButton = setButton(listWrapper, osmId, "listButton", (function (variable) {
			return function () {
				removeLocation(variable);
			};
		})(geoData));

		setParagraph(locationButton, "", "listParagraph", name + ", " + country);
	}
}

var markerIcon = L.icon({
	iconUrl: './Resources/marker-icon.png',
	shadowUrl: './Resources/marker-shadow.png',

	iconSize: [25, 41], // size of the icon
	shadowSize: [41, 41], // size of the shadow
	iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
	shadowAnchor: [12, 41],  // the same for the shadow
	popupAnchor: [1, -34] // point from which the popup should open relative to the iconAnchor
});

function solveTsp() {
	let geoDataArray = tspLocations;
	let travellingSalesman = new TravellingSalesman(geoDataArray);
	let result = travellingSalesman.solve();
	
	console.log(result[1]);
	displayTour(geoDataArray, result[0], result[1]);
}

function displayTour(geoDataArray, distanceMatrixObject, tourMatrixObject) {

	if(tspPolyline != null) {
		tspMap.removeLayer(tspPolyline);
		tspPolyline = null;
	}

	let numberOfPoints = geoDataArray.length;
	let polylinePoints = []; // What is more efficient when knowing an arrays final length, [] or new Array(length)?
	let tourMatrix = tourMatrixObject.getMatrix();
	let i = 0;

	let startingPoint = [...geoDataArray[0].geometry.coordinates].reverse();
	polylinePoints.push(startingPoint);

	while (polylinePoints.length < numberOfPoints) {
		for (let j = 0; j < numberOfPoints; j++) {
			if (tourMatrix[i][j] == 1) {
				polylinePoints.push([...geoDataArray[j].geometry.coordinates].reverse());
				i = j;
				j = 0;
				break;
			}
		}
	}

	polylinePoints.push(startingPoint);
	console.log(polylinePoints);
	let polyline = L.polyline(polylinePoints).addTo(tspMap);
	tspMap.fitBounds(polyline.getBounds());
	tspPolyline = polyline;
}

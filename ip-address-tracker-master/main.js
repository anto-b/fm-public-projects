alert("Please note that some AdBlockers may interfere with the proper functioning of the app, moreover the location is only an estimate")
const ipEl = document.getElementsByClassName("info-value")[0];
const locEl = document.getElementsByClassName("info-value")[1];
const timeEl = document.getElementsByClassName("info-value")[2];
const ispEl = document.getElementsByClassName("info-value")[3];
const srcBtn = document.getElementById("src-btn");
const inptEl = document.getElementById("src-vl");

/* setting the icon for the marker in the map */
const myIcon = L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -95],
    //shadowUrl: 'my-icon-shadow.png',
    //shadowSize: [68, 95],
    //shadowAnchor: [22, 94]
});


let map = L.map('map', { zoomControl: false });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Desgin <a href="https://www.frontendmentor.io/">Frontend Mentor</a> | Webpage and Project &copy; <a href="https://github.com/anto-b">ABTechnologies</a>'
}).addTo(map);

let link = "https://geo.ipify.org/api/v2/country,city?apiKey=at_zzAWxtWMqL9O1uCoDJ7e4y3oxz0mY"; //default link for searching client's IP
newSearch(link); //when the client open the page automatically search for client's IP

srcBtn.onclick = () => {
    let link = "https://geo.ipify.org/api/v2/country,city?apiKey=at_zzAWxtWMqL9O1uCoDJ7e4y3oxz0mY";
    let inptVl = inptEl.value.replace(/ /g, "").toLowerCase(); //remove all whitespaces & convert to lwrcase
    if (inptVl) { //if the input is non empty
        console.log(inptVl);
        if (checkIfValidIP(inptVl)) {
            link += `&ipAddress=${inptVl}`;
            newSearch(link);
        } else if (getHostname(inptVl)) {
            inptEl.value = getHostname(inptVl);
            link += `&domain=${getHostname(inptVl)}`;
            newSearch(link);
        } else {
            alert("Invalid input, please insert a valid IP or domain")
        }
    } else {
        alert("Empty input, please insert a valid IP or domain")
    }
}

function newSearch(link) {
    newXHR(link)
        .then(
            response => { updateMap(response) },
            error => console.warn(error)
        )
}

function updateMap(response) {
    ipEl.textContent = response.ip;
    locEl.textContent = `${response.location.city},${response.location.country} ${response.location.postalCode}`;
    timeEl.textContent = `UTC ${response.location.timezone}`;
    ispEl.textContent = response.isp;
    let latLng = [response.location.lat, response.location.lng];
    map.setView(latLng, 17);
    let marker = L.marker(latLng, { icon: myIcon }).addTo(map);
    marker.bindPopup(`Latitude: ${latLng[0]} Longitude: ${latLng[1]} (estimated)`);//.openPopup();
}

function newXHR(link) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", link);
        xhr.responseType = "json";
        xhr.onload = () => {
            if (xhr.status === 200) resolve(xhr.response);
            else reject(new Error("xhr req failed"));
        }

        xhr.send();
    })
}

/* Check if string is IP (IPv4) */
function checkIfValidIP(str) {
    // Regular expression to check if string is a IP address
    const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

    return regexExp.test(str);
}

/* get hostname from a string */
function getHostname(url) {
    // run against regex
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    // extract hostname (will be null if no match is found)
    return matches && matches[1];
}

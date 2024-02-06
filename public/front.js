let map;
let marker;

async function initMap() {
    const position = {lat: 43.18877154973197, lng: 76.88631660045459};
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: 4,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    map.addListener("click", (e) => {
        marker = placeMarkerAndPanTo(e.latLng, map);
        google.maps.event.addListener(marker,'rightclick',function() {
            this.setMap(null)
            console.log('deleted')
        });
        google.maps.event.addListener(marker,'click', async function() {
            const data = {"lat": this.position.lat(), "lng": this.position.lng() }
            console.log(data)
            getData(data)
        });
    });
}
initMap()

const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("User").innerText = user.username;

document.getElementById("form").addEventListener("submit", (e)=> {
    e.preventDefault();
    const city = document.getElementById('exampleInputEmail1').value
    const data = {city}
    console.log(city)
    getData(data)
    });

function placeMarkerAndPanTo(latLng, map) {
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);
    return marker;
}

async function getData(data){
    data.user = user;
    fetch('http://localhost:3000/info', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },

            })
            .then(response => response.json())
            .then(renderData)
            .catch(error => console.error(error));
}

async function renderData(data){
    var weatherInfo = `
    <img src="${data.flag}" width="100px">
    <h2>Weather Information</h2><img src='http://openweathermap.org/img/wn/${data.weather[0].icon}.png' class="px-3 py-1 border">
    <p>🌎 Location: ${data.name}, ${data.sys.country}</p>
    <p>🌡 Temperature: ${data.main.temp} &#8451;</p>
    <p>🌥 Weather: ${data.weather[0].description}</p>
    <p>🚩 Latitude and Longitude: ${data.coord.lat} and ${data.coord.lon}</p>
    <p>😦 Fell like Temperature: ${data.main.feels_like} &#8451</p>
    <p>💧 Humidity: ${data.main.humidity} </p>
    <p>👉 Pressure: ${data.main.pressure} </p>
    <p>💨 Wind speed: ${data.wind.speed} </p>`;
    document.getElementById('weather-info').innerHTML = weatherInfo;
    map.panTo({lat: data.coord.lat, lng: data.coord.lon}, 3000)
    document.getElementById('something').style.display = "block";
}

document.getElementById("extendedbtn").addEventListener("click", async ()=>{
    let data = JSON.parse(localStorage.getItem("data"));
    data = await fetch('http://localhost:3000/extended', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },

            })
            .then(response => response.json())
    let text = '';
    console.log(data);
    let dayNumber = new Date(data.list[0].dt * 1000)
    data.list.forEach(day => {
        text += `<tr>
                    <td>${dayNumber.toLocaleDateString()}</td>
                    <td>${day.main.temp_max }°C</td>
                    <td>${ day.main.temp_max}°C</td>
                    <td>${ day.wind.deg }°</td>
                </tr>`;
        dayNumber.setDate(dayNumber.getDate() + 1);

    });
    // <strong>Sunrise Time:</strong> ${ new Date(day.sunrise * 1000).toLocaleTimeString()}<br>
    // <strong>Sunset Time:</strong> ${ new Date(day.sunset * 1000).toLocaleTimeString()}
    document.getElementById("extendedTable").style.display = "block";   
    document.getElementById("extended").innerHTML = text;
            
})

const logout = () => {
    localStorage.removeItem("user")
    location.replace("/")
}

function getHistory() {
    const data = {user}
    fetch('http://localhost:3000/history', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },

    })
    .then(response => response.json())
    .then(renderHistory)
    .catch(error => console.error(error));
}

function renderHistory(data){
    console.log(user);
    let s = ''        
    for (let i = 0; i < data.length; i ++){
        const [lat, lon] = [data[i].lat, data[i].lon]
        s += `<h6>${data[i].city}</h6> <p>Latitude and Longitude: ${lat}, ${lon}</p><p>Temperature and Descpiption: ${data[i].temperature}, ${data[i].description}</p> <button class="btn btn-secondary" onclick="getAgain(${lat}, ${lon})">Get again</button>`
        s += "<hr>"
    }
    document.getElementById("modalBody").innerHTML = s;
    document.getElementById("exampleModalLong").style.display = "block";

}

function closeModal(){
    document.getElementById("exampleModalLong").style.display = "none";
}

function getAgain(lat, lon){
    const data = {lat, lng: lon};
    document.getElementById("exampleModalLong").style.display = "none";
    getData(data);
}
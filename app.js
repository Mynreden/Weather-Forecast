import express from "express";
import bodyParser from "body-parser"
import fetch from 'node-fetch';


const port = process.env.PORT || 3001
const app = express()
let apiKey = 'f19435857b0f7f57e4ffe166ba50a268';


app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/public', express.static(process.cwd()));


app.post("/info", async (req, res) => {
    const {lat, lng, city, extended} = req.body;
    let apiUrl;
    if (city == undefined) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const url = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyA9aXTkvlGGuCLsvihiGBK-AXYVsjHUg3U';
        const message = {
            q: data.weather[0].description,
            source: 'en',
            target: 'ru'
        };
        const trans_res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'Content-Type': 'application/json'
        }
        });
        let trans = await trans_res.json()
        data.weather[0].description = trans.data.translations[0].translatedText;

        let country_info = await fetch('https://restcountries.com/v3.1/alpha/' + data.sys.country);
        country_info = await country_info.json();
        data.flag = country_info[0].flags.png
        res.json(data); 
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Internal Server Error');
    }

})

app.post("/extended", async (req, res) => {
    const {lat, lng, city, extended} = req.body;
    let apiUrl;
    if (city == undefined) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&cnt=14&lat=${lat}&lon=${lng}&appid=${apiKey}`;
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&cnt=14&q=${city}&appid=${apiKey}`;
    }
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data)
        res.json(data); 
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Internal Server Error');
    }

})

app.get("/", async (req, res) => {
    return res.sendFile(process.cwd() + '/index.html')
})

app.listen(port, () => {
    console.log(`Listening in http://localhost:${port}`)
})
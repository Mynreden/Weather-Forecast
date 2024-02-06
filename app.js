const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Weather = require('./models/WeatherModel');
const path = require('path');


dotenv.config()
const mongoUrl = process.env.MONGO_URL
const serverSelectionTimeoutMS = 1000 // Time in milliseconds twat server will wait to connect to db

const port = process.env.PORT || 3000 
const app = express()
let apiKey = 'f19435857b0f7f57e4ffe166ba50a268';
const staticDir = path.join(process.cwd(), 'public');

app.set("view engine", "ejs");

app.use('/public', express.static(staticDir));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))


app.post("/info", async (req, res) => {
    let {lat, lng, city, extended} = req.body;
    let apiUrl;
    if (city == undefined) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${apiKey}`;
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
    }
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data)
        const {lat, lon} = data.coord;
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
        if (city == undefined) {
            city = data.name;
        }

        let country_info = await fetch('https://restcountries.com/v3.1/alpha/' + data.sys.country);
        country_info = await country_info.json();
        console.log(data)
        data.flag = country_info[0].flags.png
        res.json(data); 
        const newWeather = new Weather({
            userId: req.body.user._id,
            city,
            lat,
            lon,
            temperature: data.main.temp,
            description: data.weather[0].description,
        })
        await newWeather.save()
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
    return res.render('auth.ejs')
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const currentUser = await User.findOne({username, password}) 
    if (!currentUser){
        return res.status(404).json({message: "Incorrect username or password"})
    }   
    res.status(200).json({user: currentUser})
})

app.post("/registration", async (req, res) => {
    const {username, password} = req.body;
    const newUser = new User({
        username,
        password,
        isAdmin: false,
        deletedAt: null,
    })
    const currentUser = await User.findOne({username}) 
    if (currentUser){
        return res.status(404).json({message: "Thy another username"})
    } 
    const user = await newUser.save()
    res.status(200).json({user})
})

app.get("/main", async (req, res) => {
    return res.render("index.ejs")
})

app.post("/history", async (req, res) => {
    const {user} = req.body;
    const weathers = await Weather.find({userId: user._id});
    res.status(200).json(weathers);
})

app.get("/admin", async (req, res) => {
    return res.render("admin.ejs")
})

app.post("/admin/login", async (req, res) => {
    const {username, password} = req.body;
    const currentUser = await User.findOne({username, password}) 
    if (!currentUser){
        return res.status(404).json({message: "Incorrect username or password"})
    }  
    if (!currentUser.isAdmin){
        return res.status(404).json({message: "Incorrect username or password"})
    } 
    res.status(200).json({user: currentUser})
})

app.get("/adminpanel", async (req, res) => {
    const usersList = await User.find();
    return res.render("adminPanel.ejs", {usersList})
})

app.post("/update/users", async (req, res) => {
    const {userId, password, username} = req.body;
    const user = await User.findById(userId);
    if (password != ""){
        user.password = password;
    } 
    if (username != ""){
        user.username = username;
    } 
    const newUser = await user.save();
    res.status(200).json({user: newUser})
})

app.post("/update/userToAdmin", async (req, res) => {
    const {userId} = req.body;
    const user = await User.findById(userId);
    user.isAdmin = !user.isAdmin;
    const newUser = await user.save();
    res.status(200).json({user: newUser})

})

app.delete("/delete/users/:id", async (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    await User.findByIdAndDelete(userId);

    res.status(200).json({message: "User deleted"})
})

let db = mongoose.Mongoose;
try {
    db = await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS });
} catch (err) {
    console.error(err)
    mongoose.disconnect()
    process.abort()
} 

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

module.exports = app;
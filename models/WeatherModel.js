const mongoose = require("mongoose");


let weatherSchema = new mongoose.Schema({ // Scheme how nodeJs will interact with MongoDB. In this part we define attributes of model
    userId: {type: String, require: true},
    city: {type: String, require: true},
    lat: String,
    lon: String,
    temperature: Number,
    description: String,
}, {timestamps: true} // automatically adds 2 properties createdAt and updatedAt
);

const Weather = mongoose.model("Weathers", weatherSchema); // Created model using this schema
export default Weather;
import mongoose from "mongoose"

let userSchema = new mongoose.Schema({ // Scheme how nodeJs will interact with MongoDB. In this part we define attributes of model
    username: {type: String, maxLength: 50, minLength: 2, require: true},
    password: {type: String, minLength: 2, require: true},
    isAdmin: {type: Boolean},
    deletedAt: {type: Date}
}, {timestamps: true} // automatically adds 2 properties createdAt and updatedAt
);

const User = mongoose.model("Users", userSchema); // Created model using this schema
export default User;
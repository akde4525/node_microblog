import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

// Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Require']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is Require'],
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'Password is Require']
    },
    bio: {
        type: String
    },

}, { timestamps: true });

// middleware for hashing password
userSchema.pre("save", async function () {
    if (!this.isModified) return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// compare password
userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
}

// json web token
userSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export default mongoose.model('User', userSchema);
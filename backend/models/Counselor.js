const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const counselorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    universityName: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: '',
    },
    availability: [{
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false }
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    // New Profile Fields
    skills: [{ type: String }],
    services: [{ type: String }],
    experience: { type: Number, default: 0 },
    languages: [{ type: String }],
    price: { type: Number, default: 0 },
    photo: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' } // Default avatar
}, {
    timestamps: true,
});

counselorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

counselorSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Counselor = mongoose.model('Counselor', counselorSchema);
module.exports = Counselor;

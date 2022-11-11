const { array } = require("joi");
const mongoose = require("mongoose");
const { findOrCreate } = require("../utils/auth");

const gigSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    gigStatus: {
        type: String,
        required: true,
    },
    gigIntroduction: {
        gigTitle: {
            type: String,
            required: true,
        },
        gigCategory: {
            type: String,
            required: true,
        },
        gigDescription: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        tage: [
            {
                type: String,
                required: true,
            },
        ],
        country: {
            type: String,
            required: true,
        },
        addres: {
            type: String,
            required: true,
        },
    },
    images: [
        {
            type: Object,
            required: true,
        }
    ],
    // "title": "title",
    //   "description": "description",
    //   "sourceFile": true,
    //   "initialConcepts": true,
    //   "revision": 1,
    //   "deliveryTime": 1,
    //   "price": 10
    packages: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            sourceFile: {
                type: Boolean,
                required: true,
            },
            initialConcepts: {
                type: Boolean,
                required: true,
            },
            revision: {
                type: Number,
                required: true,
            },
            deliveryTime: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    // title: "",
    // discription: "",
    questionArr: [
        {
            title: {
                type: String,
                required: true,
            },
            discription: {
                type: String,
                required: true,
            },
        },
    ]
});

const Gig = mongoose.model("Gig", gigSchema);
module.exports = { Gig };
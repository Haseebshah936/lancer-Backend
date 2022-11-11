const { Gig } = require('../models/gig');

const createGig = async (req, res) => {
    try {
        // const { gigTitle, gigCategory, gigDescription, language, tage, country, address } = req.body;

        const gig = new Gig(req.body);
        await gig.save();
        res.status(200).json(gig);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
const getAllGigsByEmail = async (req, res) => {
    try {
        const gigs = await Gig.find({ email: req.params.email });
        res.status(200).json(gigs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
const getSingleGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        res.status(200).json(gig);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
const deleteGigById = async (req, res) => {
    try {
        const gig = await Gig.findByIdAndDelete(req.params.id);
        res.status(200).json(gig);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
const gigStatusChangeById = async (req, res) => {
    try {
        const { status } = req.body;
        const gig = await Gig.findByIdAndUpdate(
            req.params.id,
            {
                status
            },
            {
                new: true
            }
        );
        res.status(200).json(gig);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createGig, getAllGigsByEmail, getSingleGigById, deleteGigById, gigStatusChangeById };
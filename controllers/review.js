const Review = require("../models/review");
const mongoose = require("mongoose");

const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).send("Review not found");
    res.status(200).send(review);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    if (!reviews) return res.status(404).send("Review not found");
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getBuyerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    let { skip } = req.query;
    console.log(skip);
    if (skip === undefined) skip = 0;
    const reviews = await Review.find({ buyerId: id })
      .sort({
        createdAt: -1,
      })
      .populate("sellerId buyerId", "profilePic name ")
      .skip(parseInt(skip))
      .limit(10);
    if (!reviews) return res.status(404).send("Reviews not found");
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getSellerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const reviews = await Review.find({ sellerId: id })
      .sort({
        createdAt: -1,
      })
      .populate("sellerId buyerId", "profilePic name")
      .limit(10)
      .skip(parseInt(skip));
    if (!reviews) return res.status(404).send("Reviews not found");
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment, buyerId, sellerId } = req.body;
    const review = new Review({
      rating,
      comment,
      buyerId,
      sellerId,
    });
    await review.save();
    res.status(200).send(review);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { comment } = req.body;
    const review = await Review.findById(id);
    if (!review) return res.status(404).send("Review not found");
    review.reply = comment;
    review.isReply = true;
    await review.save(review);
    res.status(200).send(review);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findByIdAndUpdate(id);
    if (!review) return res.status(404).send("Review not found");
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(200).send(review);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).send("Review not found");
    res.status(200).send("Review deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  getReview,
  getReviews,
  getBuyerReviews,
  getSellerReviews,
  createReview,
  createReply,
  updateReview,
  deleteReview,
};

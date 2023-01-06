const Review = require("../models/review");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Product } = require("../models/product");

function ratingCalculation(
  oldRating,
  oldReviewsCount,
  newRating,
  newReviewsCount
) {
  const nRating =
    (oldRating * oldReviewsCount) / newReviewsCount +
    newRating / newReviewsCount;
  return nRating;
}

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
    const reviews = await Review.find({ buyerId: id, sender: "seller" })
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

const getBuyerReviewForProject = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    let { skip } = req.query;
    console.log(skip);
    if (skip === undefined) skip = 0;
    const reviews = await Review.findOne({
      sellerId: userId,
      projectId,
      sender: "client",
    })
      .sort({
        createdAt: -1,
      })
      .populate("sellerId buyerId", "profilePic name ")
      .skip(parseInt(skip))
      .limit(10);
    if (!reviews) return res.status(404).send("Review not found");
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getSellerReviewForProject = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    let { skip } = req.query;
    console.log(skip);
    if (skip === undefined) skip = 0;
    const reviews = await Review.findOne({
      buyerId: userId,
      projectId,
      sender: "seller",
    })
      .sort({
        createdAt: -1,
      })
      .populate("sellerId buyerId", "profilePic name ")
      .skip(parseInt(skip))
      .limit(10);
    if (!reviews) return res.status(404).send("Review not found");
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getBuyerReviewsCount = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ buyerId: id }).count();
    res.status(200).json(reviews);
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
    const reviews = await Review.find({ sellerId: id, sender: "client" })
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

const getSellerReviewsCount = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({
      sellerId: id,
      sender: "client",
    }).count();
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// const getSellerReviewsCount = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const reviews = await Review.find({ sellerId: id }).count();
//     if (!reviews) return res.status(404).send("Reviews not found");
//     res.status(200).send(reviews);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error.message);
//   }
// };

const createReview = async (req, res) => {
  try {
    const { rating, comment, buyerId, sellerId, productId, projectId, sender } =
      req.body;
    const review = new Review({
      rating,
      comment,
      buyerId,
      sellerId,
      productId,
      projectId,
      sender,
    });
    const cheackReview = await Review.findOne({
      buyerId,
      sellerId,
      productId,
      projectId,
      sender,
    });
    if (cheackReview)
      return res
        .status(400)
        .send("You already submitted a review for this project");
    if (sender === "seller") {
      const client = await User.findById(buyerId);
      if (!client) return res.status(404).send("Client not found");
      const newBuyerRating = ratingCalculation(
        client.stars,
        client.reviews,
        rating,
        client.reviews + 1
      );
      client.reviews++;
      client.stars = newBuyerRating;
      await client.save();
    }
    if (sender === "client") {
      const freelancer = await User.findById(sellerId);
      if (!freelancer) return res.status(404).send("Freelancer not found");
      const newFreelancerRating = ratingCalculation(
        freelancer.seller.rating,
        freelancer.seller.reviews,
        rating,
        freelancer.seller.reviews + 1
      );
      const product = await Product.findById(productId);
      const newProductRating = ratingCalculation(
        product.rating,
        product.reviews,
        rating,
        product.reviews + 1
      );
      product.reviews++;
      product.rating = newProductRating;
      if (rating === 5) product.ranking = product.ranking + 1;
      else if (rating === 1) product.ranking = product.ranking - 1;
      await product.save();
      console.log(newFreelancerRating);
      freelancer.seller.reviews++;
      freelancer.seller.rating = newFreelancerRating;
      await freelancer.save();
    }
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

const deleteReviews = async (req, res) => {
  try {
    const reviews = await Review.deleteMany();
    res.status(200).send("Reviews deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getReview,
  getReviews,
  getBuyerReviews,
  getSellerReviewsCount,
  getSellerReviews,
  getBuyerReviewsCount,
  getBuyerReviewForProject,
  getSellerReviewForProject,
  createReview,
  createReply,
  updateReview,
  deleteReview,
  deleteReviews,
};

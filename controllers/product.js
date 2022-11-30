const product = require("../models/product");
const Category = require("../models/category");
const user = require("../models/user");

const getProducts = async (req, res) => {
  try {
    const products = await product.Product.find();
    if (!products) return res.status(404).send({ error: "Product not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await product.Product.findById(id).populate(
      "owner._id",
      "profilePic name badge country emailVerified seller"
    );
    if (!p) return res.status(404).send({ error: "Product not found" });
    res.status(200).send(p);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getProductByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await product.Product.find({
      "owner._id": id,
    })
      .populate(
        "owner._id",
        "profilePic emailVerified name badge country seller"
      )
      .select("title images rating reviews ranking cost seller state");
    if (!p) return res.status(404).send({ error: "Product not found" });
    res.status(200).send(p);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      title,
      category,
      ownerId,
      tags,
      description,
      images,
      video,
      packages,
      additionalFeatures,
      questions,
      state,
    } = req.body;
    console.log(req.body);
    const owner = await user.User.findById(ownerId).select("badge");
    if (!owner) return res.status(404).send({ error: "User not found" });
    const newPakages = [];
    packages.map((p) => {
      const newFeatures = [];
      p.features.map((f) => {
        const feature = new product.Feature({
          title: f.title,
          active: f.active,
          quantity: f.quantity,
        });
        newFeatures.push(feature);
      });
      const package = new product.Package({
        name: p.name,
        cost: p.cost,
        description: p.description,
        delivery: p.delivery,
        features: newFeatures,
      });
      newPakages.push(package);
    });

    const newAdditionalFeatures = [];
    additionalFeatures.map((f) => {
      const additionalFeature = new product.AdditionalFeature({
        title: f.title,
        active: f.active,
        cost: f.cost,
      });
      newAdditionalFeatures.push(additionalFeature);
    });

    const newProduct = new product.Product({
      owner: {
        ...owner,
      },
      title,
      description,
      tags,
      images,
      videos: [video],
      category,
      cost: packages[0].cost,
      packages: newPakages,
      additionalFeatures: newAdditionalFeatures,
      questions,
      state,
    });
    newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ownerId,
      title,
      category,
      tags,
      description,
      images,
      video,
      packages,
      additionalFeatures,
      questions,
    } = req.body;
    console.log(title);
    const owner = await user.User.findById(ownerId).select("badge");
    if (!owner) return res.status(404).send({ error: "User not found" });
    const newPakages = [];
    packages.map((p) => {
      const newFeatures = [];
      p.features.map((f) => {
        const feature = new product.Feature({
          title: f.title,
          active: f.active,
          quantity: f.quantity,
        });
        newFeatures.push(feature);
      });
      const package = new product.Package({
        name: p.name,
        cost: p.cost,
        description: p.description,
        delivery: p.delivery,
        features: newFeatures,
      });
      newPakages.push(package);
    });
    const newAdditionalFeatures = [];
    additionalFeatures.map((f) => {
      const additionalFeature = new product.AdditionalFeature({
        title: f.title,
        active: f.active,
        cost: f.cost,
      });
      newAdditionalFeatures.push(additionalFeature);
    });
    const newProduct = await product.Product.findById(id);
    if (!newProduct)
      return res.status(404).send({ error: "Product not found" });
    newProduct.title = title;
    newProduct.category = category;
    newProduct.tags = tags;
    newProduct.description = description;
    newProduct.images = images;
    newProduct.videos = [video];
    newProduct.packages = newPakages;
    newProduct.additionalFeatures = newAdditionalFeatures;
    newProduct.owner = owner;
    newProduct.cost = packages[0].cost;
    newProduct.questions = questions;
    newProduct.markModified("questions");
    newProduct.markModified("packages");
    newProduct.markModified("owner");
    newProduct.markModified("additionalFeatures");
    newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await product.Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).send({ error: "Product not found" });
    res.status(200).send("Product deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const addOrderImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    const updatedProduct = await product.Product.findByIdAndUpdate(
      id,
      {
        $push: { orderImages: image },
      },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).send({ error: "Product not found" });
    res.status(200).send(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const addOrderVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { video } = req.body;
    const updatedProduct = await product.Product.findByIdAndUpdate(
      id,
      {
        $push: { orderVideos: video },
      },
      {
        new: true,
      }
    );
    if (!updatedProduct)
      return res.status(404).send({ error: "Product not found" });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const updatedProduct = await product.Product.findByIdAndUpdate(
      id,
      {
        $set: {
          state,
        },
      },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).send({ error: "Product not found" });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { review } = req.body;
    const updatedProduct = await product.Product.findByIdAndUpdate(
      id,
      {
        $inc: { reviews: review },
      },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).send({ error: "Product not found" });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const updatedProduct = await product.Product.findByIdAndUpdate(
      id,
      {
        $set: { rating },
      },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).send({ error: "Product not found" });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const updateRanking = async (req, res) => {
  try {
    const { id } = req.params;
    const { ranking } = req.body;
    const updatedProduct = await product.Product.findByIdAndUpdate(
      id,
      {
        $set: { ranking },
      },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).send({ error: "Product not found" });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySubCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log("C", req.params);
    const products = await product.Product.find({
      category,
      state: "live",
    })
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySubCategoryWithCost = async (req, res) => {
  try {
    console.log("C1", req.params);
    const { category, lowerRange, upperRange } = req.params;
    const products = await product.Product.find({
      category,
      state: "live",
      cost: {
        $gte: lowerRange,
        $lte: upperRange,
      },
    })
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySubCategoryWithBadge = async (req, res) => {
  try {
    const { category, badge } = req.params;
    console.log(category, badge);
    const products = await product.Product.find({
      category,
      state: "live",
      "owner.badge": badge,
    })
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySubCategoryWithBadge_Cost = async (req, res) => {
  try {
    const { category, badge, lowerRange, upperRange } = req.params;
    console.log(category, badge);
    const products = await product.Product.find({
      category,
      state: "live",
      "owner.badge": badge,
      cost: {
        $gte: lowerRange,
        $lte: upperRange,
      },
    })
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let subCategories = await Category.find({ category }).select("_id");

    subCategories = subCategories.map((subCategory) => subCategory._id);
    console.log(subCategories);
    let products;
    if (!subCategories) {
      products = await product.Product.find({ category, state: "live" })
        .populate("owner._id", "isOnline seller name profilePic badge")
        .select("title images rating reviews ranking cost seller")
        .sort({
          ranking: -1,
        });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    } else {
      products = await product.Product.find({
        category: { $in: subCategories },
        state: "live",
      });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getProductsByCategoryWithCost = async (req, res) => {
  try {
    const { category, lowerRange, upperRange } = req.params;
    let subCategories = await Category.find({ category }).select("_id");
    subCategories = subCategories.map((subCategory) => subCategory._id);
    console.log(subCategories);
    let products;
    if (!subCategories) {
      products = await product.Product.find({
        category,
        state: "live",
        cost: {
          $gte: lowerRange,
          $lte: upperRange,
        },
      })
        .populate("owner._id", "isOnline seller name profilePic badge")
        .select("title images rating reviews ranking cost seller")
        .sort({
          ranking: -1,
        });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    } else {
      products = await product.Product.find({
        category: { $in: subCategories },
        cost: {
          $gte: lowerRange,
          $lte: upperRange,
        },
        state: "live",
      });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsByCategoryWithBadge = async (req, res) => {
  try {
    const { category, badge } = req.params;
    console.log("t", req.params);
    let subCategories = await Category.find({ category }).select("_id");
    subCategories = subCategories.map((subCategory) => subCategory._id);
    console.log(subCategories);
    let products;
    if (!subCategories) {
      products = await product.Product.find({
        category,
        state: "live",
        "owner.badge": badge,
      })
        .populate("owner._id", "isOnline seller name profilePic badge")
        .select("title images rating reviews ranking cost seller")
        .sort({
          ranking: -1,
        });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    } else {
      products = await product.Product.find({
        category: { $in: subCategories },
        state: "live",
        "owner.badge": badge,
      });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsByCategoryWithBadge_Cost = async (req, res) => {
  try {
    const { category, badge, lowerRange, upperRange } = req.params;
    console.log(req.params);
    let subCategories = await Category.find({ category }).select("_id");
    subCategories = subCategories.map((subCategory) => subCategory._id);
    console.log(subCategories);
    let products;
    if (!subCategories) {
      products = await product.Product.find({
        category,
        state: "live",
        "owner.badge": badge,
        cost: {
          $gte: lowerRange,
          $lte: upperRange,
        },
      })
        .populate("owner._id", "isOnline seller name profilePic badge")
        .select("title images rating reviews ranking cost seller")
        .sort({
          ranking: -1,
        });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    } else {
      products = await product.Product.find({
        category: { $in: subCategories },
        state: "live",
        "owner.badge": badge,
        cost: {
          $gte: lowerRange,
          $lte: upperRange,
        },
      });
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearch = async (req, res) => {
  try {
    console.log(req.params);
    const { search } = req.params;
    const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      state: "live",
      tags: {
        $in: tags,
      },
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearchWithCost = async (req, res) => {
  try {
    const { search, lowerRange, upperRange } = req.params;
    const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    // console.log(searchTags);
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      cost: {
        $gte: lowerRange,
        $lte: upperRange,
      },
      tags: {
        $in: tags,
      },
      state: "live",
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearchWithBadge = async (req, res) => {
  try {
    const { search, badge } = req.params;
    // const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    // console.log(searchTags);
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      "ownerId.badge": badge,
      tags: {
        $in: tags,
      },
      state: "live",
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller ")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearchWithBadge_Cost = async (req, res) => {
  try {
    const { search, badge, lowerRange, upperRange } = req.params;
    const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    // console.log(searchTags);
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      "owner.badge": badge,
      cost: {
        $gte: lowerRange,
        $lte: upperRange,
      },
      state: "live",
      tags: {
        $in: tags,
      },
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearchAndSubCategory = async (req, res) => {
  try {
    const { search, category } = req.params;
    console.log(req.params);
    // const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    // console.log("S", searchTags);
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      category,
      state: "live",
      tags: {
        $in: tags,
      },
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearchAndSubCategoryWithCost = async (req, res) => {
  try {
    const { search, category, lowerRange, upperRange } = req.params;
    console.log(req.params);
    // const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    // console.log(searchTags);
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      state: "live",
      category,
      cost: {
        $gte: lowerRange,
        $lte: upperRange,
      },
      tags: {
        $in: tags,
      },
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
        cost: 1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearchAndSubCategoryWithBadge = async (req, res) => {
  try {
    const { search, category, badge } = req.params;
    // const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    // console.log(searchTags);
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      state: "live",
      "owner.badge": badge,
      category,
      tags: {
        $in: tags,
      },
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductsBySearchAndSubCategoryWithBadge_Cost = async (req, res) => {
  try {
    const { search, category, badge, lowerRange, upperRange } = req.params;
    console.log("Te", req.params);
    // const searchTags = [];
    // search.split(" ").map((e) => {
    //   searchTags.push({
    //     tags: new RegExp(e, "i"),
    //   });
    // });
    // console.log(searchTags);
    const tags = search.split(" ");
    console.log(tags);
    const products = await product.Product.find({
      state: "live",
      "owner.badge": badge,
      category,
      cost: {
        $gte: lowerRange,
        $lte: upperRange,
      },
      tags: {
        $in: tags,
      },
    })
      // .or(searchTags)
      .populate("owner._id", "isOnline seller name profilePic badge")
      .select("title images rating reviews ranking cost seller")
      .sort({
        ranking: -1,
        cost: 1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  addOrderImage,
  addOrderVideo,
  updateState,
  updateReviews,
  updateRating,
  updateRanking,
  getProduct,
  getProducts,
  getProductByUserId,
  getProductsBySubCategory,
  getProductsBySubCategoryWithCost,
  getProductsBySubCategoryWithBadge,
  getProductsBySubCategoryWithBadge_Cost,
  getProductsByCategory,
  getProductsByCategoryWithCost,
  getProductsByCategoryWithBadge,
  getProductsByCategoryWithBadge_Cost,
  getProductsBySearch,
  getProductsBySearchWithCost,
  getProductsBySearchWithBadge,
  getProductsBySearchWithBadge_Cost,
  getProductsBySearchAndSubCategory,
  getProductsBySearchAndSubCategoryWithCost,
  getProductsBySearchAndSubCategoryWithBadge,
  getProductsBySearchAndSubCategoryWithBadge_Cost,
};

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
    } = req.body;
    const owner = await user.User.findById(ownerId).select(
      "name profilePic badge"
    );
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
      packages: newPakages,
      additionalFeatures: newAdditionalFeatures,
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
    } = req.body;
    console.log(title);
    const owner = await user.User.findById(ownerId).select(
      "name profilePic badge"
    );
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

const getProductsBySubCategory = async (req, res) => {
  try {
    console.log(req.params);
    const { category } = req.params;
    const products = await product.Product.find({
      category,
      state: "live",
    })
      .populate("owner", "isOnline seller.score")
      .select("title images rating reviews")
      .sort({
        "ownerId.seller.score": 1,
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
      .select("-packages -additionalFeatures -orderImages -orderVideos")
      .sort({
        "ownerId.rating": 1,
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
    const subCategories = await Category.find({
      category,
    }).select("_id");
    console.log(subCategories);
    if (!subCategories) {
      const products = await product.Product.find({ category, state: "live" })
        .populate("ownerId")
        .select("-packages -additionalFeatures -orderImages -orderVideos");
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    } else {
      const products = await product.Product.find({
        category: { $in: subCategories },
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
    const subCategories = await Category.find({
      category,
    }).select("_id");
    console.log(subCategories);
    if (!subCategories) {
      const products = await product.Product.find({
        category,
        state: "live",
        "ownerId.badge": badge,
      })
        .populate("ownerId")
        .select("-packages -additionalFeatures -orderImages -orderVideos");
      if (!products)
        return res.status(404).send({ error: "Products not found" });
    } else {
      const products = await product.Product.find({
        category: { $in: subCategories },
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
    search.split(" ").map((e) => {
      searchTags.push(new RegExp(`/.*${e}.*/`, "i"));
    });
    console.log(searchTags);
    const products = await product.Product.find({
      tags: {
        $in: searchTags,
      },
      state: "live",
    })
      .populate("ownerId")
      .select("-packages -additionalFeatures -orderImages -orderVideos")
      .sort({
        "ownerId.score": 1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getProductsBySearchWithBadge = async (req, res) => {
  try {
    const { search } = req.params;
    const searchTags = [];
    search.split(" ").map((e) => {
      searchTags.push(new RegExp(`/.*${e}.*/`, "i"));
    });
    const products = await product.Product.find({
      tags: {
        $in: searchTags,
      },
      "ownerId.badge": badge,
      state: "live",
    })
      .populate("ownerId")
      .select("-packages -additionalFeatures -orderImages -orderVideos")
      .sort({
        "ownerId.score": 1,
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
    const searchTags = [];
    search.split(" ").map((e) => {
      searchTags.push(new RegExp(`/.*${e}.*/`, "i"));
    });
    const products = await product.Product.find({
      tags: {
        $in: searchTags,
      },
      category,
      state: "live",
    })
      .populate("ownerId")
      .select("-packages -additionalFeatures -orderImages -orderVideos")
      .sort({
        "ownerId.score": 1,
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
    const searchTags = [];
    search.split(" ").map((e) => {
      searchTags.push(new RegExp(`/.*${e}.*/`, "i"));
    });
    const products = await product.Product.find({
      tags: {
        $in: searchTags,
      },
      category,
      "ownerId.badge": badge,
      state: "live",
    })
      .populate("ownerId")
      .select("-packages -additionalFeatures -orderImages -orderVideos")
      .sort({
        "ownerId.score": 1,
      });
    if (!products) return res.status(404).send({ error: "Products not found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// search by category
// search by cost range
// search by status
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  addOrderImage,
  addOrderVideo,
  updateState,
  updateReviews,
  updateRating,
  getProducts,
  getProductsBySubCategory,
  getProductsBySubCategoryWithBadge,
  getProductsByCategory,
  getProductsByCategoryWithBadge,
  getProductsBySearch,
  getProductsBySearchWithBadge,
  getProductsBySearchAndSubCategory,
  getProductsBySearchAndSubCategoryWithBadge,
};

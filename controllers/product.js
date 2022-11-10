const product = require("../models/product");

const createProduct = async (req, res) => {
  const {
    ownerId,
    title,
    categoryId,
    images,
    video,
    description,
    packages,
    features,
    additionalFeatures,
  } = req.body;
  try {
    const newProduct = new product({
      ownerId,
      title,
      description,
      images,
      video,
      categoryId,
      packages,
      features,
      additionalFeatures,
    });
    newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const {
    ownerId,
    title,
    categoryId,
    images,
    video,
    description,
    packages,
    features,
    additionalFeatures,
  } = req.body;
  try {
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        ownerId,
        title,
        description,
        images,
        video,
        categoryId,
        packages,
        features,
        additionalFeatures,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

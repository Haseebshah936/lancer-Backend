const Category = require("../models/category");

const createCategory = async (req, res) => {
  const { title, features, additionalFeatures } = req.body;

  try {
    const category = await Category.find({
      title,
    });
    if (category) return res.status(403).send("Category already exists");
    const newCategory = new Category({
      title,
      features,
      additionalFeatures,
    });
    const result = await newCategory.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createSubCategory = async (req, res) => {
  const { title, category, features, additionalFeatures } = req.body;
  try {
    const subCategory = await Category.find({
      title,
      category,
    });
    if (subCategory) return res.status(403).send("SubCategory already exists");
    const newSubCategory = new Category({
      title,
      category,
      features,
      additionalFeatures,
    });
    const result = await newSubCategory.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCategoryTitle = async (req, res) => {
  try {
    const { id, title } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title,
      },
      {
        new: true,
      }
    );
    if (!category) return res.status(400).send("Category not exists");
    res.status(201).status(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCategoryName = async (req, res) => {
  try {
    const { id, category } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        category,
      },
      {
        new: true,
      }
    );
    if (!updatedCategory) return res.status(400).send("Category not exists");
    res.status(201).status(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addFeature = async (req, res) => {
  const { id, feature } = req.body;
  const updatedCategory = await Category.findById(id);
  updatedCategory.features.push(feature);
};

module.exports = {
  createCategory,
  createSubCategory,
  updateCategoryTitle,
  updateCategoryName,
};

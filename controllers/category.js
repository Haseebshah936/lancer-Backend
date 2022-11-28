const Category = require("../models/category");

const createCategory = async (req, res) => {
  try {
    const { title, features, additionalFeatures } = req.body;
    const category = await Category.findOne({
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

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, features, additionalFeatures } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: { title, features, additionalFeatures },
      },
      {
        new: true,
      }
    );
    if (!updatedCategory) return res.status(400).send("Category not exists");
    res.status(201).send(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ category: null });
    if (!categories) return res.status(404).send("No categories found");
    res.status(200).send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const createSubCategory = async (req, res) => {
  const { title, category, features, additionalFeatures } = req.body;
  try {
    const subCategory = await Category.findOne({
      title,
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

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, features, additionalFeatures } = req.body;
    const subCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          category,
          features,
          additionalFeatures,
        },
      },
      {
        new: true,
      }
    );

    if (!subCategory) return res.status(400).send("SubCategory not exists");
    res.status(201).send(subCategory);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getSubCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategories = await Category.find({ category: id }).populate(
      "category"
    );
    if (!subCategories) return res.status(404).send("No subCategories found");
    res.status(200).send(subCategories);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const subCategories = await Category.findById(id).populate("category");
    if (!subCategories) return res.status(404).send("No subCategories found");
    res.status(200).send(subCategories);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const category = await Category.findById(id);
    if (!category) return res.status(400).send("Category not exist");
    const result = await category.delete();
    res.status(200).send("Category deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteCategoryByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    console.log(title);
    const category = await Category.findOne({ title });
    if (!category) return res.status(400).send("Category not exist");
    const result = await category.delete();
    res.status(200).send("Category deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  getSubCategories,
  deleteCategory,
  deleteCategoryByTitle,
};

const category = require("../controllers/category");
const router = require("express").Router();

router.post("/createCategory", category.createCategory);
router.get("/categories", category.getCategories);
router.put("/updateCategory/:id", category.updateCategory);
router.post("/createSubCategory", category.createSubCategory);
router.get("/subCategories/:id", category.getSubCategories);
router.get("/subCategory/:id", category.getSubCategory);
router.put("/updateSubCategory/:id", category.updateSubCategory);
router.delete("/deleteCategory/:id", category.deleteCategory);
router.delete("/deleteCategoryByTitle/:title", category.deleteCategoryByTitle);

module.exports = router;

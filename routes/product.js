const product = require("../controllers/product");
const router = require("express").Router();

router.get("/", product.getProducts);
router.get("/:id", product.getProduct);
router.post("/createProduct", product.createProduct);
router.put("/updateProduct/:id", product.updateProduct);
router.delete("/:id", product.deleteProduct);
router.put("/addOrderImage/:id", product.addOrderImage);
router.put("/addOrderVideo/:id", product.addOrderVideo);
router.put("/updateState/:id", product.updateState);
router.put("/updateReviews/:id", product.updateReviews);
router.put("/updateRating/:id", product.updateRating);
router.put("/updateRanking/:id", product.updateRanking);
router.get(
  "/getProductBySubCategory/:category",
  product.getProductsBySubCategory
);
router.get(
  "/getProductBySubCategory/:category/:lowerRange/:upperRange",
  product.getProductsBySubCategoryWithCost
);
router.get(
  "/getProductBySubCategory/:category/:badge",
  product.getProductsBySubCategoryWithBadge
);
router.get(
  "/getProductBySubCategory/:category/:badge/:lowerRange/:upperRange",
  product.getProductsBySubCategoryWithBadge_Cost
);
router.get("/getProductByCategory/:category", product.getProductsByCategory);
router.get(
  "/getProductByCategory/:category/:lowerRange/:upperRange",
  product.getProductsByCategoryWithCost
);
router.get(
  "/getProductByCategory/:category/:badge",
  product.getProductsByCategoryWithBadge
);
router.get(
  "/getProductByCategory/:category/:badge/:lowerRange/:upperRange",
  product.getProductsBySubCategoryWithBadge_Cost
);
router.get("/getProductBySearch/:search", product.getProductsBySearch);

router.get(
  "/getProductBySearch/:search/:lowerRange/:upperRange",
  product.getProductsBySearchWithCost
);
router.get(
  "/getProductBySearch/:search/:badge",
  product.getProductsBySearchWithBadge
);
router.get(
  "/getProductBySearch/:search/:badge/:lowerRange/:upperRange",
  product.getProductsBySearchWithBadge_Cost
);
router.get(
  "/getProductBySearch/:search/:category",
  product.getProductsBySearchAndSubCategory
);
router.get(
  "/getProductBySearch/:search/:category/:lowerRange/:upperRange",
  product.getProductsBySearchAndSubCategoryWithCost
);
router.get(
  "/getProductBySearch/:search/:badge/:category",
  product.getProductsBySearchAndSubCategoryWithBadge
);
router.get(
  "/getProductBySearch/:search/:badge/:category/:lowerRange/:upperRange",
  product.getProductsBySearchAndSubCategoryWithBadge_Cost
);

module.exports = router;

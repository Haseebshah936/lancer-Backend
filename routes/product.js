const product = require("../controllers/product");
const router = require("express").Router();

router.get("/", product.getProducts);
router.get("/:id", product.getProduct);
router.get("/byUserId/:id", product.getProductByUserId);
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
  product.getProductsByCategoryWithBadge_Cost
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
  "/getProductBySearchAndSubCategory/:search/:category",
  product.getProductsBySearchAndSubCategory
);
router.get(
  "/getProductBySearchAndSubCategory/:search/:category/:lowerRange/:upperRange",
  product.getProductsBySearchAndSubCategoryWithCost
);
router.get(
  "/getProductBySearchAndSubCategory/:search/:category/:badge",
  product.getProductsBySearchAndSubCategoryWithBadge
);
router.get(
  "/getProductBySearchAndSubCategory/:search/:category/:badge/:lowerRange/:upperRange",
  product.getProductsBySearchAndSubCategoryWithBadge_Cost
);

module.exports = router;

const {
  getInvoices,
  getInvoiceByUserId,
  getInvoice,
  getInvoiceByProjectId,
  createInvoice,
  updateInvoice,
  completePayment,
  refundPayment,
  deleteInvoice,
  updateInvoiceStatus,
  payByWallet,
  buyRevision,
  deleteAllInvoices,
  createTip,
  createInvoiceAndProject,
  payByWalletAndCreateProject,
  createProjectPaymentIntent,
  getInvoiceSellerByUserId,
  getInvoiceBuyerByUserId,
} = require("../controllers/invoice");

const router = require("express").Router();

router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.get("/getInvoiceByUserId/seller/:id", getInvoiceSellerByUserId);
router.get("/getInvoiceByUserId/buyer/:id", getInvoiceBuyerByUserId);
router.get("/getInvoiceByProjectId/:id", getInvoiceByProjectId);
router.post("/", createInvoice);
router.post("/prjectIntent", createProjectPaymentIntent);
router.post("/invoiceAndProject", createInvoiceAndProject);
router.post("/payTip", createTip);
router.post("/payByWallet", payByWallet);
router.post("/payByWalletAndCreateProject", payByWalletAndCreateProject);
router.post("/buyRevision", buyRevision);
router.put("/:id", updateInvoice);
router.put("/completePayment/:id", completePayment);
router.put("/refundPayment/:id", refundPayment);
router.put("/invoiceStatus/:id", updateInvoiceStatus);
router.delete("/", deleteAllInvoices);
router.delete("/:id", deleteInvoice);

module.exports = router;

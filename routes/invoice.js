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
  createTip,
} = require("../controllers/invoice");

const router = require("express").Router();

router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.get("/getInvoiceByUserId/:userId", getInvoiceByUserId);
router.get("/getInvoiceByProjectId/:projectId", getInvoiceByProjectId);
router.post("/", createInvoice);
router.post("/payTip", createTip);
router.post("/payByWallet", payByWallet);
router.put("/:id", updateInvoice);
router.put("/completePayment/:id", completePayment);
router.put("/refundPayment/:id", refundPayment);
router.put("/updateInvoiceStatus/:id", updateInvoiceStatus);
router.delete("/:id", deleteInvoice);

const Invoice = require("../models/invoice");
const { User } = require("../models/user");

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("freelancerId employerId", "name profilePic email")
      .sort({ createdAt: -1 });
    res.status(200).send(invoices);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate(
      "freelancerId employerId projectId",
      "name profilePic email title budget state complitionDate completedAt"
    );
    if (!invoice) return res.status(404).send("Invoice not found");
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getInvoiceByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.find()
      .or([
        {
          freelancerId: id,
        },
        {
          employerId: id,
        },
      ])
      .populate(
        "freelancerId employerId projectId",
        "name profilePic email title budget state complitionDate completedAt"
      );
    if (!invoice) return res.status(404).send("Invoice not found");
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getInvoiceByProjectId = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({
      projectId: id,
    }).populate(
      "freelancerId employerId projectId",
      "name profilePic email title budget state complitionDate completedAt"
    );
    if (!invoice) return res.status(404).send("Invoice not found");
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createInvoice = async (req, res) => {
  try {
    const {
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
    } = req?.body;
    const invoice = await Invoice.findOne({
      projectId,
    });
    if (invoice) return res.status(400).send("Invoice already exists");
    const newInvoice = new Invoice({
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
    });
    await newInvoice.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTip = async (req, res) => {
  try {
    const {
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
      tip,
    } = req?.body;
    const invoice = await Invoice.findOne({
      projectId,
      tip: false,
    });
    if (!invoice) return res.status(400).send("Invoice not exist exists");
    const user = await User.findById(freelancerId);
    if (!user) return res.status(400).send("User not found");
    user.earnings += amount;
    const newInvoice = new Invoice({
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
      invoiceState: "paid",
      tip,
    });
    await newInvoice.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const payByWallet = async (req, res) => {
  try {
    const {
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
    } = req?.body;
    const invoice = await Invoice.findOne({
      projectId,
    });
    if (invoice) return res.status(400).send("Invoice already exists");
    const user = await User.findById(employerId).populate("earnings");
    if (user.earnings < amount)
      return res.status(400).send("Insufficient balance in wallet");
    const newInvoice = new Invoice({
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
    });
    await newInvoice.save();
    user.earnings -= amount;
    await user.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
      paymentStatus,
      paymentDate,
    } = req?.body;
    const invoice = await Invoice.findByIdAndUpdate(id, {
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
      paymentStatus,
      paymentDate,
    });
    if (!invoice) return res.status(400).send("Invoice not found");
    const newInvoice = new Invoice({
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      paymentNote,
    });
    await newInvoice.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceStatus } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(id, {
      invoiceStatus,
    });
    if (!invoice) return res.status(400).send("Invoice not found");
    res.status(201).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const completePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndUpdate(id, {
      paymentStatus: "paid",
    });
    if (!invoice) return res.status(400).send("Invoice not found");
    const user = await User.findById(invoice.freelancerId);
    if (!user) return res.status(400).send("User not found");
    user.earning = user.earning + invoice.amount;
    await user.save();
    res.status(201).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndUpdate(id, {
      paymentStatus: "refunded",
    });
    if (!invoice) return res.status(400).send("Invoice not found");
    const user = await User.findById(invoice.employerId);
    if (!user) return res.status(400).send("User not found");
    user.earning = user.earning + invoice.amount;
    await user.save();
    res.status(201).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) return res.status(400).send("Invoice not found");
    res.status(201).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  getInvoiceByUserId,
  getInvoiceByProjectId,
  createInvoice,
  payByWallet,
  updateInvoice,
  completePayment,
  refundPayment,
  updateInvoiceStatus,
  deleteInvoice,
};

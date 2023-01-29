const Invoice = require("../models/invoice");
const { User } = require("../models/user");
const { Product } = require("../models/product");
const Proposal = require("../models/proposal");
const { Project, Hiring, Requirenment } = require("../models/project");
const config = require("config");
const {
  sendSoftNotification,
  sendHardNotification,
} = require("../utils/notification");
const stripeSecretKey = config.get("stripeSecretKey");
const stripe = require("stripe")(stripeSecretKey);

const calculateAmount = async (productId, extras, packageSelected) => {
  const product = await Product.findById(productId);
  if (!product) return res.status(400).send("Product not found");
  const newExtras = {};
  extras.map((extra) => (newExtras[extra.title] = extra));
  const featuresList = product.additionalFeatures.filter((feature) =>
    extras.some((extra) => extra.title === feature.title)
  );
  let amount = 0;
  featuresList.forEach((feature) => {
    const extra = newExtras[feature.title];
    if (extra.quantity)
      amount += parseFloat(feature.cost) * parseInt(extra.quantity);
    // else amount += parseFloat(feature.cost);
  });
  product.packages.forEach((pack) => {
    if (pack.name === packageSelected) amount += parseFloat(pack.cost);
  });
  return amount;
};

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
    const { projectId, freelancerId, employerId, amount, paymentMethod } =
      req?.body;
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
      invoiceStatus: "recieved",
    });
    await newInvoice.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createProjectPaymentIntent = async (req, res) => {
  try {
    const {
      productId,
      extras,
      packageSelected,
      proposalId,
      freelancerId,
      employerId,
    } = req?.body;
    let amount = 0;
    if (proposalId) {
      const proposal = await Proposal.findById(proposalId);
      if (!proposal) return res.status(400).send("Proposal not found");
      amount = proposal?.budget;
    } else {
      amount = await calculateAmount(productId, extras, packageSelected);
    }
    console.log("Amount", amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      // amount_details: {
      //   "employerId": employerId,
      //   "freelancerId": freelancerId,
      //   "productId": productId,
      //   "extras": extras,
      // },
      // payment_method_types: ["card"],
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).send(paymentIntent);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const createInvoiceAndProject = async (req, res) => {
  try {
    let {
      title,
      freelancerId,
      productId,
      employerId,
      extras,
      packageSelected,
      paymentMethod,
      days,
      revisionsAllowed,
    } = req?.body;
    if (!extras) extras = [];
    const amount = await calculateAmount(productId, extras, packageSelected);
    console.log("Amount", amount);
    const hired = new Hiring({
      userId: freelancerId,
      productId,
      extras,
    });
    const newProject = new Project({
      title,
      creatorId: employerId,
      budget: amount,
      state: "requirementGathering",
      pricingType: "fixed",
      productId,
      days,
      hired,
      revisionsAllowed,
    });
    newProject.requirenments.push(new Requirenment({ state: "pending" }));
    const newInvoice = new Invoice({
      projectId: newProject._id,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      invoiceStatus: "recieved",
    });
    await newProject.save();
    await newInvoice.save();
    const client = await User.findById(newProject.creatorId);
    const freelancer = await User.findById(newProject.hired.userId);
    title = "New Order";
    const text = `A new order is placed by ${client.name}`;
    const image = freelancer.profilePic;
    if (freelancer.subscription) {
      sendSoftNotification(freelancer.subscription, title, text, image);
    }
    sendHardNotification(
      title,
      text,
      "info",
      newProject.hired.userId,
      null,
      newProject._id,
      newProject.creatorId
    );
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const createTip = async (req, res) => {
  try {
    const { projectId, freelancerId, employerId, amount, paymentMethod } =
      req?.body;
    const invoice = await Invoice.findOne({
      projectId,
      tip: false,
    });
    if (!invoice) return res.status(400).send("Invoice not exist exists");
    const user = await User.findById(freelancerId);
    if (!user) return res.status(400).send("User not found");
    user.currentBalance += amount;
    const newInvoice = new Invoice({
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      invoiceStatus: "paid",
      tip: true,
    });
    await newInvoice.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const buyRevision = async (req, res) => {
  try {
    const {
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      revisions,
    } = req?.body;
    const user = await User.findById(freelancerId);
    if (!user) return res.status(400).send("User not found");
    const project = await Project.findById(projectId);
    if (!project) return res.status(400).send("Project not found");
    project.revisionsAllowed += revisions;
    const newInvoice = new Invoice({
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      invoiceStatus: "recieved",
      revision: true,
    });
    await user.save();
    await project.save();
    await newInvoice.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const payByWalletAndCreateProject = async (req, res) => {
  try {
    let {
      title,
      freelancerId,
      employerId,
      amount,
      paymentMethod,
      productId,
      days,
      extras,
      revisionsAllowed,
    } = req?.body;
    if (!extras) extras = [];
    const hired = new Hiring({
      userId: freelancerId,
      productId,
      extras,
    });
    const user = await User.findById(employerId);
    if (user.currentBalance < amount)
      return res.status(400).send("Insufficient balance in wallet");
    const newProject = new Project({
      title,
      creatorId: employerId,
      budget: amount,
      state: "requirementGathering",
      pricingType: "fixed",
      productId,
      days,
      hired,
      revisionsAllowed,
    });
    newProject.requirenments.push(new Requirenment({ state: "pending" }));
    const newInvoice = new Invoice({
      projectId: newProject._id,
      freelancerId,
      employerId,
      amount,
      paymentMethod: "wallet",
      invoiceStatus: "recieved",
    });
    await newProject.save();
    await newInvoice.save();
    user.currentBalance -= amount;
    await user.save();
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const payByWallet = async (req, res) => {
  try {
    const { projectId, freelancerId, employerId, amount } = req?.body;
    const invoice = await Invoice.findOne({
      projectId,
    });
    if (invoice) return res.status(400).send("Invoice already exists");
    const user = await User.findById(employerId);
    console.log(user);
    if (user.currentBalance < amount)
      return res.status(400).send("Insufficient balance in wallet");
    const newInvoice = new Invoice({
      projectId,
      freelancerId,
      employerId,
      amount,
      paymentMethod: "wallet",
      invoiceStatus: "recieved",
    });
    await newInvoice.save();
    user.currentBalance -= amount;
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
      paymentDate,
      invoiceStatus,
    } = req?.body;
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      {
        projectId,
        freelancerId,
        employerId,
        amount,
        paymentMethod,
        paymentNote,
        paymentDate,
        invoiceStatus,
      },
      {
        new: true,
      }
    );
    if (!invoice) return res.status(400).send("Invoice not found");
    res.status(201).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceStatus } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      {
        invoiceStatus,
      },
      {
        new: true,
      }
    );
    if (!invoice) return res.status(400).send("Invoice not found");
    res.status(201).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

// const completePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const invoice = await Invoice.findByIdAndUpdate(
//       id,
//       {
//         invoiceStatus: "paid",
//       },
//       {
//         new: true,
//       }
//     );
//     if (!invoice) return res.status(400).send("Invoice not found");
//     const user = await User.findById(invoice.freelancerId);
//     if (!user) return res.status(400).send("User not found");
//     user.currentBalance = user.currentBalance + invoice.amount;
//     await user.save();
//     res.status(201).send(invoice);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };
const completePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({
      projectId: id,
    });
    console.log(id, invoice);
    if (!invoice) return res.status(404).send("Invoice not found");
    if (invoice.invoiceStatus === "paid") {
      return res.status(400).send("Invoice already paid");
    }
    invoice.invoiceStatus = "paid";
    await invoice.save();
    const user = await User.findById(invoice.freelancerId);
    if (!user) return res.status(400).send("User not found");
    console.log("Before", user.currentBalance);
    user.currentBalance = user.currentBalance + invoice.amount;
    await user.save();
    console.log("After", user.currentBalance);
    res.status(201).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      {
        invoiceStatus: "refunded",
      },
      {
        new: true,
      }
    );
    if (!invoice) return res.status(400).send("Invoice not found");
    const user = await User.findById(invoice.employerId);
    if (!user) return res.status(400).send("User not found");
    user.currentBalance = user.currentBalance + invoice.amount;
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
    res.status(200).send("Invoice deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteAllInvoices = async (req, res) => {
  try {
    const invoice = await Invoice.deleteMany();
    res.status(201).send("All invoices deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  getInvoiceByUserId,
  getInvoiceByProjectId,
  createProjectPaymentIntent,
  createInvoice,
  createInvoiceAndProject,
  createTip,
  payByWallet,
  payByWalletAndCreateProject,
  buyRevision,
  updateInvoice,
  completePayment,
  refundPayment,
  updateInvoiceStatus,
  deleteInvoice,
  deleteAllInvoices,
};

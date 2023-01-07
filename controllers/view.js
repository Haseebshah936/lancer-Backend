const View = require("../models/view");

const monthDays = [
  {
    month: "January",
    days: 31,
  },
  {
    month: "February",
    days: 28,
  },
  {
    month: "March",
    days: 31,
  },
  {
    month: "April",
    days: 30,
  },
  {
    month: "May",
    days: 31,
  },
  {
    month: "June",
    days: 30,
  },
  {
    month: "July",
    days: 31,
  },
  {
    month: "August",
    days: 31,
  },
  {
    month: "September",
    days: 30,
  },
  {
    month: "October",
    days: 31,
  },
  {
    month: "November",
    days: 30,
  },
  {
    month: "December",
    days: 31,
  },
];

const getViews = async (req, res) => {
  try {
    const views = await View.find();
    res.status(200).json(views);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getView = async (req, res) => {
  try {
    const { id } = req.params;
    const views = await View.findById(id);
    res.status(200).json(views);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getViewsByUserIdForYearAsBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth();
    month++;
    const monthInLastYear = 11 - month;
    const startFrom = 11 - monthInLastYear; // start from this month in last year
    const views = [];
    const promises = [];
    const monthList = [];
    /** SECTION
     * 1. Get the views for the last years months
     * 2. Put it in a promise array
     */
    if (monthInLastYear >= 0)
      for (let i = startFrom; i < 12; i++) {
        const startYear = year - 1;
        const isLeap = startYear % 4 === 0;
        const startMonth = i + 1;
        const startFrom = new Date(`${startMonth}-01-${startYear}`);
        const endAt = new Date(
          new Date(
            `${startMonth}-${monthDays[i].days + isLeap ? 1 : 0}-${startYear}`
          ).getTime() +
            24 * 60 * 60 * 1000
        );
        // console.log(startYear, startMonth, startFrom, endAt);
        monthList.push(monthDays[i].month);
        promises.push(
          await View.find({
            userId: id,
            createdAt: {
              $gte: new Date(startFrom.getFullYear(), startFrom.getMonth(), 1),
              $lt: new Date(endAt.getFullYear(), endAt.getMonth() + 1, 1),
            },
            viewer: "seller",
          }).count()
        );
      }
    /** SECTION
     * 1. Get the views for the months in current year if month is not 0
     * 2. Put it in a promise array
     */
    if (month) {
      for (let y = 0; y < month; y++) {
        const isLeap = year % 4 === 0;
        const startMonth = y + 1;
        const startFrom = new Date(`${startMonth}-01-${year}`);
        const endAt = new Date(
          new Date(
            `${startMonth}-${monthDays[y] + isLeap ? 1 : 0}-${year}`
          ).getTime() +
            24 * 60 * 60 * 1000
        );
        // console.log(year, startMonth, startFrom, endAt);
        monthList.push(monthDays[y].month);
        promises.push(
          await View.find({
            userId: id,
            createdAt: {
              $gte: new Date(startFrom.getFullYear(), startFrom.getMonth(), 1),
              $lt: new Date(endAt.getFullYear(), endAt.getMonth() + 1, 1),
            },
            viewer: "seller",
          }).count()
        );
      }
    }
    const result = await Promise.all(promises);
    for (let i = 0; i < result.length; i++) {
      views.push({
        month: monthList[i],
        views: result[i],
      });
    }
    res.status(200).json(views);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getViewsByUserIdForYearAsSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth();
    month++;
    const monthInLastYear = 11 - month;
    const startFrom = 11 - monthInLastYear; // start from this month in last year
    const views = [];
    const promises = [];
    const monthList = [];
    /** SECTION
     * 1. Get the views for the last years months
     * 2. Put it in a promise array
     */
    if (monthInLastYear >= 0)
      for (let i = startFrom; i < 12; i++) {
        const startYear = year - 1;
        const isLeap = startYear % 4 === 0;
        const startMonth = i + 1;
        const startFrom = new Date(`${startMonth}-01-${startYear}`);
        const endAt = new Date(
          new Date(
            `${startMonth}-${monthDays[i].days + isLeap ? 1 : 0}-${startYear}`
          ).getTime() +
            24 * 60 * 60 * 1000
        );
        // console.log(startYear, startMonth, startFrom, endAt);
        monthList.push(monthDays[i].month);
        promises.push(
          await View.find({
            userId: id,
            createdAt: {
              $gte: new Date(startFrom.getFullYear(), startFrom.getMonth(), 1),
              $lt: new Date(endAt.getFullYear(), endAt.getMonth() + 1, 1),
            },
            viewer: "buyer",
          }).count()
        );
      }
    /** SECTION
     * 1. Get the views for the months in current year if month is not 0
     * 2. Put it in a promise array
     */
    if (month) {
      for (let y = 0; y < month; y++) {
        const isLeap = year % 4 === 0;
        const startMonth = y + 1;
        const startFrom = new Date(`${startMonth}-01-${year}`);
        const endAt = new Date(
          new Date(
            `${startMonth}-${monthDays[y] + isLeap ? 1 : 0}-${year}`
          ).getTime() +
            24 * 60 * 60 * 1000
        );
        // console.log(year, startMonth, startFrom, endAt);
        monthList.push(monthDays[y].month);
        promises.push(
          await View.find({
            userId: id,
            createdAt: {
              $gte: new Date(startFrom.getFullYear(), startFrom.getMonth(), 1),
              $lt: new Date(endAt.getFullYear(), endAt.getMonth() + 1, 1),
            },
            viewer: "buyer",
          }).count()
        );
      }
    }
    const result = await Promise.all(promises);
    for (let i = 0; i < result.length; i++) {
      views.push({
        month: monthList[i],
        views: result[i],
      });
    }
    res.status(200).json(views);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getViewsByProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const views = await View.find({ productId: id });
    res.status(200).json(views);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createView = async (req, res) => {
  try {
    const { userId, productId, viewerId, viewer } = req.body;
    const view = new View({
      userId,
      productId,
      viewerId,
      viewer,
    });
    const newView = await view.save();
    res.status(201).json(newView);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteView = async (req, res) => {
  try {
    const { id } = req.params;
    const view = await View.findByIdAndDelete(id);
    res.status(200).json(view);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllViews = async (req, res) => {
  try {
    const views = await View.deleteMany();
    res.status(200).json("Deleted all views");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getViews,
  getView,
  getViewsByUserIdForYearAsBuyer,
  getViewsByUserIdForYearAsSeller,
  getViewsByProductId,
  createView,
  deleteView,
  deleteAllViews,
};

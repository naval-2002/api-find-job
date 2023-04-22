const Job = require("../../schema/jobSchema");
const express = require("express");
const httpStatus = require("http-status");
const userMiddleware = require("../../middleware/userMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const MonthlyJob = require("../../schema/monthlyJobs");
const dateTime = require("date-and-time");
module.exports = function jobRoutes() {
  const api = express.Router();
  api.use(userMiddleware());
  // api.use(adminMiddleware());
  api.post("/add-job", async (req, res) => {
    const now = new Date();
    const value = dateTime.format(now, "YYYY-MMM ");

    const existingMonth = await MonthlyJob.findOne({ date: value });

    if (!existingMonth) {
      const data = { date: value, count: 1 };
      await MonthlyJob.create({ ...data });
    } else {
      await MonthlyJob.findByIdAndUpdate(existingMonth._id, {
        count: existingMonth.count + 1,
      });
    }

    try {
      const jobData = req.body;

      jobData.company = jobData.company.toLowerCase();
      const { position, company, jobLocation, status, jobType } = jobData;

      const addJOB = await Job.create(jobData);
      if (!position || !company || !jobLocation || !status || !jobType) {
        return res.status(httpStatus.NOT_FOUND).json("Please fill all fields");
      }

      res.status(httpStatus.OK).json({ addJOB });
      return;
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
  });

  api.get("/", async (req, res) => {
    try {
      const query = createQuery(req.query);
      const options = createOptions({
        page: req.query.page,
        sort: req.query.sort,
      });
      console.log(query, options);
      const allJobs = await Job.find(query)
        // .sort(sorted(req.query.sort))
        .setOptions(options);
      const totalJobs = await Job.count(query);

      return res.json({ allJobs, totalJobs });
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
  });
  api.put("/editJob/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;

      if (!data.position || !data.company) {
        res.status(httpStatus.NOT_ACCEPTABLE).json("Please enter all fields");
      }
      await Job.findByIdAndUpdate(id, data);
      // const allJobs = await Job.find({});

      res.status(httpStatus.OK).json("Job update successfully");
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
  });

  api.delete("/deleteJob/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deletedUser = await Job.findByIdAndDelete(id);

      res.status(httpStatus.OK).json("Job removed successfully");
      return;
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
  });

  api.get("/stats", async (req, res) => {
    try {
      const countPending = Job.count({ status: "pending" });
      const countInterview = Job.count({ status: "interview" });
      const countDecline = Job.count({ status: "decline" });

      const counts = await Promise.all([
        countPending,
        countInterview,
        countDecline,
      ]);

      const defaultStats = {
        pending: counts[0],
        interview: counts[1],
        declined: counts[2],
      };
      let monthlyApplications = await MonthlyJob.find();

      // const {'pending', 'interview', 'decline'}= await Promise.all[
      //   job.count({status : 'pending'} ),
      //   job.count({status : 'interview'} ),job.count({status : 'decline'} ),
      // ]

      res.status(httpStatus.OK).json({ defaultStats, monthlyApplications });
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json();
    }
  });

  return api;
};

const createQuery = (query) => {
  let finalQuery = {};

  if (query && query.jobType && query.jobType !== "all") {
    finalQuery = Object.assign(finalQuery, { jobType: query.jobType });
  }
  if (query && query.status && query.status !== "all") {
    finalQuery = Object.assign(finalQuery, { status: query.status });
  }
  if (query && query.search && query.search.length) {
    finalQuery = Object.assign(finalQuery, {
      $text: { $search: query.search },
    });
  }

  return finalQuery;
};

const createOptions = (options) => {
  const defaultOptions = {
    numOfPage: 10,
    page: 0,
    sort: "latest",
    sortOrder: ["asc", "desc"],
  };

  const finalOptions = Object.assign(defaultOptions, options);

  console.log(finalOptions);
  return {
    skip: finalOptions.numOfPage * finalOptions.page,
    limit: Number(finalOptions.numOfPage),
    sort: sorted(finalOptions.sort),
  };
};
const sorted = (sort) => {
  let finalSort = {};
  if (sort === "latest") {
    finalSort = { createdAt: "desc" };
  } else if (sort === "a-z") {
    finalSort = { company: 1 };
  } else if (sort === "z-a") {
    finalSort = { company: -1 };
  }
  console.log(finalSort);
  return finalSort;
};

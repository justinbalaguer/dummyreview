const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { Schema } = mongoose;

const reviewsSchema = new Schema({
  fullname: String,
  picture_url: String
});

const ReviewsRequest = mongoose.model('ReviewsRequest', reviewsSchema, 'reviews');

router.get('/', async (req, res, next) => {
  try {
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { page = 1, limit = 10 } = req.query;
    const data = await ReviewsRequest.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ReviewsRequest.countDocuments();
    res.json({
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const rateLimit = require('express-rate-limit');

const apiLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000, // limit of each IP
  message: 'Uh oh! You have reached the maximum api call (1000 calls per day)',
  headers: true
});

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

app.get('/', apiLimit, (req, res) => {
  res.json({
    base_url: 'https://dummy-review.herokuapp.com/api/v1',
    sample_pagination: '?page=1',
    sample_limit: '?limit=10',
    sample: '?page=1&limit=10'
  });
});

app.use('/api/v1', apiLimit, api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

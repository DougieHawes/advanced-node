const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const fileupload = require('express-fileupload');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

const auth = require('./routes/auth');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
const users = require('./routes/users');

require('dotenv').config();

connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(fileupload());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
app.use(limiter);

app.use(hpp());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', auth);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
            .yellow.bold
    )
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`error: ${err.message}`.red);
    ServiceWorkerRegistration.close(() => process.exit(1));
});

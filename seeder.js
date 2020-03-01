const colors = require('colors');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const Review = require('./models/Review');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await Review.create(reviews);
        await User.create(users);

        console.log('data imported...'.green.inverse);

        process.exit();
    } catch (err) {
        console.error(err);
    }
};

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();

        console.log('data deleted...'.red.inverse);

        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}

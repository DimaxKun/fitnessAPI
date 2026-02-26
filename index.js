const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const workoutRoutes = require('./routes/workout')

const app = express();

app.use(cors());

mongoose.connect('mongodb+srv://admin:admin1234@alicluster.rzokgxg.mongodb.net/b598-s83?appName=AliCluster')

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log("We're connected to the cloud database"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes)


if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app, mongoose};
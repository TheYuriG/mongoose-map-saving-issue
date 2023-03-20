//? Comments will have different coloring when starting
//? with ? or ! if you have the Better Comments VSCode extension enabled

//? Import mongoose. I used the latest 6.x version, but the 7.x version
//? should be just fine since this wasn't listed in patch notes
const mongoose = require('mongoose');
//? Import the key from the private folder. Feel free to change
//? this to however else you do it instead
//! (Color red start)
console.log("\x1b[31mAttempting to import the mongo key on line 10 of 'index.js'");
const { mongoKey } = require('./private/keys.js');

//? Import our models
const Mini = require('./models/Mini_model.js');
const MinisMap = require('./models/MinisMap_model.js');
const MinisArray = require('./models/MinisArray_model.js');

mongoose.set('strictQuery', false);
//? Use mongoose to start the models imported from './models' and
//? connect to the database using the API key saved in './private' or somewhere else if you prefer
mongoose
	.connect(mongoKey)
	.then(async () => {
		//? Start the server
		console.log('Connected to MongoDB!\x1b[0m');
		//! (Color red end)

		//? Check if we already have enough documents on the database
		const totalDocuments = await Mini.find().countDocuments();
		//! (Color green start)
		console.log(
			'\x1b[32mYour database currently has ' +
				totalDocuments +
				' documents saved (before populating)'
		);

		//? If we have less than 20K documents saved, populate the database
		//? with documents until we get to 20K
		if (totalDocuments < 20000) {
			console.log('You have less than 20K documents, populating your database now!');
			console.log(
				'(this should take a while, so you probably want to do something useful with your time in the meantime)'
			);
			console.log(
				"I don't know the network limits of Mongo so i'm waiting for each request to finish before sending the next"
			);
			console.log(
				'If you know how many requests can be done without getting rate limited (or worse!), ' +
					'feel free to crank up with Promise.all([]) to make it go faster'
			);

			//? Create documents until we have 20K
			for (
				let documentPosition = totalDocuments;
				documentPosition < 20000;
				documentPosition++
			) {
				console.log('creating mini #' + documentPosition);
				await Mini.create({ data: 'document number ' + documentPosition });
			}
		}
		console.log('Database population completed!');

		//? Once we have 20K documents, try to save them as map and then as array
		const aVeryLargeNumberOfMiniDocuments = await Mini.find();
		//! (Color green end)
		console.log(
			'Fetched all Mini documents, total count: ' +
				aVeryLargeNumberOfMiniDocuments.length +
				'\x1b[0m'
		);
	})
	.catch(() => {
		console.log('Error connecting to MongoDB');
		throw Error();
	});

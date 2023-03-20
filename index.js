//? Comments will have different coloring when starting
//? with ? or ! if you have the Better Comments VSCode extension enabled

//? Import mongoose. I used the latest 6.x version, but the 7.x version
//? should be just fine since this wasn't listed in patch notes
const mongoose = require('mongoose');
//? Import the key from the private folder. Feel free to change
//? this to however else you do it instead

//? Check for node arguments to see if the user chose to debug without console colors
//! This will run with "node index.js colorless" or "npm run colorless"
const colorless = process.argv.slice(2)[0] == 'colorless';

//! (Color red start)
console.log(
	(colorless ? '' : '\x1b[31m') + "Attempting to import the mongo key on line 10 of 'index.js'"
);
const { mongoKey } = require('./private/keys.js');
console.time('Connection');

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
		console.timeEnd('Connection'); //! 2.669s
		console.log('Connected to MongoDB!\x1b[0m');
		//! (Color red end)

		//? Check if we already have enough documents on the database
		console.time('Populating documents');
		const totalDocuments = await Mini.find().countDocuments();
		//! (Color green start)
		console.log(
			(colorless ? '' : '\x1b[32m') +
				'Your database currently has ' +
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
		console.timeEnd('Populating documents'); //! 0.362s

		//? Once we have 20K documents, try to save them as map and then as array
		console.time('Fetching documents');
		const aVeryLargeNumberOfMiniDocuments = await Mini.find(); // Add this to stripe down all useless data if you want: .select('-createdAt updatedAt -__v -data');
		console.timeEnd('Fetching documents'); //! 6.870s
		console.log(
			'Fetched all Mini documents, total count: ' +
				aVeryLargeNumberOfMiniDocuments.length +
				'\x1b[0m'
		);
		//! (Color green end)

		//! Map version start
		//! (Color magenta start)
		console.time('Map Process');
		console.log(
			(colorless ? '' : '\x1b[35m') +
				'Starting the process of mapping all minis and timing it'
		);
		const futureMapOfMinis = [];
		//? Loop through all found Mini documents and creates an array
		//? for them, which we gonna sort before storing
		console.time('Iterating through all minis');
		for (
			let miniPosition = 0;
			miniPosition < aVeryLargeNumberOfMiniDocuments.length;
			miniPosition++
		) {
			futureMapOfMinis.push([
				aVeryLargeNumberOfMiniDocuments[miniPosition].id,
				{
					miniID: aVeryLargeNumberOfMiniDocuments[miniPosition]._id,
					timestamp: Math.floor(Math.random() * 100000),
				},
			]);
		}
		console.timeEnd('Iterating through all minis'); //! 0.163s

		console.time('Sorting all minis');
		futureMapOfMinis.sort((a, b) => (a[1].timestamp > b[1].timestamp ? 1 : -1));
		console.timeEnd('Sorting all minis'); //! 0.017s

		//? Create a new Map
		console.time('Creating and populating Map of Minis');
		const mapOfMinis = new Map();
		for (let minisIndex = 0; minisIndex < futureMapOfMinis.length; minisIndex++) {
			mapOfMinis.set(futureMapOfMinis[minisIndex][0], futureMapOfMinis[minisIndex][1]);
		}
		console.timeEnd('Creating and populating Map of Minis'); //! 0.015s

		console.time('Saving Map of Minis to MongoDB using Mongoose');
		await MinisMap.create({ mini: mapOfMinis });
		console.timeEnd('Saving Map of Minis to MongoDB using Mongoose'); //! 5min43sec674ms
		console.timeEnd('Map Process'); //! 5min43sec873ms --- nearly the same time as saving!
		console.log('Saved Minis Map successfully!\x1b[0m');
		//! (Color magenta end)
		//! Map version end

		//! Array version
		//! (Color cyan start)
		console.time('Array Process');
		console.log((colorless ? '' : '\x1b[36m') + 'Creating Array of Minis now!');
		console.time('Populating Array of Minis');
		const arrayOfMinis = [];

		//? Loop through all found Mini documents and creates an Array for them
		for (
			let miniPosition = 0;
			miniPosition < aVeryLargeNumberOfMiniDocuments.length;
			miniPosition++
		) {
			arrayOfMinis.push({
				miniID: aVeryLargeNumberOfMiniDocuments[miniPosition]._id,
				timestamp: Math.floor(Math.random() * 100000),
			});
		}
		console.timeEnd('Populating Array of Minis'); //! 0.053s

		console.time('Sorting Array of Minis');
		const sortedMinisArray = arrayOfMinis.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
		console.timeEnd('Sorting Array of Minis'); //! 0.013ms

		console.time('Saving Array of Minis');
		await MinisArray.create({ mini: sortedMinisArray });
		console.timeEnd('Saving Array of Minis'); //! 5.836s
		console.timeEnd('Array Process'); //! 5.912s --- also nearly the same time as saving!
		console.log('Finished saving the array!\x1b[0m');
		//! (Color cyan end)
		//! Array version end

		//? Added this utility here to wipe your Maps and Arrays databases if you need it
		// await MinisMap.deleteOne({});
		// await MinisArray.deleteOne({});
	})
	.catch(() => {
		console.log('Error connecting to MongoDB');
		throw Error();
	});

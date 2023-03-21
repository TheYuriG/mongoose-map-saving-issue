//? Import our models
const MinisMap = require('../../models/MinisMap_model.js');

//? Create and save the Map of minis (very long process)
const createMapOfMinis = async (aVeryLargeNumberOfMiniDocuments, colorless = false) => {
	return new Promise(async (resolve, reject) => {
		try {
			//? Check if you edited the index file and stopped passing the proper
			//? data array to this Promise
			if (!aVeryLargeNumberOfMiniDocuments) {
				const error = new Error(
					'You have not passed a proper array of Minis to the Maps Promise!'
				);
				throw error;
			}

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

			//? Sort all minis by timestamp before converting the array into a Map
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

			//? Save the Map of Minis to the database (very long process)
			console.time('Saving Map of Minis to MongoDB using Mongoose');
			await MinisMap.create({ mini: mapOfMinis });
			console.timeEnd('Saving Map of Minis to MongoDB using Mongoose'); //! 5min43sec674ms
			console.timeEnd('Map Process'); //! 5min43sec873ms --- nearly the same time as saving!
			console.log('Saved Minis Map successfully!\x1b[0m');

			//? Resolve the promise and complete this step
			resolve('Success!');
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

module.exports = { createMapOfMinis };

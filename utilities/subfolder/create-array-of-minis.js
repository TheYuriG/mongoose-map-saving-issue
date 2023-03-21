//? Import our models
const MinisArray = require('../../models/MinisArray_model.js');

//? Create and save the Array of Minis as a promise
const createArrayOfMinis = async (aVeryLargeNumberOfMiniDocuments, colorless = false) => {
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

			//? Sort the array by timestamp
			console.time('Sorting Array of Minis');
			const sortedMinisArray = arrayOfMinis.sort((a, b) =>
				a.timestamp < b.timestamp ? 1 : -1
			);
			console.timeEnd('Sorting Array of Minis'); //! 0.013ms

			//? Save the array to the database
			console.time('Saving Array of Minis');
			await MinisArray.create({ mini: sortedMinisArray });
			console.timeEnd('Saving Array of Minis'); //! 5.836s
			console.timeEnd('Array Process'); //! 5.912s --- also nearly the same time as saving!
			console.log('Finished saving the array!\x1b[0m');

			//? Resolve the promise and complete this step
			resolve('Success!');
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

module.exports = { createArrayOfMinis };

//? Import our models
const Mini = require('../../models/Mini_model.js');

const processData = async (colorless = false) => {
	return new Promise(async (resolve, reject) => {
		try {
			//? Check if we already have enough documents on the database
			console.time('Populating documents');
			const totalDocuments = await Mini.find().countDocuments();
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

			//? Once we have 20K documents, we can try to save them as map and then as array
			console.time('Fetching documents');
			const aVeryLargeNumberOfMiniDocuments = await Mini.find(); // Add this to stripe down all useless data if you want: .select('-createdAt updatedAt -__v -data');
			console.timeEnd('Fetching documents'); //! 6.870s
			console.log(
				'Fetched all Mini documents, total count: ' +
					aVeryLargeNumberOfMiniDocuments.length +
					'\x1b[0m'
			);

			//? Return the array of 20K documents to be used in the other functions
			resolve(aVeryLargeNumberOfMiniDocuments);
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

module.exports = { processData };

//? Import our models
const MinisArray = require('../../models/MinisArray_model.js');

const createArrayOfMinis = async () => {
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
};

module.exports = { createArrayOfMinis };

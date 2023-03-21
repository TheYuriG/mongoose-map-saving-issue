//? Comments will have different coloring when starting
//? with ? or ! if you have the Better Comments VSCode extension enabled

//? Import mongoose. I used the latest 6.x version, but the 7.x version
//? should be just fine since this wasn't listed in patch notes
const mongoose = require('mongoose');
//? Import our utilities
const { processData, createMapOfMinis, createArrayOfMinis } = require('./utilities/functions.js');
//? Check for node arguments to see if the user chose to debug without console colors
//! This will run with "node index.js colorless" or "npm run colorless"
const colorless = process.argv.slice(2)[0] == 'colorless';

console.log((colorless ? '' : '\x1b[31m') + "Attempting to import the mongo key'");
//? Import the key from the private folder. Feel free to change
//? this to however else you do it instead
const { mongoKey } = require('./private/keys.js');
console.time('Connection');

mongoose.set('strictQuery', false);
//? Use mongoose to start the models imported from './models' and
//? connect to the database using the API key saved in './private' or somewhere else if you prefer
mongoose
	.connect(mongoKey)
	.then(async () => {
		//? Start the server
		console.timeEnd('Connection'); //! 2.669s
		console.log('Connected to MongoDB!\x1b[0m');

		//? Process the 20K documents
		const data = await processData(colorless);

		//! Map version of our Minis subdocuments Schema
		await createMapOfMinis(data, colorless);

		//? Array version of our Minis subdocuments Schema
		await createArrayOfMinis(data, colorless);

		//? Added this utility here to wipe your Maps and Arrays databases if you need it
		// await Promise.all([MinisMap.deleteOne({}), MinisArray.deleteOne({})]);

		//? Wrap up and end the script with a success code
		process.exit(0);
	})
	.catch(() => {
		console.log('Error connecting to MongoDB or processing the data!\x1b[0m');
		throw Error();
	});

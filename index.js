//? Comments will have different coloring when starting
//? with ? or ! if you have the Better Comments VSCode extension enabled

//? Import mongoose. I used the latest 6.x version, but the 7.x version
//? should be just fine since this wasn't listed in patch notes
const mongoose = require('mongoose');
//? Import the key from the private folder. Feel free to change
//? this to however else you do it instead
console.log("Attempting to import the mongo key on line 9 of 'index.js'");
const { mongoKey } = require('./private/keys.js');

mongoose.set('strictQuery', false);
//? Use mongoose to start the models imported from './models' and
//? connect to the database using the API key saved in './private' or somewhere else if you prefer
mongoose
	.connect(mongoKey)
	.then(() => {
		//? Start the server
		console.log('Connected to MongoDB! Server is online!');
	})
	.catch(() => {
		console.log('Error connecting to MongoDB');
		throw Error();
	});

//? Import mongoose to handle MongoDB
const mongoose = require('mongoose');
//? Import Schema from mongoose so we can define a data Schema
const Schema = mongoose.Schema;

//? Create the data structure
const mini = new Schema(
	{
		//? Mini reference
		data: { type: String, required: true },
	},
	//? Automatic creation of timestamps for creation and updating.
	//? This will be created on the background by the package
	{ timestamps: true }
);

//? Export this model so it can be used by other parts of our app
module.exports = mongoose.model('Mini', mini);

//? Import mongoose to handle MongoDB
const mongoose = require('mongoose');
//? Import Schema from mongoose so we can define a data Schema
const Schema = mongoose.Schema;

//? Create the data structure
const minisMap = new Schema(
	{
		//? Mini reference
		mini: {
			type: Map,
			of: new Schema({
				//? Mini ID
				miniID: { type: Schema.Types.ObjectId, ref: 'Mini', required: true },
				//? Timestamp as number
				timestamp: { type: Number, required: true },
			}),
		},
	},
	//? Automatic creation of timestamps for creation and updating.
	//? This will be created on the background by the package
	{ timestamps: true }
);

//? Export this model so it can be used by other parts of our app
module.exports = mongoose.model('MinisMap', minisMap);

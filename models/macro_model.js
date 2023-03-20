//? Import mongoose to handle MongoDB
const mongoose = require('mongoose');
//? Import Schema from mongoose so we can define a data Schema for the DLC Packs
const Schema = mongoose.Schema;

//? Create the data structure for DLC Packs
const gameContentPack = new Schema(
	{
		//? Game reference
		mini: { type: Map, of: Schema.Types.ObjectId, ref: 'Game', required: true },
	},
	//? Automatic creation of timestamps for creation and updating.
	//? This will be created on the background by the package
	{ timestamps: true }
);

//? Export this model so it can be used by other parts of our app
module.exports = mongoose.model('ContentPack', gameContentPack);

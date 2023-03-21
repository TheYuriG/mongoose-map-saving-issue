# Simple reproduction script to reproduce bug reported at Mongoose issues #5925 and #13191

Clone repository, then either edit your `mongoKey` into the `index.js` file or add a `mongoKey.js` file to `/private` so it can be imported by the `index.js` file.

Once that's done, you can either use `npm start` to start the script in colored mode or `npm run colorless` to use colorless mode.

All major steps are color-coded, if you choose to retain the colors, so you can more easily visually parse the information.

The script will connect to a database using the provided key and create 20K documents called Minis that only have a small `String` and a `Number`, then use those to sort and create a Map and an Array version of those document IDs, sorted by the numerical timestamp value.

## Improving this script

There are a few things that this script did not attempt in order to be more efficient, as it was simply meant to be a proof of concept of the reported bug:

-   Optmizing the creation of the Mini documents on `/utilities/subfolder/process-data.js`. It's probably very possible to create the documents at a faster pace than one at a time while still respecting MongoDB's document creation ratio. I didn't try to make this faster as I don't know the limits for connections, but you can feel free to do so if you do know them.
-   Arrays are sorted by timestamp before getting saved to the database. Maps are also initially created as Arrays, then sorted, then turned into Maps before being saved to the database. Probably none of this is actually necessary to reproduce the bug, as sorting probably doesn't impact the performance at all, but I wanted to show my personal experience with it, in case these steps **DO** matter. Feel free to strip those lines of code if you feel like they aren't important.
-   The Mini documents will also return a lot of useless information like `__v`, `createdAt`, `updatedAt` and `data`, none of which are taken in consideration when sorting or saving the arrays. You can feel free to strip those from the `Mini.find()` request, if you wish. In fact, I've already added that portion of the `.select()` method to the code, but commented out. All you need to do is uncommenting it to have your response become slightly faster.
-   I've added some commented out code to wipe the Maps and Arrays created through this process on `index.js`, in case you want to wipe out the created Maps and Arrays without having to manually do so yourself. There is no code for wiping all the 20K documents though, but you can easily add that too. Since creating the Minis take so long, I chose to not include it (not even in commented out form), afraid that someone would just uncomment that part too without paying attention and be forced to create the 20K documents from scratch again. Just trying to avoid giving people enough rope to hang themselves.
-   I haven't tested if there is a number of documents that causes this issue or if this issue is compounding and only gets worse the larger your map is. You can easily tweak the code at `/utilities/process-data.js` to create/return less documents and try a lower number, if you feel like it.

## Comparison

Just for the sake of comparison, I'll list here my output so you can compare with yours and check for a pattern:

![](https://img.shields.io/badge/-Attempting%20to%20import%20the%20mongo%20key-red) <br />
![](https://img.shields.io/badge/-Connection%3A%202.068s-red) <br />
![](https://img.shields.io/badge/-Connected%20to%20MongoDB!-red) <br />
![](<https://img.shields.io/static/v1?label=&message=Your%20database%20currently%20has%2020000%20documents%20saved%20(before%20populating)&color=yellowgreen>) <br />
![](https://img.shields.io/badge/-Populating%20documents%3A%20551.926ms-yellowgreen) <br />
![](https://img.shields.io/badge/-Fetching%20documents%3A%206.460sdocuments%3A%20551.926ms-yellowgreen) <br />
![](https://img.shields.io/badge/-Fetched%20all%20Mini%20documents%2C%20total%20count%3A%2020000-yellowgreen) <br />
![](https://img.shields.io/badge/-Starting%20the%20process%20of%20mapping%20all%20minis%20and%20timing%20it-pink) <br />
![](https://img.shields.io/badge/-Iterating%20through%20all%20minis%3A%20160.904ms-pink) <br />
![](https://img.shields.io/badge/-Sorting%20all%20minis%3A%2017.813ms-pink) <br />
![](https://img.shields.io/badge/-Creating%20and%20populating%20Map%20of%20Minis%3A%2012.531ms-pink) <br />
![](<https://img.shields.io/badge/-Saving%20Map%20of%20Minis%20to%20MongoDB%20using%20Mongoose%3A%206%3A06.078%20(m%3Ass.mmm)-pink>) <br />
![](<https://img.shields.io/badge/-Map%20Process%3A%206%3A06.274%20(m%3Ass.mmm)-pink>) <br />
![](https://img.shields.io/badge/-Saved%20Minis%20Map%20successfully!-pink) <br />
![](https://img.shields.io/badge/-Creating%20Array%20of%20Minis%20now!-blue) <br />
![](https://img.shields.io/badge/-Populating%20Array%20of%20Minis%3A%2038.974ms-blue) <br />
![](https://img.shields.io/badge/-Sorting%20Array%20of%20Minis%3A%2027.25ms-blue) <br />
![](https://img.shields.io/badge/-Saving%20Array%20of%20Minis%3A%205.648s-blue) <br />
![](https://img.shields.io/badge/-Array%20Process%3A%205.717s-blue) <br />
![](https://img.shields.io/badge/-Finished%20saving%20the%20array!-blue) <br />

### Closing notes

There are quite a few things that could have been done different or better, but I'm not going to optimize the hell out of a bug reproduction script. If you feel like contributing to this repository in a way that won't change the original bug reproduction experience (like making a separate `npm run` script), feel free to do so and make a Pull Request, I'll happily merge it.

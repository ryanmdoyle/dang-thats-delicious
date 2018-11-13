const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFiler: function(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That file type is not allowed!"}, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: "Edit Store"});
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  //check if there is no new file
  if (!req.file) { 
    next();  //skip to next middleware
    return;  //exit if
  }
  const extension = req.file.mimetype.split('/')[1]; //get extension from file mimetype
  req.body.photo = `${uuid.v4()}.${extension}`; //uses uuid to give a unique name, then appends extension
  // now we resize photo
  const photo = await jimp.read(req.file.buffer); //reads the buffer, which is the photo
  await photo.resize(800, jimp.AUTO); //when file is read it resizes
  await photo.write(`./public/uploads/${req.body.photo}`) //when photo is resized it uploads to public folder
  next(); //moves on to next middleware!
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save(); //save the store to db and returns the store, or error
  req.flash('success', `Successfully created ${store.name}. Would you like to leave a review?`)
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  console.log(stores);
  res.render('stores', { title: "Stores", stores: stores })
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id })
  res.render('editStore', { title: `Edit ${store.name}`, store}) //store is really like {store: store} but in es6 you can just put name
}

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, //returns a new store instread of a new one
    runValidators: true
  }).exec();
  req.flash('Success', `Successfully updated ${store.name}. <a href="/store/${store.slug}">View store -></a>`);
  res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => { //need next so you can pass on to a middleware after routes if there is no store.
  const store = await Store.findOne({ slug: req.params.slug});
  if (!store) return next(); // if there is no store, it will pass on to the next app.use middleware (error handler).
  res.render('store', { title: `${store.name}`, store: store });
}

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true }; //Uses tag param, unless it does not exits, then it gets all stores where any tag exists
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags : tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]); //awaits all the things in the array (so it does both async, but wait until both return on their own)
  // above uses es6 destructuring to immediately assign all the results in the following array to variables.
  res.render('tags', { tag, tags, stores }); //same as { tag: tag, tags: tags, stores: stores}
}
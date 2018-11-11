const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: "Edit Store"});
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
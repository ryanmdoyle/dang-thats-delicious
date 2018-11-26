const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date, 
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "You must supply an author!"
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: "You must supply a store!"
  },
  text: {
    type: String,
    required: 'Your review must have text!'
  },
  rating: {
    type: Number,
    min: 1, 
    max: 5
  }
});

function autopopulate(next) { //a function to populate the author field, using the .populate method on the model
  this.populate('author');
  next();
}

reviewSchema.pre('find', autopopulate); //these run the autopopulate "hooks" whenever find or findOne is run on this schema
reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model("Review", reviewSchema);
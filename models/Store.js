const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name.'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!' // This sets the value to true, and gives a response if it shows as false
    }],
    address: {
      type: String,
      required: "You must supply an address!"
    }
  }
});

storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next(); //skip if not modified
    return; //exit the function
  }
  this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model('Store', storeSchema);
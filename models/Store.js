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
  },
  photo: String
});

storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); //skip if not modified
    return; //exit the function
  }
  this.slug = slug(this.name);
  //find other store that have similar names
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i'); //regext to check for store-1, store-2, etc.
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx }); // creates array of store with a store-1, store-2, etc. end
  if(storesWithSlug.length) { //if the above array has a length, there are multiple stores with the name and it needs to be appended
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }
  next(); //go on to next middleware
})

module.exports = mongoose.model('Store', storeSchema);
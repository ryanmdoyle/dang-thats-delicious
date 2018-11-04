import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import slug from 'slugs';

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
  tags: [String]
})

storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next(); //skip if not modified
    return; //exit the function
  }
  this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model('Store', storeSchema);
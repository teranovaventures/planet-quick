const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['coordinator', 'volunteer'], default: 'volunteer' },
});

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'live', 'completed'], default: 'pending' },
});

const shoppingListSchema = new mongoose.Schema({
  listName: { type: String, required: true },
  hashtag: { type: String },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
});

const invitationSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = { User, Event, ShoppingList, Invitation };
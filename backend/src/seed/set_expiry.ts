import mongoose from 'mongoose';
const Membership = require('../models/Membership');
const User = require('../models/User');

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gymflow');
    const user = await User.findOne({ email: 'member@gymflow.com' });
    if (user) {
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
      
      await Membership.findOneAndUpdate(
        { memberId: user._id },
        { endDate: twoDaysFromNow, status: 'active' }
      );
      console.log('Successfully set membership expiry to exactly 2 days from now!');
    } else {
      console.log('User member@gymflow.com not found.');
    }
  } catch (err: any) {
    console.error(err);
  }
  process.exit(0);
};

run();

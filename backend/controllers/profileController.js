const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dbConfig = require('../config/dbConfig');

exports.getData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('111111111111')
    const { name, gender, phone, status, date } = req.body;
    const userId = req.user.id;
    console.log('222222222222')
    await User.update({ id: userId }, { name, gender, phone, status, date });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password does not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update({ id: userId }, { password: hashedPassword });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.deleteOne({ id: userId })
    .then((affectedRows) => {
      if (affectedRows === 0) {
        console.log('User not found');
      } else {
        console.log('User deleted successfully');
      }
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

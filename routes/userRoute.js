const express = require('express');
const router = express.Router();
const model = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

router.post(
  '/',
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'password should be more than 6 characters').isLength({
      min: 6
    })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    let user = await model.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'user already exists' });
    }
    user = await new model({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const payLoad = {
      user: {
        id: user.id
      }
    };
    jwt.sign(
      payLoad,
      process.env.JWT_SECRET,
      { expiresIn: 36000 },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({ token });
      }
    );
  }
);

module.exports = router;

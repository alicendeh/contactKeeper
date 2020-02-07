const express = require('express');
const router = express.Router();
const model = require('../model/userModel');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

router.post(
  '/',
  [
    check('email', 'email is required').isEmail(),
    check('password', 'password must match').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await model.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'invalid Credentials' });
      }
      const isMatch = bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(400).json({ message: 'invalid Credentials' });
      }
      res.send('het there good credentials');

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
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = router;

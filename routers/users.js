const express = require('express');
const router = express.Router();
const User = require('../models/user');
// for password encryption :
const bcrypt = require('bcryptjs');
// for logging authnication :
const jwt = require('jsonwebtoken');

//getting data from dataBase :

router.get('/', async (req, res) => {
   const userList = await User.find().select('-passwordHash'); // excluding password
   res.send(userList);
});
// getting asingle user :
router.get('/:id', async (req, res) => {
   const user = await User.findById(req.params.id); // selecting only some details
   if (!user) return res.status(400).send('error');
   else return res.status(200).send(user);
});

// posting/registering a user :

router.post('/', async (req, res) => {
   const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password), // passsword encryption
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      isAdmin: req.body.isAdmin,
   });
   const user = await newUser.save();

   if (!user) return res.status(400).send('error');
   else return res.status(200).send(user);
});

// udpdating an existing user :
router.put('/:id', async (req, res) => {
   // updating the user without giving a new password:
   const userExist = await User.findById(req.params.id);
   let newPassword;
   if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password); // passsword encryption
   } else {
      newPassword = userExist.passwordHash;
   }

   const user = await User.findByIdAndUpdate(
      req.params.id,
      {
         name: req.body.name,
         email: req.body.email,
         passwordHash: newPassword,
         phone: req.body.phone,
         street: req.body.street,
         apartment: req.body.apartment,
         city: req.body.city,
         zip: req.body.zip,
         country: req.body.country,
         isAdmin: req.body.isAdmin,
      },
      { new: true }
   );
   if (!user) return res.status(400).send('error');
   else return res.status(200).send(user);
});

// login authincation :
router.post('/login', async (req, res) => {
   const user = await User.findOne({ email: req.body.email });
   if (!user) {
      return res.status(400).send('User is not found');
   }
   if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
         {
            userID: user.id,
            admin: user.isAdmin,
         },
         'secret', // creating token for a user
         {
            expiresIn: '1d',
         }
      );
      return res.status(200).send({ user: user.email, token: token });
   } else return res.status(400).send('Password is inncorrect');
});
// Deleting a user :
router.delete('/:id', async (req, res) => {
   User.findByIdAndRemove(req.params.id)
      .then((user) => {
         if (!user) {
            res.status(400).send('not found');
         } else {
            res.status(200).send('nice');
         }
      })
      .catch((err) => {
         res.status(404).json('worng action');
      });
});
module.exports = router;

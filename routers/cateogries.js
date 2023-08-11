const express = require('express');
const router = express.Router();
const Cateogry = require('../models/cateogry');

// Getting data from dataBase :
router.get('/', async (req, res) => {
   const cateogryList = await Cateogry.find();
   res.send(cateogryList);
});
// getting data By ID :
router.get('/:id', async (req, res) => {
   const category = await Cateogry.findById(req.params.id);

   if (!category) {
      res.status(505).json('not Found');
   } else {
      res.status(200).send(category);
   }
});

// adding data to DataBase :
router.post('/', async (req, res) => {
   let cateogry = new Cateogry({
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
      image: req.body.image,
   });
   cateogry = await cateogry.save();
   if (!cateogry) {
      res.status(404).send('catogry failed');
   } else {
      res.send(cateogry);
   }
});

// Updating an existing data :
router.put('/:id', async (req, res) => {
   const cateogry = await Cateogry.findByIdAndUpdate(
      req.params.id,
      {
         name: req.body.name,
         color: req.body.color,
         icon: req.body.icon,
         image: req.body.image,
      },
      {
         new: true,
      }
   );
   if (!cateogry) {
      res.status(404).send('catogory failed');
   } else {
      res.send(cateogry);
   }
});

// Deleting data By ID :

router.delete('/:id', (req, res) => {
   Cateogry.findByIdAndRemove(req.params.id)
      .then((cateogry) => {
         if (cateogry) {
            res.status(200).json('deleteed !!');
         } else {
            res.status(404).json('not found');
         }
      })
      .catch((err) => {
         res.send(err);
      });
});

module.exports = router;

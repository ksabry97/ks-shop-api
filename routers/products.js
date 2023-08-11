const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');
const Cateogry = require('../models/cateogry');
const multer = require('multer');
// validating the images format :
const file_Type = {
   'image/png': 'png',
   'image/jpg': 'jpg',
   'image/jpeg': 'jpeg',
};
// Renaming the file with unique name using middlware :
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      const isValid = file_Type[file.mimetype];
      let uploadError = new Error('image format is not supported');
      if (isValid) {
         uploadError = null;
      }
      cb(uploadError, 'public/uploads');
   },
   filename: function (req, file, cb) {
      const fileName = file.originalname.replace(' ', '-');
      const extension = file_Type[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
   },
});

const upload = multer({ storage: storage });

//getting data By ID :
router.get('/:id', async (req, res) => {
   const product = await Product.findById(req.params.id).populate('category'); // showing details or a refernce scheme
   if (!product) {
      return res.status(400).send('product is not found');
   } else {
      return res.status(200).send(product);
   }
});
// posting data to dataBase:
router.post(`/`, upload.single('image'), async (req, res) => {
   const category = await Cateogry.findById(req.body.category);
   if (!category) {
      return res.status(400).send('cateogry is not found');
   }
   const file = req.file;
   if (!file) {
      return res.status(400).send('no image submitted'); // throwing error when no image filed
   }
   const fileName = req.file.filename;
   const path = `${req.protocol}://${req.get('host')}/public/uploads/`;
   let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${path}${fileName}`,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
   });
   product = await product.save();
   if (!product) {
      res.status(404).send('not accptable format');
   } else {
      res.status(200).send(product);
   }
});

// updating an existing product :
router.put('/:id', upload.single('image'), async (req, res) => {
   const category = await Cateogry.findById(req.body.category);
   if (!category) {
      return res.status(400).send('cateogry is not found');
   }
   const product = await Product.findById(req.params.id);
   if (!product) {
      return res.status(400).send('product is not found');
   }
   const file = req.file;
   let imagePath;

   if (file) {
      const fileName = req.file.filename;
      const path = `${req.protocol}://${req.get('host')}/public/uploads/`;
      imagePath = `${path}${fileName}`;
   } else {
      imagePath = product.image;
   }
   const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
         name: req.body.name,
         description: req.body.description,
         richDescription: req.body.richDescription,
         image: imagePath,
         images: req.body.images,
         brand: req.body.brand,
         price: req.body.price,
         category: req.body.category,
         countInStock: req.body.countInStock,
         rating: req.body.rating,
         isFeatured: req.body.isFeatured,
         dateCreated: req.body.dateCreated,
      },
      { new: true }
   );
   if (!product) {
      return res.status(400).send('product is not found');
   } else {
      res.status(200).send(product);
   }
});

// Deleting a product :
router.delete('/:id', async (req, res) => {
   Product.findByIdAndRemove(req.params.id)
      .then((product) => {
         if (!product) {
            res.status(400).send('not found');
         } else {
            res.status(200).send('nice');
         }
      })
      .catch((err) => {
         res.status(404).json('worng action');
      });
});

// getting number of products :
router.get('/get/counts', async (req, res) => {
   Product.countDocuments()
      .then((count) => {
         if (!count) return res.status(400).send('errrrror');
         else
            return res.status(200).send({
               count: count,
            });
      })
      .catch((err) => {
         console.log(err);
      });
});
// getting only featured products :
router.get('/get/featured/:count', async (req, res) => {
   const count = req.params.count ? req.params.count : 0;
   const product = await Product.find({ isFeatured: true }).limit(+count);

   if (!product) {
   } else {
      return res.status(200).send(product);
   }
});

// filtering products by cateogries :
router.get('/', async (req, res) => {
   let filter = {};
   let product = '';

   if (req.query.categories) {
      filter = { category: req.query.categories.split(',') };
      product = await Product.find(filter).populate('category');
   } else {
      product = await Product.find().populate('category');
   }
   if (!product) {
      return res.status(400).send('product is not found');
   } else {
      
      return res.status(200).send(product);
   }
});

// updating the gallery for a product :
router.put(
   '/gallery-images/:id',
   upload.array('images', 10),
   async (req, res) => {
      let imagePaths = [];
      const files = req.files;
      const path = `${req.protocol}://${req.get('host')}/public/uploads/`;
      if (files) {
         files.map((file) => {
            imagePaths.push(`${path}${file.filename}`);
         });
      }

      const product = await Product.findByIdAndUpdate(
         req.params.id,
         {
            images: imagePaths,
         },
         { new: true }
      );
      if (!product) {
         return res.status(400).send('product is not found');
      } else {
         res.status(200).send(product);
      }
   }
);
module.exports = router;

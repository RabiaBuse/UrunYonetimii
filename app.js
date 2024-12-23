const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Create a Mongoose schema for your products
const ProductSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_image: { type: String }
});

const Product = mongoose.model('Product', ProductSchema);

// MongoDB URI
const uri = "mongodb+srv://adagungor510:urunyonetimi@cluster0.nlnlwdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// MongoDB veritabanı ve koleksiyon adı
const databaseName = 'test';
const collectionName = 'products';
// Statik dosyaları sunmak için
app.use(express.static(path.join(__dirname, 'public')));

// JSON verisi alabilmek için middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  // URL-encoded verileri de işleyebilmek için

// Multer ile dosya yükleme yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// MongoDB bağlantısı
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch((error) => {
  console.error('MongoDB bağlantı hatası:', error);
});

// Ana sayfayı render et
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Görüntüleri sunmak için statik dizin kullanımı
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API endpoint: Ürünleri al
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Ürünleri alırken hata:', error);
    res.status(500).send('Bir hata oluştu.');
  }
});

// API endpoint: Ürün ekle
app.post('/api/products', upload.single('product_image'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { product_name, product_price } = req.body;
    const product_image = req.file ? req.file.filename : null;

    const newProduct = new Product({
      product_name,
      product_price: parseFloat(product_price),
      product_image
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    res.status(500).json({ 
      message: 'Ürün eklenirken hata oluştu',
      error: error.message 
    });
  }
});

// API endpoint: Ürün sil
app.delete('/api/products/:name', async (req, res) => {
  try {
    const result = await Product.deleteOne({ product_name: req.params.name });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Ürün başarıyla silindi' });
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    res.status(500).send('Bir hata oluştu.');
  }
});

// API endpoint: Ürün güncelle
app.put('/api/products/:name', upload.single('product_image'), async (req, res) => {
  try {
    const { product_name, product_price } = req.body;
    const product_image = req.file ? req.file.filename : null;

    const updateDoc = {
      $set: {
        product_name,
        product_price: parseFloat(product_price),
      }
    };
    if (product_image) {
      updateDoc.$set.product_image = product_image;
    }

    const result = await Product.updateOne({ product_name: req.params.name }, updateDoc);
    if (result.matchedCount === 1) {
      res.status(200).json({ message: 'Ürün başarıyla güncellendi' });
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    res.status(500).send('Bir hata oluştu.');
  }
});

// Hata kontrolü için middleware ekleyelim
app.use((err, req, res, next) => {
  console.error('Hata:', err.stack);
  res.status(500).send('Bir hata oluştu.');
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});

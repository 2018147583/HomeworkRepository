const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const pathToFile = path.join(__dirname, 'comment.json');

const app = express();
app.use(express.json());

let db = new sqlite3.Database('./product.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the product database.');
});

db.run('DELETE FROM products', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Cleared existing products');

    db.run(`CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_image TEXT,
      product_title TEXT,
      product_price REAL,
      product_category TEXT
    )`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Created products table');
        db.run(`UPDATE SQLITE_SEQUENCE SET seq = 0 WHERE name = 'products'`);
        const products = [
          {
          product_image: "apple.jpg",
          product_title: "Apple",
          product_price: 1520,
          product_category: "Sweet"
          },
          {
          product_image: "eapple.jpg",
          product_title: "Envy Apple",
          product_price: 50000,
          product_category: "Sweet"
          },
          {
          product_image: "straw.jpg",
          product_title: "Strawberry",
          product_price: 2770,
          product_category: "Sour"
          },
          {
          product_image: "waterm.jpg",
          product_title: "Watermelon",
          product_price: 3050,
          product_category: "Sweet"
          },
          {
          product_image: "cherry.jpg",
          product_title: "Cherry",
          product_price: 3000,
          product_category: "Sour"
          },
          {
          product_image: "pineapple.jpg",
          product_title: "Pineapple",
          product_price: 7200,
          product_category: "Sour"
          },
          {
          product_image: "lemon.jpg",
          product_title: "Lemon",
          product_price: 1250,
          product_category: "Sour"
          },
          {
          product_image: "banana.jpg",
          product_title: "Banana",
          product_price: 2230,
          product_category: "Sweet"
          },
          {
          product_image: "plum.jpg",
          product_title: "Plum",
          product_price: 5220,
          product_category: "Sour"
          },
          {
          product_image: "orange.jpg",
          product_title: "Orange",
          product_price: 3740,
          product_category: "Sour"
          },
          {
          product_image: "tangerine.jpg",
          product_title: "Tangerine",
          product_price: 7450,
          product_category: "Sour"
          },
          {
          product_image: "pear.jpg",
          product_title: "Pear",
          product_price: 7260,
          product_category: "Sweet"
          },
          {
          product_image: "kiwi.jpg",
          product_title: "Kiwi",
          product_price: 8210,
          product_category: "Sour"
          },
          {
          product_image: "goldenkiwi.jpg",
          product_title: "Goldenkiwi",
          product_price: 3280,
          product_category: "Sweet"
          },
          {
          product_image: "melon.jpg",
          product_title: "Melon",
          product_price: 5310,
          product_category: "Sweet"
          },
          {
          product_image: "peach.jpg",
          product_title: "Peach",
          product_price: 6230,
          product_category: "Sweet"
          },
          {
          product_image: "tomato.jpg",
          product_title: "Tomato",
          product_price: 12300,
          product_category: "Sour"
          },
          {
          product_image: "apricot.jpg",
          product_title: "Apricot",
          product_price: 2480,
          product_category: "Sweet"
          },
          {
          product_image: "grape.jpg",
          product_title: "Grape",
          product_price: 5800,
          product_category: "Sweet"
          },
          {
          product_image: "mango.jpg",
          product_title: "Mango",
          product_price: 5830,
          product_category: "Sweet"
          },
          {
          product_image: "lichy.jpg",
          product_title: "Lichy",
          product_price: 6050,
          product_category: "Sour"
          },
          {
          product_image: "raspberry.jpg",
          product_title: "Raspberry",
          product_price: 6080,
          product_category: "Sour"
          },
          {
          product_image: "papaya.jpg",
          product_title: "Papaya",
          product_price: 8350,
          product_category: "Sweet"
          },
          {
          product_image: "grapefruit.jpg",
          product_title: "Grapefruit",
          product_price: 2850,
          product_category: "Sour"
          }
        ];

        const insertQuery = `INSERT INTO products (product_image, product_title, product_price, product_category) VALUES (?, ?, ?, ?)`;
        products.forEach(product => {
          db.run(insertQuery, [product.product_image, product.product_title, product.product_price, product.product_category], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        });
      }
    });
  }
});

db.run(`CREATE TABLE IF NOT EXISTS reviews (
  review_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  review TEXT
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Created reviews table');
  }
});

app.post('/comment', (req, res) => {
  const { productId, review } = req.body;

  if (!productId || !review) {
    res.status(400).send({ error: 'Product ID and review are required' });
    return;
  }

  const insertQuery = `INSERT INTO reviews (product_id, review) VALUES (?, ?)`;
  db.run(insertQuery, [productId, review], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send({ error: err.message });
      return;
    }

    const selectQuery = `SELECT product_id, review FROM reviews`;
    db.all(selectQuery, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send({ error: err.message });
        return;
      }

      const comments = rows.map(row => ({ product_id: row.product_id, review: row.review }));
      const commentsJSON = JSON.stringify(comments, null, 2);

      fs.writeFile(pathToFile, commentsJSON, (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send({ error: err.message });
          return;
        }
        console.log('Comments saved to comment.json');
        res.status(201).send({ message: 'Review added successfully' });
      });
    });
  });
});

app.get('/comment', (req, res) => {
  const productId = req.query.productId;

  if (!productId) {
    res.status(400).send({ error: 'Product ID is required' });
    return;
  }

  const selectQuery = `SELECT review FROM reviews WHERE product_id = ?`;
  db.all(selectQuery, [productId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send({ error: err.message });
      return;
    }
    res.send(rows.map(row => row.review));
  });
});

app.get('/comments', (req, res) => {
  const selectQuery = `SELECT product_id, review FROM reviews`;
  db.all(selectQuery, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send({ error: err.message });
      return;
    }
    const comments = rows.map(row => ({ product_id: row.product_id, review: row.review }));
    const commentsJSON = JSON.stringify(comments, null, 2);

    fs.writeFile(pathToFile, commentsJSON, (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send({ error: err.message });
        return;
      }
      console.log('Comments saved to comment.json');
      res.send(comments);
    });
  });
});

app.delete('/comments', (req, res) => {
  const deleteQuery = `DELETE FROM reviews`;
  db.run(deleteQuery, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send({ error: err.message });
      return;
    }
    console.log('All comments cleared');
    res.send({ message: 'All comments cleared' });
  });
});

app.use(express.static(path.join(__dirname, '.')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.get('/product/:product_id', (req, res) => {
  const productId = req.params.product_id;

  db.get('SELECT * FROM products WHERE product_id = ?', [productId], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      res.sendFile(path.join(__dirname, 'product.html'));
    } else {
      res.status(404).send('Product not found');
    }
  });
});

app.get('/api/product/:product_id', (req, res) => {
  const productId = req.params.product_id;
  db.get('SELECT * FROM products WHERE product_id = ?', [productId], (err, row) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).send({ error: 'Product not found' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

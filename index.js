require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta za slanje emaila
app.post('/posalji-email', async (req, res) => {
  const { ime, email, poruka } = req.body;

  // Validacija
  if (!ime || !email || !poruka) {
    return res.status(400).send('Sva polja su obavezna.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Nova poruka od ${ime}`,
    text: `Poruka od ${ime} (${email}):\n\n${poruka}`,
    replyTo: email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send(' Poruka uspješno poslana!');
  } catch (err) {
    console.error(' Greška pri slanju emaila:', err);
    res.status(500).send(' Došlo je do greške pri slanju emaila.');
  }
});

// Start servera
app.listen(PORT, () => {
  console.log(` Server radi na http://localhost:${PORT}`);
});

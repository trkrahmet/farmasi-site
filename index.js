import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const mailFrom = process.env.MAIL_FROM;
const mailTo = process.env.MAIL_TO;
const mailKey = process.env.MAIL_KEY;

// __dirname tanımlaması (ESM içinde farklıdır)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index.ejs', {formstatus: null});
});

app.get('/kvkk', (req, res) => {
    res.render('kvkk.ejs');
})

// POST route: Formdan gelen veriyi yakala ve e-posta gönder

app.post('/', async (req, res) => {
    const {name, phone, reason} = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailFrom,
            pass: mailKey
        }
    });

    const mailOptions = {
        from: mailFrom,
        to: mailTo,
        subject: 'Yeni İletişim Formu Başvurusu',
        text: `Ad Soyad: ${name}\nTelefon: ${phone}\nİletişim Nedeni: ${reason}`
    };

    try {
        await transporter.sendMail(mailOptions);
        // res.send('<h2 id="correct-form">Form başarıyla gönderildi!</h2>');
        // res.redirect("/");
        res.render('index.ejs', {formstatus: true});
    } catch (error) {
        console.error('Mail gönderme hatası:', error);
        res.render('index.ejs', {formstatus: false});
    }
});

// Sunucuyu başlat

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});


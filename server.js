const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

app.post('/api/click', (req, res) => {
    const { button } = req.body;
    const now = new Date();
    const timestamp = now.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: 'alexandrlarionovich@gmail.com',
        subject: '💖 Нажата кнопка в приложении',
        text: `Нажата кнопка: "${button}"\nДата и время: ${timestamp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Ошибка отправки:', error);
            return res.status(500).json({ status: 'error', message: 'Не удалось отправить письмо' });
        }
        console.log('Письмо отправлено:', info.response);
        res.json({ status: 'ok', message: 'Уведомление отправлено' });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
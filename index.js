require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const fs = require('fs');

app.use((req, res, next) => {
    const host = req.headers.host; // 요청된 호스트 이름

    let subdomainsTxt = '';
    try {
        subdomainsTxt = fs.readFileSync(path.join(__dirname, 'subdomains.txt'), 'utf8');
    } catch (e) { }

    let lines = subdomainsTxt.split('\n');
    for (let line of lines) {
        let [_host, _redirect] = line.split(' -> ');
        if (_host && _redirect) {
            if (host === _host) {
                return res.redirect(301, _redirect);
            }
        }
    }

    // 다른 요청은 기본 처리
    next();
});


app.use(require('cors')());
app.use(express.json());

app.use('/contact', require('./routes/contact'));

app.use(express.static(path.join(__dirname, 'web')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// 서버 시작
app.listen(80);
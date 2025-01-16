require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const fs = require('fs');

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Encoding', 'identity');
    }
    next();
});

app.use((req, res, next) => {
    const host = req.headers.host;

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

    next();
});


app.use(require('cors')());
app.use(express.json());

app.use('/contact', require('./routes/contact'));

app.use(express.static(path.join(__dirname, 'web')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.listen(80);
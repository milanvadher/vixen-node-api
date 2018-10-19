const express = require('express');
const router = express()
const request = require("request");
const bodyParser = require('body-parser');

const port = 3000;
const apiURL = 'http://192.168.43.47:8888';

/* Test API. */
router.get('/test', function (req, res, next) {
    res.send({ test: 'Api is working.' });
});

/* Get Sequences API. */
router.get('/getSequences', function (req, res, next) {
    console.log('getSequences');
    const options = {
        method: 'GET',
        url: apiURL + '/api/play/getSequences',
    };
    request(options, function (error, response, body) {
        if (error) res.send(JSON.parse(error));
        console.log(body);
        res.send(JSON.parse(body));
    });
});

/* Sequence State API. */
router.post('/sequence/state', function (req, res, next) {
    console.log('sequence/state', req.body);
    const options = {
        method: 'POST',
        url: apiURL + '/api/play/' + req.body.state + 'Sequence',
        body:
        {
            FileName: req.body.FileName,
            Name: req.body.Name,
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) res.send(JSON.parse(error));
        console.log(body);
        res.send(body);
    });
});

/* Play Status API. */
router.get('/playStatus', function (req, res, next) {
    console.log('playStatus', req.body);
    const options = {
        method: 'GET',
        url: apiURL + '/api/play/status',
    };
    request(options, function (error, response, body) {
        if (error) res.send(JSON.parse(error));
        console.log(body);
        res.send(JSON.parse(body));
    });
});

/* Server start from here. */
router.listen(port, () => console.log(`Example app listening on port ${port}!`));
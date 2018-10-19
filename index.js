const express = require('express');
const router = express()
const request = require("request");
const cors = require('cors')
const bodyParser = require('body-parser');

const port = 3000;
const vixenMachineURL = 'http://192.168.43.47:8888'; // set IP of vixen machine
const asimAPIURL = 'http://asimservicetest.dadabhagwan.org/api/Location/ThemeShowActionChanged';

router.use(cors());

/* Test API. */
router.get('/test', function (req, res, next) {
    res.send({ test: 'Api is working.' });
});

/* Get Sequences API. */
router.get('/getSequences', function (req, res, next) {
    console.log('getSequences');
    const options = {
        method: 'GET',
        url: vixenMachineURL + '/api/play/getSequences',
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
        url: vixenMachineURL + '/api/play/' + req.body.state + 'Sequence',
        body:
        {
            FileName: req.body.FileName,
            Name: req.body.Name,
        },
        json: true
    };
    const asimData = {
        method: 'POST',
        url: asimAPIURL,
        body:
        {
            LocationId: req.body.locationID,
            ActionName: req.body.state.toLocaleUpperCase(),
            AccessToken: 'Dada'
        },
        json: true
    };
    request(asimData, function (asimerr, response, res) {
        if (asimerr) res.send(JSON.parse(error));
        console.log('Asim res:', res);
        request(options, function (error, response, body) {
            if (error) res.send(JSON.parse(error));
            console.log(body);
            res.send(body);
        });
    });
});

/* Play Status API. */
router.get('/playStatus', function (req, res, next) {
    console.log('playStatus', req.body);
    const options = {
        method: 'GET',
        url: vixenMachineURL + '/api/play/status',
    };
    request(options, function (error, response, body) {
        if (error) res.send(JSON.parse(error));
        console.log(body);
        res.send(JSON.parse(body));
    });
});

/* Server start from here. */
router.listen(port, () => console.log(`Example app listening on port ${port}!`));
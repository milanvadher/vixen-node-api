const express = require('express');
const app = express()
const request = require("request");
const cors = require('cors')
const bodyParser = require('body-parser');

const port = 3000;
const vixenMachineURL = 'http://192.168.43.47:8888'; // set IP of vixen machine
const asimAPIURL = 'http://asimservicetest.dadabhagwan.org/api/Location/ThemeShowActionChanged';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Test API. */
app.get('/test', function (req, res, next) {
    res.send({ test: 'Api is working.' });
});

/* Get Sequences API. */
app.get('/getSequences', function (req, res, next) {
    console.log('getSequences');
    const options = {
        method: 'GET',
        url: vixenMachineURL + '/api/play/getSequences',
    };
    request(options, function (error, response, body) {
        if (error) res.send(error);
        console.log(body);
        res.send(body);
    });
});

/* Sequence State API. */
app.post('/sequence/state', function (req, res, next) {
    console.log('sequence/state', req);
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
            ActionName: (req.body.state).toUpperCase(),
            AccessToken: 'Dada'
        },
        json: true
    };
    request(asimData, function (asimerr, response, res) {
        if (asimerr) res.send(error);
        console.log('Asim res:', res);
        request(options, function (error, response, body) {
            if (error) res.send(error);
            console.log(body);
            res.send(body);
        });
    });
});

/* Play Status API. */
app.get('/playStatus', function (req, res, next) {
    console.log('playStatus', req.body);
    const options = {
        method: 'GET',
        url: vixenMachineURL + '/api/play/status',
    };
    request(options, function (error, response, body) {
        if (error) res.send(error);
        console.log(body);
        res.send(body);
    });
});

/* Server start from here. */
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
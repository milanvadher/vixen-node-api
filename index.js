
const express = require('express');
const app = express()
const request = require("request");
const cors = require('cors')
const bodyParser = require('body-parser');

const port = 3000;
const vixenMachineURL = 'http://192.168.43.12:8888'; // set IP of vixen machine
const asimAPIURL = 'http://asimservice.dadabhagwan.org/api/Location/ThemeShowActionChanged';
a = 1;
b = 117;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Test API. */
app.get('/test', function (req, res, next) {
    res.send({ test: 'Api is working.' });
});

/* Get Sequences API. */
app.get('/getSequences', function (req, res, next) {
    const options = {
        method: 'GET',
        url: 'http://192.168.' + a + '.' + b + ':8888/api/play/getSequences',
    };
    console.log('getSequences', options);
    request(options, function (error, response, body) {
        if (error) res.send(error);
        console.log(body);
        res.send(body);
    });
});

/* Sequence State API. */
app.post('/sequence/state', function (req, res, next) {
    const options = {
        method: 'POST',
        url: 'http://192.168.' + a + '.' + b + ':8888/api/play/' + req.body.state + 'Sequence',
        body:
        {
            FileName: req.body.FileName,
            Name: req.body.Name,
        },
        json: true
    };
    if (req.body.locationID && req.body.locationID != 0 && req.body.locationID != '' && req.body.locationID != null) {
        asimApiCall({
            method: 'POST',
            url: asimAPIURL,
            body:
            {
                LocationId: req.body.locationID,
                ActionName: (req.body.state).toUpperCase(),
                AccessToken: 'Dada'
            },
            json: true
        });
    }
    request(options, function (error, response, body) {
        if (error) res.send(error);
        console.log(body);
        res.send(body);
    });
});

function asimApiCall(data) {
    request(data, function (asimerr, response, asimBody) {
        if (asimBody.Status == 1) {
            console.log('success', asimBody);
        } else {
            console.log('error', asimBody);
        }
    });
}

/* Play Status API. */
app.get('/playStatus', function (req, res, next) {
    console.log('playStatus', req.body);
    const options = {
        method: 'GET',
        url: 'http://192.168.' + a + '.' + b + ':8888/api/play/status',
    };
    request(options, function (error, response, body) {
        if (error) res.send(error);
        console.log(body);
        res.send(body);
    });
});

/* Server start from here. */
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const SecretData = require('../models/secret-data');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { Gone } = require('http-errors');
const should = chai.should();
chai.use(chaiHttp);
let hashValue = '';
let remainingViews = 5;

describe('SecretData', () => {
    //Before each test we empty the database
    beforeEach((done) => {
        SecretData.remove({}, (err) => {
            done();
        });
    });

    //Test get secret info
    describe('Get secret data', () => {
        it('gets not existing data secret', (done) => {
            chai.request(app)
                .get('/api/secret/notexistinghash')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object').that.is.empty;
                });
            done();
        });
    });

    //Test generating secret data
    describe('Generate secret data', () => {
        it('generate secret hash with empty input data', (done) => {
            chai.request(app)
                .post('/api/secret')
                .set('content-type', 'application/json')
                .send({})
                .end((err, res) => {
                    res.should.have.status(422);
                });
            done();
        });
        it('generate secret hash with invalid input expireAfterViews data', (done) => {
            chai.request(app)
                .post('/api/secret')
                .set('content-type', 'application/json')
                .send({
                    'expireAfterViews': 'apple'
                })
                .end((err, res) => {
                    res.should.have.status(422);
                });
            done();
        })
        it('generate secret hash with invalid input expireAfter data', (done) => {
            chai.request(app)
                .post('/api/secret')
                .set('content-type', 'application/json')
                .send({
                    'expireAfter': 'pear'
                })
                .end((err, res) => {
                    res.should.have.status(422);
                });
            done();
        })
        it('generate secret hash with 10 minutes expiration and 5 views', (done) => {
            let secretText = 'hello secret server test!';
            chai.request(app)
                .post('/api/secret')
                .set('content-type', 'application/json')
                .send({
                    'secret': secretText,
                    'expireAfterViews': remainingViews,
                    'expireAfter': 10
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('hash');
                    res.body.should.have.property('secretText').eql(secretText);
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('expiresAt');
                    res.body.should.have.property('remainingViews').to.eql(remainingViews);
                    hashValue = res.body.hash;
                });
            done();
        });
        //get 8 times the content and check the result
        for(i=1;i<=remainingViews+3;i++) {
            it('get secret data (' + i + '.)', (done) => {
                chai.request(app)
                    .get('/api/secret/' + hashValue)
                    .end((err, res) => {
                        res.should.have.status(200);
                        if(i <= 5) {
                            res.body.should.be.a('object');
                            res.body.should.have.property('hash');
                            res.body.should.have.property('secretText').eql(secretText);
                            res.body.should.have.property('createdAt');
                            res.body.should.have.property('expiresAt');
                            res.body.should.have.property('remainingViews').to.eql(remainingViews-i);
                        }else {
                            res.body.should.be.a('object').that.is.empty;
                        }
                    })
                done();
            });
        }
        it('generate secret hash with 1 minute expiration and check it after', (done) => {
            let secretText = 'hello secret server test again!';
            chai.request(app)
                .post('/api/secret')
                .set('content-type', 'application/json')
                .send({
                    'secret': secretText,
                    'expireAfterViews': remainingViews,
                    'expireAfter': 1
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('hash');
                    res.body.should.have.property('secretText').eql(secretText);
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('expiresAt');
                    res.body.should.have.property('remainingViews').to.eql(remainingViews);
                    hashValue = res.body.hash;
                });
            done();
        })
        it('has to wait at least 1 minute and checking secret expiration', (done) => {
            chai.request(app)
                .get('/api/secret/' + hashValue)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object').that.is.empty;
                });
            setTimeout(done, 65000);
        });
    });
});
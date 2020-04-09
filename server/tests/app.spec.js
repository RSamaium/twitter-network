const request = require('supertest')
const app = require('../app')
const assert = require('assert')

describe('Test App', () => {
    it('Test path', () => {
        return request(app)
            .post('/path')
            .send({
                start: 1,
                end: 31
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert.deepEqual(res.body, [ '1', '41159', '31' ])
            });
    })
})
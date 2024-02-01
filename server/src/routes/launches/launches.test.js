const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('it should return a 200 status code' , async () => {
        const response = await request(app)
        .get('/launches')
        .expect(200)
        .expect('Content-Type', /json/);
    })
});


describe('Test POST /launch', () => {

    //fixture
    const payload = {
        mission: 'Enterprise',
        rocket: 'USS Enterprise',
        target: 'Kepler 1',
        launchDate: 'January 4,2028'
    }

    const payloadWithoutDate = {
        mission: 'Enterprise',
        rocket: 'USS Enterprise',
        target: 'Kepler 1'     
    }


    test('It should return a 200 status code', async () => {
        const response = await request(app)
        .post('/launches')
        .send(payload)
        .expect(201);

        const requestDate = new Date(payload.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);

    });

    test('It should catch missing required properties' , async() => {

        const modifiedPayload = { ...payload};
        delete modifiedPayload.target; 
        const response = await request(app)
        .post('/launches')
        .send(modifiedPayload)
        .expect(400)
        
        expect(response.body).toStrictEqual({ error: 'missing field or empty field value'})
        

        
        
    });

    test('It should catch invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(payloadWithoutDate)
        .expect(400)
        
        expect(response.body).toStrictEqual({ error: 'invalid date'})
    })
});
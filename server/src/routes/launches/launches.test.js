const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo') 



describe('Launches API' ,() => {

    beforeAll( async () => {
        await mongoConnect();
    })

    afterAll( async() => {
        await mongoDisconnect();
    })

    describe('Test GET /launches', () => {
        test('it should return a 200 status code' , async () => {
            const response = await request(app)
            .get('/v1/launches')
            .expect(200)
            .expect('Content-Type', /json/);
        })
    });
    
    
    describe('Test POST /launch', () => {
    
        //fixture
        const payload = {
            mission: 'Enterprise',
            rocket: 'USS Enterprise',
            target: 'Kepler-1649 b',
            launchDate: 'January 4,2028'
        }
    
        const payloadWithoutDate = {
            mission: 'Enterprise',
            rocket: 'USS Enterprise',
            target: 'Kepler-1649 b'     
        }
    
    
        test('It should return a 201 status code', async () => {
            const response = await request(app)
            .post('/v1/launches')
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
            .post('/v1/launches')
            .send(modifiedPayload)
            .expect(400)
            
            expect(response.body).toStrictEqual({ error: 'missing field or empty field value'})
            
        });
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(payloadWithoutDate)
            .expect(400)
            
            expect(response.body).toStrictEqual({ error: 'invalid date'})
        })
    });
})


import request from 'supertest';
import {app} from '../../src/index'

const req = request(app);

describe ('response on calling endpoint', ()=>{
    it('should return status 200', async()=>{
        const response = await req.get('/api/images').send();
        expect(response.status).toBe(200);
    })
})
import request from 'supertest';
import { app } from '../../src/app';

describe("Offices API", () => {
    describe("v1: when requesting by id", () => {
        it("should return 400 when invalid id", async () => {
            let response = await request(app).get(`/offices/aaaa`).expect(400);
            expect(response.body).toEqual({
                "error": "ID_ERROR",
                "messages": "Id should be greater than 0"
            });
            response = await request(app).get(`/offices/-1`).expect(400);
            expect(response.body).toEqual({
                "error": "ID_ERROR",
                "messages": "Id should be greater than 0"
            });
        });

        it("should return 404 when not found", async () => {
            const response = await request(app).get(`/offices/100`).expect(404);
            expect(response.body).toEqual({
                "error": "NOT_EXISTING",
                "messages": "Resource with given id not found"
            });
        });

        it("should return office by id", async () => {
            const response = await request(app).get(`/offices/2`).expect(200);
            expect(response.body).toEqual({
                "id": 2,
                "city": "New York",
                "country": "United States",
                "address": "20 W 34th St"
            });
        });
    });

    describe("v1: when requesting with limit and offset", () => {
        it("should return 400 when invalid limit and offset", async () => {
            let response = await request(app).get(`/offices?limit=aaa`).expect(400);
            expect(response.body).toEqual({
                "error": "LIMIT_ERROR",
                "messages": "Limit should be greater than 0 and less or equal to 1000"
            });
            response = await request(app).get(`/offices?limit=-1`).expect(400);
            expect(response.body).toEqual({
                "error": "LIMIT_ERROR",
                "messages": "Limit should be greater than 0 and less or equal to 1000"
            });
            response = await request(app).get(`/offices?offset=aaa`).expect(400);
            expect(response.body).toEqual({
                "error": "OFFSET_ERROR",
                "messages": "Offset should be greater or equal than 0"
            });
            response = await request(app).get(`/offices?offset=-1`).expect(400);
            expect(response.body).toEqual({
                "error": "OFFSET_ERROR",
                "messages": "Offset should be greater or equal than 0"
            });
        });

        it("should return offices using defaults", async () => {
            const response = await request(app).get(`/offices?limit=2&offset=3`).expect(200);
            expect(response.body).toEqual([{
                "id": 4,
                "city": "Chicago",
                "country": "United States",
                "address": "233 S Wacker Dr"
            }, {
                "id": 5,
                "city": "Tokyo",
                "country": "Japan",
                "address": "1 Chome-1-2 Oshiage, Sumida City"
            }]);
        });

        it("should return offices using defaults", async () => {
            const response = await request(app).get(`/offices`).expect(200);
            expect(response.body).toEqual([{
                "id": 1,
                "city": "San Francisco",
                "country": "United States",
                "address": "450 Market St"
            }, {
                "id": 2,
                "city": "New York",
                "country": "United States",
                "address": "20 W 34th St"
            }, {
                "id": 3,
                "city": "London",
                "country": "United Kingdom",
                "address": "32 London Bridge St"
            }, {
                "id": 4,
                "city": "Chicago",
                "country": "United States",
                "address": "233 S Wacker Dr"
            }, {
                "id": 5,
                "city": "Tokyo",
                "country": "Japan",
                "address": "1 Chome-1-2 Oshiage, Sumida City"
            }]);
        });
    });
});
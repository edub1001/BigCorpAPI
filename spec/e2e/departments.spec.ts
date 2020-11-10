import request from 'supertest';
import { app } from '../../src/app';

describe("Departments API", () => {
    describe("v1: when requesting by id", () => {
        it("should return 400 when invalid id", async () => {
            let response = await request(app).get(`/departments/aaaa`).expect(400);
            expect(response.body).toEqual({
                "error": "ID_ERROR",
                "messages": "Id should be greater than 0"
            });
            response = await request(app).get(`/departments/-1`).expect(400);
            expect(response.body).toEqual({
                "error": "ID_ERROR",
                "messages": "Id should be greater than 0"
            });
        });

        it("should return 400 when expander is wrong id", async () => {
            const response = await request(app).get(`/departments/1?expand=office&expand=manager&expand=nonexisting`).expect(400);
            expect(response.body).toEqual({
                "error": "EXPAND_ERROR",
                "messages": [
                  "office cannot be expanded from department",
                  "manager cannot be expanded from department",
                  "nonexisting is not allowed to be expanded"
                ]
            });
        });

        it("should return 404 when not found", async () => {
            const response = await request(app).get(`/departments/100`).expect(404);
            expect(response.body).toEqual({
                "error": "NOT_EXISTING",
                "messages": "Resource with given id not found"
            });
        });

        it("should return department by id", async () => {
            const response = await request(app).get(`/departments/2`).expect(200);
            expect(response.body).toEqual({
                "id": 2,
                "name": "Engineering",
                "superdepartment": null
            });
        });

        it("should return expanded department by id", async () => {
            const response = await request(app).get(`/departments/9?expand=superdepartment.superdepartment.superdepartment`).expect(200);
            expect(response.body).toEqual({
                "id": 9,
                "name": "Sales Development",
                "superdepartment": {
                  "id": 6,
                  "name": "Outbound Sales",
                  "superdepartment": {
                    "id": 1,
                    "name": "Sales",
                    "superdepartment": null
                  }
                }
              });
        });
    });

    describe("v1: when requesting with limit and offset", () => {
        it("should return 400 when invalid limit and offset", async () => {
            let response = await request(app).get(`/departments?limit=aaa`).expect(400);
            expect(response.body).toEqual({
                "error": "LIMIT_ERROR",
                "messages": "Limit should be greater than 0 and less or equal to 1000"
            });
            response = await request(app).get(`/departments?limit=-1`).expect(400);
            expect(response.body).toEqual({
                "error": "LIMIT_ERROR",
                "messages": "Limit should be greater than 0 and less or equal to 1000"
            });
            response = await request(app).get(`/departments?offset=aaa`).expect(400);
            expect(response.body).toEqual({
                "error": "OFFSET_ERROR",
                "messages": "Offset should be greater or equal than 0"
            });
            response = await request(app).get(`/departments?offset=-1`).expect(400);
            expect(response.body).toEqual({
                "error": "OFFSET_ERROR",
                "messages": "Offset should be greater or equal than 0"
            });
        });

        it("should return 400 when expander is wrong id", async () => {
            const response = await request(app).get(`/departments?expand=office&expand=manager&expand=nonexisting`).expect(400);
            expect(response.body).toEqual({
                "error": "EXPAND_ERROR",
                "messages": [
                  "office cannot be expanded from department",
                  "manager cannot be expanded from department",
                  "nonexisting is not allowed to be expanded"
                ]
            });
        });

        it("should return departments using defaults", async () => {
            const response = await request(app).get(`/departments?limit=2&offset=3`).expect(200);
            expect(response.body).toEqual([
                {
                  "id": 4,
                  "name": "Design",
                  "superdepartment": 3
                },
                {
                  "id": 5,
                  "name": "Inbound Sales",
                  "superdepartment": 1
                }
              ]);
        });

        it("should return expanded department", async () => {
            const response = await request(app).get(`/departments?limit=3&offset=8&expand=superdepartment.superdepartment.superdepartment`).expect(200);
            expect(response.body).toEqual([
                {
                  "id": 9,
                  "name": "Sales Development",
                  "superdepartment": {
                    "id": 6,
                    "name": "Outbound Sales",
                    "superdepartment": {
                      "id": 1,
                      "name": "Sales",
                      "superdepartment": null
                    }
                  }
                },
                {
                  "id": 10,
                  "name": "Product Management",
                  "superdepartment": {
                    "id": 3,
                    "name": "Product",
                    "superdepartment": null
                  }
                }
              ]);
        });

        it("should return departments using defaults", async () => {
            const response = await request(app).get(`/departments`).expect(200);
            expect(response.body).toHaveSize(10);
        });
    });
});
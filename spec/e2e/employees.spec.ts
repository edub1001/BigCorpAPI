import request from 'supertest';
import { app } from '../../src/app';
import employeeTestData from "./employees.test.json";

describe("Employees API", () => {
  describe("v1: when requesting by id", () => {
    it("should return 400 when invalid id", async () => {
      let response = await request(app).get(`/employees/aaaa`).expect(400);
      expect(response.body).toEqual({
        "error": "ID_ERROR",
        "messages": "Id should be greater than 0"
      });
      response = await request(app).get(`/employees/-1`).expect(400);
      expect(response.body).toEqual({
        "error": "ID_ERROR",
        "messages": "Id should be greater than 0"
      });
    });

    it("should return 400 when expander is wrong id", async () => {
      const response = await request(app).get(`/employees/1?expand=office.manager&expand=department.manager&expand=nonexisting`).expect(400);
      expect(response.body).toEqual({
        "error": "EXPAND_ERROR",
        "messages": [
          "manager cannot be expanded from office",
          "manager cannot be expanded from department",
          "nonexisting is not allowed to be expanded"
        ]
      });
    });

    it("should return employee by id", async () => {
      const response = await request(app).get(`/employees/2`).expect(200);
      expect(response.body).toEqual({
        "first": "Daniel",
        "last": "Smith",
        "id": 2,
        "manager": 1,
        "department": 5,
        "office": 2
      });
    });

    it("should return expanded employee by id", async () => {
      const expands = [
        "expand=department.superdepartment.superdepartment",
        "expand=manager.office",
        "expand=office",
        "expand=manager.department.superdepartment.superdepartment"
      ];
      const response = await request(app).get(`/employees/46?${expands.join("&")}`).expect(200);
      expect(response.body).toEqual(employeeTestData.employee46Expanded);
    });
  });

  describe("v1: when requesting with limit and offset", () => {
    it("should return 400 when invalid limit and offset", async () => {
      let response = await request(app).get(`/employees?limit=aaa`).expect(400);
      expect(response.body).toEqual({
        "error": "LIMIT_ERROR",
        "messages": "Limit should be greater than 0 and less or equal to 1000"
      });
      response = await request(app).get(`/employees?limit=-1`).expect(400);
      expect(response.body).toEqual({
        "error": "LIMIT_ERROR",
        "messages": "Limit should be greater than 0 and less or equal to 1000"
      });
      response = await request(app).get(`/employees?offset=aaa`).expect(400);
      expect(response.body).toEqual({
        "error": "OFFSET_ERROR",
        "messages": "Offset should be greater or equal than 0"
      });
      response = await request(app).get(`/employees?offset=-1`).expect(400);
      expect(response.body).toEqual({
        "error": "OFFSET_ERROR",
        "messages": "Offset should be greater or equal than 0"
      });
    });

    it("should return 400 when expander is wrong", async () => {
      const response = await request(app).get(`/employees?expand=office.manager&expand=department.manager&expand=nonexisting`).expect(400);
      expect(response.body).toEqual({
        "error": "EXPAND_ERROR",
        "messages": [
          "manager cannot be expanded from office",
          "manager cannot be expanded from department",
          "nonexisting is not allowed to be expanded"
        ]
      });
    });

    it("should return employees using defaults", async () => {
      const response = await request(app).get(`/employees?limit=2&offset=3`).expect(200);
      expect(response.body).toEqual([
        {
          "first": "Ruth",
          "last": "Morgan",
          "id": 4,
          "manager": null,
          "department": 6,
          "office": 2
        },
        {
          "first": "Jerry",
          "last": "Sanders",
          "id": 5,
          "manager": 3,
          "department": 7,
          "office": 5
        }
      ]);
    });

    it("should return expanded employee", async () => {
      const expands = [
        "expand=department.superdepartment.superdepartment",
        "expand=manager.office",
        "expand=office",
        "expand=manager.department.superdepartment.superdepartment"
      ];
      const response = await request(app).get(`/employees?limit=3&offset=45&${expands.join("&")}`).expect(200);
      expect(response.body).toEqual(employeeTestData.employees46_47_48Expanded);
    });

    it("should return employees using defaults", async () => {
      const response = await request(app).get(`/employees`).expect(200);
      expect(response.body[0].id).toBe(1);
      expect(response.body[99].id).toBe(100);
      expect(response.body).toHaveSize(100);
    });
  });
});
import { Department } from '../../../../src/models/department';
import { DepartmentProvider } from '../../../../src/services/providers/DepartmentProvider';

describe("Department provider", () => {
    let provider:DepartmentProvider;

    beforeAll(() => {
        provider = new DepartmentProvider();
    });

    it("should get department by id", async () => {
        const department = await provider.getById(1);
        // check basic office data
        expect(department).not.toBeUndefined();
        expect(department.id).toBe(1);
    });

    it("should get copy of department", async () => {
        const department = await provider.getById(1);
        department.name = "NEW DEPARTMENT";
        const newDepartment = await provider.getById(1);
        // check basic department data
        expect(newDepartment.name).not.toEqual(department.name);
        expect(newDepartment).not.toBe(department);
    });

    it("should get undefined deparments with unexisting id", async () => {
        const department = await provider.getById(1000);
        expect(department).toBeUndefined();
    });

    it("should get all departments with limit and offset starting from the beginning", async () => {
        const departments = await provider.getAll(3, 0);
        expect(departments).toHaveSize(3);
        expect(departments[0].id).toBe(1);
        expect(departments[1].id).toBe(2);
        expect(departments[2].id).toBe(3);
    });

    it("should get all deparments with limit and offset starting in 2", async () => {
        const departments = await provider.getAll(3, 2);
        expect(departments).toHaveSize(3);
        expect(departments[0].id).toBe(3);
        expect(departments[1].id).toBe(4);
        expect(departments[2].id).toBe(5);
    });

    it("should get all clone departments", async () => {
        const departments = await provider.getAll(2, 0);
        const clonedDepartments = await provider.getAll(2, 0);
        expect(departments[0]).not.toBe(clonedDepartments[0]);
        expect(departments[1]).not.toBe(clonedDepartments[1]);
        expect(departments[0].id).toBe(clonedDepartments[0].id);
        expect(departments[1].id).toBe(clonedDepartments[1].id);
    });

    it("should get all deparments with big limit", async () => {
        const departments = await provider.getAll(1000, 0);
        expect(departments).toHaveSize(10);
    });

    it("should get empty deparments with big offset", async () => {
        const departments = await provider.getAll(5, 1000);
        expect(departments).toHaveSize(0);
    });
});
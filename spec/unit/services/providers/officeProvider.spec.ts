import { Office } from '../../../../src/models/office';
import { OfficeProvider } from '../../../../src/services/providers/officeProvider';

describe("Office provider", () => {
    let provider:OfficeProvider;

    beforeAll(() => {
        provider = new OfficeProvider();
    });

    it("should get office by id", async () => {
        const office = await provider.getById(1);
        // check basic office data
        expect(office).not.toBeUndefined();
        expect(office.id).toBe(1);
    });

    it("should get copy of office", async () => {
        const office = await provider.getById(1);
        office.city = "NEW CITY";
        const newOffice = await provider.getById(1);
        // check basic office data
        expect(newOffice.city).not.toEqual(office.city);
        expect(newOffice).not.toBe(office);
    });

    it("should get undefined office with unexisting id", async () => {
        const office = await provider.getById(1000);
        expect(office).toBeUndefined();
    });

    it("should get all offices with limit and offset starting from the beginning", async () => {
        const offices = await provider.getAll(3, 0);
        expect(offices).toHaveSize(3);
        expect(offices[0].id).toBe(1);
        expect(offices[1].id).toBe(2);
        expect(offices[2].id).toBe(3);
    });

    it("should get all offices with limit 1 and offset starting in 2", async () => {
        const offices = await provider.getAll(1, 2);
        expect(offices).toHaveSize(1);
        expect(offices[0].id).toBe(3);
    });

    it("should get all offices with limit 3 and offset starting in 2", async () => {
        const offices = await provider.getAll(3, 2);
        expect(offices).toHaveSize(3);
        expect(offices[0].id).toBe(3);
        expect(offices[1].id).toBe(4);
        expect(offices[2].id).toBe(5);
    });

    it("should get all clone offices", async () => {
        const offices = await provider.getAll(2, 0);
        const clonedOffices = await provider.getAll(2, 0);
        expect(offices[0]).not.toBe(clonedOffices[0]);
        expect(offices[1]).not.toBe(clonedOffices[1]);
        expect(offices[0].id).toBe(clonedOffices[0].id);
        expect(offices[1].id).toBe(clonedOffices[1].id);
    });

    it("should get all offices with big limit", async () => {
        const offices = await provider.getAll(1000, 0);
        expect(offices).toHaveSize(5);
    });

    it("should get empty offices with big offset", async () => {
        const offices = await provider.getAll(5, 1000);
        expect(offices).toHaveSize(0);
    });
});
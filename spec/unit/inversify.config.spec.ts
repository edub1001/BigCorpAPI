import { DepartmentController } from "../../src/controllers/departmentController";
import { EmployeeController } from "../../src/controllers/employeeController";
import { OfficeController } from "../../src/controllers/officeController";
import { container } from "../../src/inversify.config";
import { DepartmentExpander } from "../../src/services/expanders/departmentExpander";
import { ExpanderFactory } from "../../src/services/expanders/expanderFactory";
import { Expanders } from "../../src/services/expanders/expanders";
import { IExpanderFactory } from "../../src/services/expanders/interfaces";
import { ManagerExpander } from "../../src/services/expanders/managerExpander";
import { OfficeExpander } from "../../src/services/expanders/officeExpander";
import { SuperdepartmentExpander } from "../../src/services/expanders/superdepartmentExpander";
import { ExpanderTreeValidator } from "../../src/services/expanders/treeExpanderValidator";
import { EXPANDERS_TYPES } from "../../src/services/expanders/types";
import { DepartmentProvider } from "../../src/services/providers/departmentProvider";
import { EmployeeProvider } from "../../src/services/providers/employeeProvider";
import { IDepartmentProvider, IEmployeeProvider, IOfficeProvider } from "../../src/services/providers/interfaces";
import { OfficeProvider } from "../../src/services/providers/officeProvider";
import { PROVIDERS_TYPES } from "../../src/services/providers/types";

describe("Dependency injection", () => {
    it("should resolve providers", () => {
        expect(container.get<IEmployeeProvider>(PROVIDERS_TYPES.IEmployeeProvider)).toBeInstanceOf(EmployeeProvider);
        const departmentProvider = container.get<IDepartmentProvider>(PROVIDERS_TYPES.IDepartmentProvider);
        const departmentProvider2 = container.get<IDepartmentProvider>(PROVIDERS_TYPES.IDepartmentProvider);
        expect(departmentProvider).toBeInstanceOf(DepartmentProvider);
        expect(departmentProvider2).toBeInstanceOf(DepartmentProvider);
        // singleton
        expect(departmentProvider).toBe(departmentProvider2);
        const officeProvider = container.get<IOfficeProvider>(PROVIDERS_TYPES.IOfficeProvider);
        const officeProvider2 = container.get<IOfficeProvider>(PROVIDERS_TYPES.IOfficeProvider);
        expect(officeProvider).toBeInstanceOf(OfficeProvider);
        expect(officeProvider2).toBeInstanceOf(OfficeProvider);
        // singleton
        expect(officeProvider).toBe(officeProvider2);
    });

    it("should resolve expanders", () => {
        expect(container.get<ExpanderTreeValidator>(ExpanderTreeValidator)).toBeInstanceOf(ExpanderTreeValidator);
        const expanderFactory = container.get<IExpanderFactory>(EXPANDERS_TYPES.IExpanderFactory);
        const expanderFactory2 = container.get<IExpanderFactory>(EXPANDERS_TYPES.IExpanderFactory);
        expect(expanderFactory).toBeInstanceOf(ExpanderFactory);
        expect(expanderFactory2).toBeInstanceOf(ExpanderFactory);
        // singleton
        expect(expanderFactory).toBe(expanderFactory2);
        expect(expanderFactory.getExpander(Expanders.department)).toBeInstanceOf(DepartmentExpander);
        expect(expanderFactory.getExpander(Expanders.office)).toBeInstanceOf(OfficeExpander);
        expect(expanderFactory.getExpander(Expanders.superdepartment)).toBeInstanceOf(SuperdepartmentExpander);
        expect(expanderFactory.getExpander(Expanders.manager)).toBeInstanceOf(ManagerExpander);
        expect(container.getAll(EXPANDERS_TYPES.IExpander)).toHaveSize(4);
    });

    it("should resolve controllers", () => {
        expect(container.get<EmployeeController>(EmployeeController)).toBeInstanceOf(EmployeeController);
        expect(container.get<OfficeController>(OfficeController)).toBeInstanceOf(OfficeController);
        expect(container.get<DepartmentController>(DepartmentController)).toBeInstanceOf(DepartmentController);
    });
});
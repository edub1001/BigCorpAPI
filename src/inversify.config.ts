import { Container } from "inversify";
import { EmployeeController } from "./controllers/employeeController";
import { DepartmentProvider } from "./services/providers/departmentProvider";
import { EmployeeProvider } from "./services/providers/employeeProvider";
import { IDepartmentProvider, IEmployeeProvider, IOfficeProvider } from "./services/providers/interfaces";
import { OfficeProvider } from "./services/providers/officeProvider";
import { PROVIDERS_TYPES } from "./services/providers/types";
import { DepartmentExpander } from "./services/expanders/departmentExpander";
import { ExpanderFactory } from "./services/expanders/expanderFactory";
import { IExpander, IExpanderFactory } from "./services/expanders/interfaces";
import { ManagerExpander } from "./services/expanders/managerExpander";
import { OfficeExpander } from "./services/expanders/officeExpander";
import { SuperdepartmentExpander } from "./services/expanders/superdepartmentExpander";
import { EXPANDERS_TYPES } from "./services/expanders/types";



const container = new Container();
// bind all providers
container.bind<IEmployeeProvider>(PROVIDERS_TYPES.IEmployeeProvider).to(EmployeeProvider);
container.bind<IDepartmentProvider>(PROVIDERS_TYPES.IDepartmentProvider).to(DepartmentProvider).inSingletonScope();;
container.bind<IOfficeProvider>(PROVIDERS_TYPES.IOfficeProvider).to(OfficeProvider).inSingletonScope();;

// bind all expanders
container.bind<IExpander>(EXPANDERS_TYPES.IExpander).to(DepartmentExpander);
container.bind<IExpander>(EXPANDERS_TYPES.IExpander).to(ManagerExpander);
container.bind<IExpander>(EXPANDERS_TYPES.IExpander).to(OfficeExpander);
container.bind<IExpander>(EXPANDERS_TYPES.IExpander).to(SuperdepartmentExpander);
container.bind<IExpanderFactory>(EXPANDERS_TYPES.IExpanderFactory).to(ExpanderFactory).inSingletonScope();

container.bind<EmployeeController>("EmployeeController").to(EmployeeController);

export { container };

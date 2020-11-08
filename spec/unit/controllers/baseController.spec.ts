import { It, Mock, Times } from 'moq.ts';
import "reflect-metadata";
import { BaseController, HttpStatusCode } from '../../../src/controllers/baseController';
import { BaseEntity } from '../../../src/models/baseEntity';
import { Tree } from '../../../src/models/tree';
import { Expanders } from '../../../src/services/expanders/expanders';
import { ExpandersErrorCodes } from '../../../src/services/expanders/expandersError';
import { IExpander, IExpanderFactory } from '../../../src/services/expanders/interfaces';
import { ExpanderTreeValidator } from '../../../src/services/expanders/treeExpanderValidator';
import { IBaseProvider } from '../../../src/services/providers/interfaces';
import { ProvidersErrorCodes } from '../../../src/services/providers/providersError';
import { ServicesError, ValidationErrorCodes } from '../../../src/services/servicesError';
import { arraysEqual } from '../helper';

interface IControllerTestEntities {
    controller: BaseController<BaseEntity>;
    providerMock: Mock<IBaseProvider<BaseEntity>>,
    propertyName: string
}

export function executeSharedTests<T extends BaseEntity>(
    createInstanceFn: (expanderFactory: IExpanderFactory, expanderTreeValidator: ExpanderTreeValidator) => IControllerTestEntities) {

    let controller: BaseController<BaseEntity>;
    let providerMock: Mock<IBaseProvider<BaseEntity>>;
    let expanderFactoryMock: Mock<IExpanderFactory>;
    let expanderMock: Mock<IExpander>;
    let expanderTreeValidator: Mock<ExpanderTreeValidator>;
    let expansionTree: Tree<Expanders>;
    let propertyName: string;
    let entities: T[];

    beforeEach(() => {
        expansionTree = new Tree<Expanders>(Expanders[propertyName]);
        expanderFactoryMock = new Mock<IExpanderFactory>();
        expanderMock = new Mock<IExpander>();
        expanderTreeValidator = new Mock<ExpanderTreeValidator>();
        ({ controller, providerMock, propertyName } = createInstanceFn(expanderFactoryMock.object(), expanderTreeValidator.object()));
        expanderFactoryMock.setup(x => x.getExpander(It.IsAny())).returns(expanderMock.object());
        expanderTreeValidator.setup(x => x.tryToParseToExpanderTree(It.IsAny(), It.IsAny())).returns(expansionTree);
        entities = [];
        entities.push({ "id": 1 } as T);
        entities.push({ "id": 2 } as T);
        entities.push({ "id": 3 } as T);
    });

    describe('when searching for single entity', () => {
        it("should wrap exception with bad request when id is not valid", async () => {
            try {
                await controller.getEntity("notid");
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ValidationErrorCodes.ID_ERROR);
                // tslint:disable-next-line: no-string-literal
                expect(error["statusCode"]).toBe(HttpStatusCode.BAD_REQUEST);
            }
        });

        it("should wrap exception with bad request when expansion tree is not valid", async () => {
            try {
                expanderTreeValidator.setup(x => x.tryToParseToExpanderTree(It.IsAny(), It.IsAny())).throws(new ServicesError(ExpandersErrorCodes.EXPAND_ERROR));
                await controller.getEntity(1, ["invalid"]);
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ExpandersErrorCodes.EXPAND_ERROR);
                // tslint:disable-next-line: no-string-literal
                expect(error["statusCode"]).toBe(HttpStatusCode.BAD_REQUEST);
            }
        });

        it("should wrap exception with not found when provider gives no value", async () => {
            try {
                providerMock.setup(x => x.getById(100)).returns(undefined);
                await controller.getEntity(100);
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ValidationErrorCodes.NOT_EXISTING);
                // tslint:disable-next-line: no-string-literal
                expect(error["statusCode"]).toBe(HttpStatusCode.NOT_FOUND);
            }
        });

        it("should expand several levels", async () => {
            entities[0][propertyName] = 2;
            entities[1][propertyName] = 3;
            providerMock.setup(x => x.getById(entities[0].id)).returns(Promise.resolve(entities[0]));
            // set up expansion tree
            expansionTree.addChild(Expanders[propertyName]).addChild(Expanders[propertyName]);
            expanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            expanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]])))).returns([entities[2]]);
            // act on expand
            const entitiesExpandedReturned = await controller.getEntity(1, [`${propertyName}.${propertyName}`]);
            // assert, should call expand with entities to expand in tree
            expanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            expanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Exactly(1));
            expect(entitiesExpandedReturned).toBe(entities[0]);
        });

        it("should expand several categories in same level", async () => {
            providerMock.setup(x => x.getById(entities[0].id)).returns(Promise.resolve(entities[0]));
            // set up expansion tree, same level, 3 different expansions
            expansionTree.addChild(Expanders.department)
            expansionTree.addChild(Expanders.office);
            expansionTree.addChild(Expanders.manager);
            // different expander each expansion
            const departmentExpanderMock = new Mock<IExpander>();
            const officeExpanderMock = new Mock<IExpander>();
            const managerExpanderMock = new Mock<IExpander>();
            expanderFactoryMock.setup(x => x.getExpander(Expanders.department)).returns(departmentExpanderMock.object());
            expanderFactoryMock.setup(x => x.getExpander(Expanders.office)).returns(officeExpanderMock.object());
            expanderFactoryMock.setup(x => x.getExpander(Expanders.manager)).returns(managerExpanderMock.object());
            // when calling for next expansion level, just return same object
            departmentExpanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            officeExpanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            managerExpanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            // act on expand
            const entitiesExpandedReturned = await controller.getEntity(1, ["department", "office", "manager"]);
            // assert, should call expand with entities to expand in tree
            departmentExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            officeExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            managerExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            // stop expansion in 1st level
            departmentExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Never());
            officeExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Never());
            managerExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Never());
            expect(entitiesExpandedReturned).toBe(entities[0]);
        });
    });

    describe('when searching with limit & offset', () => {
        it("should wrap exception with bad request when limit is not valid", async () => {
            try {
                await controller.getEntities("notlimit");
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ValidationErrorCodes.LIMIT_ERROR);
                // tslint:disable-next-line: no-string-literal
                expect(error["statusCode"]).toBe(HttpStatusCode.BAD_REQUEST);
            }
        });

        it("should wrap exception with bad request when offset is not valid", async () => {
            try {
                await controller.getEntities(1, "notoffset");
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ValidationErrorCodes.OFFSET_ERROR);
                // tslint:disable-next-line: no-string-literal
                expect(error["statusCode"]).toBe(HttpStatusCode.BAD_REQUEST);
            }
        });

        it("should wrap exception with bad request when expansion tree is not valid", async () => {
            try {
                expanderTreeValidator.setup(x => x.tryToParseToExpanderTree(It.IsAny(), It.IsAny())).throws(new ServicesError(ExpandersErrorCodes.EXPAND_ERROR));
                await controller.getEntities(1, 1, ["invalid"]);
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ExpandersErrorCodes.EXPAND_ERROR);
                // tslint:disable-next-line: no-string-literal
                expect(error["statusCode"]).toBe(HttpStatusCode.BAD_REQUEST);
            }
        });

        it("should expand several levels", async () => {
            entities[0][propertyName] = 2;
            entities[1][propertyName] = 3;
            providerMock.setup(x => x.getAll(1,1)).returns(Promise.resolve([entities[0]]));
            // set up expansion tree
            expansionTree.addChild(Expanders[propertyName]).addChild(Expanders[propertyName]);
            expanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            expanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]])))).returns([entities[2]]);
            // act on expand
            const entitiesExpandedReturned = await controller.getEntities(1, 1, [`${propertyName}.${propertyName}`]);
            // assert, should call expand with entities to expand in tree
            expanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            expanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Exactly(1));
            expect(entitiesExpandedReturned).toEqual([entities[0]]);
        });

        it("should expand several categories in same level", async () => {
            providerMock.setup(x => x.getAll(1,1)).returns(Promise.resolve([entities[0]]));
            // set up expansion tree, same level, 3 different expansions
            expansionTree.addChild(Expanders.department)
            expansionTree.addChild(Expanders.office);
            expansionTree.addChild(Expanders.manager);
            // different expander each expansion
            const departmentExpanderMock = new Mock<IExpander>();
            const officeExpanderMock = new Mock<IExpander>();
            const managerExpanderMock = new Mock<IExpander>();
            expanderFactoryMock.setup(x => x.getExpander(Expanders.department)).returns(departmentExpanderMock.object());
            expanderFactoryMock.setup(x => x.getExpander(Expanders.office)).returns(officeExpanderMock.object());
            expanderFactoryMock.setup(x => x.getExpander(Expanders.manager)).returns(managerExpanderMock.object());
            // when calling for next expansion level, just return same object
            departmentExpanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            officeExpanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            managerExpanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]])))).returns([entities[1]]);
            // act on expand
            const entitiesExpandedReturned = await controller.getEntities(1, 1, ["department", "office", "manager"]);
            // assert, should call expand with entities to expand in tree
            departmentExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            officeExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            managerExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[0]]))), Times.Exactly(1));
            // stop expansion in 1st level
            departmentExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Never());
            officeExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Never());
            managerExpanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as T[], [entities[1]]))), Times.Never());
            expect(entitiesExpandedReturned).toEqual([entities[0]]);
        });
    });
}
import { interfaces } from 'inversify';
import { It, Mock, Times } from 'moq.ts';
import request from 'supertest';
import { app } from '../../../src/app';
import { BaseController } from '../../../src/controllers/baseController';
import { container } from "../../../src/app";
import { arraysEqual } from '../helper';

export function executeSharedTests<T extends BaseController<any>>(controller: interfaces.Newable<T>, baseRoute: string, expandable:boolean = true) {
    beforeEach(() => {
        // create a snapshot
        container.snapshot();
    });

    afterEach(() => {
        container.restore();
    });

    describe('when requesting for single entity', () => {
        const entity = { id: 1 };
        let mockedController: Mock<T>;

        beforeEach(() => {
            mockedController = new Mock<T>();
            container.unbind(controller);
            container.bind<T>(controller).toConstantValue(mockedController.object());
            if (expandable) {
                mockedController.setup(x => x.getEntity("1", It.IsAny())).returns(Promise.resolve(entity));
            } else {
                mockedController.setup(x => x.getEntity("1")).returns(Promise.resolve(entity));
            }
        });

        it("should pass id and respond 200 with entity", async () => {
            // call route
            const response = await request(app).get(`/${baseRoute}/1`).expect(200);
            expect(response.body).toEqual(entity);
            if (expandable) {
                mockedController.verify(x => x.getEntity("1", It.IsAny()), Times.Exactly(1));
            } else {
                mockedController.verify(x => x.getEntity("1"), Times.Exactly(1));
            }
        });

        it("should pass expand parameter and respond 200 with entity", async () => {
            // call route
            const response = await request(app).get(`/${baseRoute}/1?expand=manager.manager`).expect(200);
            expect(response.body).toEqual(entity);
            if (expandable) {
                mockedController.verify(x => x.getEntity("1", "manager.manager" as any), Times.Exactly(1));
            } else {
                mockedController.verify(x => x.getEntity("1"), Times.Exactly(1));
            }
        });

        it("should pass multiple expand parameters and respond 200 with entity", async () => {
            // call route
            const response = await request(app).get(`/${baseRoute}/1?expand=manager.manager&expand=manager.office`).expect(200);
            expect(response.body).toEqual(entity);
            if (expandable) {
                mockedController.verify(x => x.getEntity("1", It.Is<string[]>(v => arraysEqual(v, ["manager.manager", "manager.office"]))), Times.Exactly(1));
            } else {
                mockedController.verify(x => x.getEntity("1"), Times.Exactly(1));
            }
        });
    });

    describe('when requesting with limit and offset', () => {
        const entity = { id: 1 };
        let mockedController: Mock<T>;

        beforeEach(() => {
            mockedController = new Mock<T>();
            container.unbind(controller);
            container.bind<T>(controller).toConstantValue(mockedController.object());
            if (expandable) {
                mockedController.setup(x => x.getEntities("1", "2", It.IsAny())).returns(Promise.resolve([entity]));
            } else {
                mockedController.setup(x => x.getEntities("1", "2")).returns(Promise.resolve([entity]));
            }
        });

        it("should pass limit and offset and respond 200 with entity", async () => {
            // call route
            const response = await request(app).get(`/${baseRoute}?limit=1&offset=2`).expect(200);
            expect(response.body).toEqual([entity]);
            if (expandable) {
                mockedController.verify(x => x.getEntities("1", "2", It.IsAny()), Times.Exactly(1));
            } else {
                mockedController.verify(x => x.getEntities("1", "2"), Times.Exactly(1));
            }
        });

        it("should pass expand parameter and respond 200 with entity", async () => {
            // call route
            const response = await request(app).get(`/${baseRoute}?limit=1&offset=2&expand=manager.manager`).expect(200);
            expect(response.body).toEqual([entity]);
            if (expandable) {
                mockedController.verify(x => x.getEntities("1", "2", "manager.manager" as any), Times.Exactly(1));
            } else {
                mockedController.verify(x => x.getEntities("1", "2"), Times.Exactly(1));
            }
        });

        it("should pass multiple expand parameters and respond 200 with entity", async () => {
            // call route
            const response = await request(app).get(`/${baseRoute}?limit=1&offset=2&expand=manager.manager&expand=manager.office`).expect(200);
            expect(response.body).toEqual([entity]);
            if (expandable) {
                mockedController.verify(x => x.getEntities("1", "2", It.Is<string[]>(v => arraysEqual(v, ["manager.manager", "manager.office"]))), Times.Exactly(1));
            } else {
                mockedController.verify(x => x.getEntities("1", "2"), Times.Exactly(1));
            }
        });
    });
}
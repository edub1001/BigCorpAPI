import { It, Mock, Times } from 'moq.ts';
import "reflect-metadata";
import { BaseEntity } from '../../../../src/models/baseEntity';
import { IBaseProvider } from "../../../../src/services/providers/interfaces";
import { IExpander } from '../../../../src/services/expanders/interfaces';

interface IExpanderTestEntities {
    expander: IExpander;
    providerMock: Mock<IBaseProvider<BaseEntity>>,
    entitiesExpanded: BaseEntity[],
    propertyName: string;
}

export function executeSharedTests(createInstanceFn: () => IExpanderTestEntities) {
    describe('when doing expansion', () => {
        let expander: IExpander;
        let providerMock: Mock<IBaseProvider<BaseEntity>>;
        let entitiesExpanded: BaseEntity[]
        let propertyName: string;

        beforeEach(() => {
            ({ expander, providerMock, entitiesExpanded, propertyName } = createInstanceFn());
        });

        it("should expand entity in entities to expand", () => {
            const entitiesToExpand = [];
            const entity = { [propertyName]: entitiesExpanded[0].id };
            // add 2 entities with same value in property to expand
            entitiesToExpand.push(entity);
            entitiesToExpand.push({ ...entity });
            entitiesToExpand.push({ ...entity, [propertyName]: entitiesExpanded[2].id });
            // act on expand
            const entitiesExpandedReturned = expander.expand(entitiesToExpand);
            // assert
            providerMock.verify(x => x.getById(It.Is(v => v === entitiesExpanded[0].id)), Times.Exactly(1));
            providerMock.verify(x => x.getById(It.Is(v => v === entitiesExpanded[1].id)), Times.Never());
            providerMock.verify(x => x.getById(It.Is(v => v === entitiesExpanded[2].id)), Times.Exactly(1));
            // avoid returning duplicated values
            expect(entitiesExpandedReturned).toHaveSize(2);
            expect(entitiesExpandedReturned[0]).toBe(entitiesExpanded[0]);
            expect(entitiesExpandedReturned[1]).toBe(entitiesExpanded[2]);
            // entities should have been expanded to the proper one, first and second to the same entity
            expect(entitiesToExpand[0][propertyName]).toBe(entitiesExpanded[0]);
            expect(entitiesToExpand[1][propertyName]).toBe(entitiesExpanded[0]);
            expect(entitiesToExpand[2][propertyName]).toBe(entitiesExpanded[2]);
        });

        it("should not expand already expanded property", () => {
            // clone and assign expanded entity that will be returned by provider
            const entity = { [propertyName]: { ...entitiesExpanded[0] } };
            const entitiesToExpand = [];
            entitiesToExpand.push(entity);
            providerMock.setup(x => x.getById(It.IsAny())).returns(entitiesExpanded[0]);
            // act on expand
            const entitiesExpandedReturned = expander.expand(entitiesToExpand);
            // assert, shoudl keep object already expanded instead of the one returned by provider
            expect(entitiesExpandedReturned[0]).toBe(entity[propertyName]);
            expect(entity[propertyName]).not.toBe(entitiesExpanded[0]);
        });

        it("should not expand entity not found", () => {
            const entity = { [propertyName]: entitiesExpanded[0].id };
            const entitiesToExpand = [];
            entitiesToExpand.push(entity);
            providerMock.setup(x => x.getById(It.IsAny())).returns(undefined);
            // act on expand
            const entitiesExpandedReturned = expander.expand(entitiesToExpand);
            // assert
            providerMock.verify(x => x.getById(It.Is(v => v === entitiesExpanded[0].id)), Times.Exactly(1));
            // not expanded, collection returned will be empty
            expect(entitiesExpandedReturned).toHaveSize(0);
            // no expansion, keep id
            expect(entity[propertyName]).toBe(entitiesExpanded[0].id);
        });
    });
}
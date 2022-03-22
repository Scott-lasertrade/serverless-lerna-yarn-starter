import { EntityManager, EntityTarget } from 'typeorm';

export const deleteById = async (
    id: number,
    dbConn: EntityManager,
    Entity: EntityTarget<unknown>,
    EntityName: string
) => {
    if (!id) {
        throw new Error('missing parameter: id');
    }

    const entityRepository = dbConn.getRepository(Entity);
    const entityToDelete = await entityRepository.findByIds([id]);

    console.log(entityToDelete);
    if (!entityToDelete || entityToDelete.length === 0) {
        console.log(`Could not find ${EntityName} with id ${id}`);
        throw new Error(`Could not find ${EntityName} with id ${id}`);
    }

    console.log(`deleting ${EntityName}...`);
    await entityRepository.remove(entityToDelete);
    console.log(`deleted ${EntityName}`, entityToDelete);

    return { deletedEntity: entityToDelete };
};

export const list = async (
    dbConn: EntityManager,
    Entity: EntityTarget<unknown>,
    EntityName: string
) => {
    const entityRepository = dbConn.getRepository(Entity);
    const listEntities = await entityRepository.find();

    console.log(listEntities);
    if (!listEntities) {
        console.log(`Could not list results for ${EntityName}`);
        throw new Error(`Could not list results for ${EntityName}`);
    }

    return { listEntities: listEntities };
};

export const search = async (
    dbConn: EntityManager,
    Entity: EntityTarget<unknown>,
    EntityName: string,
    fieldName: string,
    searchTerm: string
) => {
    // TODO: Work out how to handle fuzzy searching for multiword phrases, there's Levenshtein or similarity alrogithms
    const entityRepository = dbConn.getRepository(Entity);
    const formattedSearch = searchTerm.trim().replace(/ /g, ' & ');
    const searchResults = await entityRepository
        .createQueryBuilder()
        .select()
        .where(
            `to_tsvector('simple', ${fieldName}) @@ to_tsquery('simple', :query)`,
            { query: `${formattedSearch}:*` }
        )
        .getMany();

    console.log(searchResults);
    if (!searchResults) {
        console.log(
            `Could not search for ${searchTerm} on ${EntityName}.${fieldName}.`
        );
        throw new Error(
            `Could not search for ${searchTerm} on ${EntityName}.${fieldName}.`
        );
    }

    return { searchResults: searchResults };
};

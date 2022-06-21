const findEntityById = <Entity extends { id: string }>(
    entities: Entity[],
    entityId: Entity["id"],
): Entity | undefined => {
    if (!Array.isArray(entities)) {
        return undefined;
    }

    return entities.find(({ id }) => id === entityId);
};

export { findEntityById };

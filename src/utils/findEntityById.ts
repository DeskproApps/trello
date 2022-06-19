const findEntityById = <Entity>(entities: any[], entityId: string): Entity | undefined => {
    if (!Array.isArray(entities)) {
        return undefined;
    }

    return entities.find(({ id }) => id === entityId);
};

export { findEntityById };

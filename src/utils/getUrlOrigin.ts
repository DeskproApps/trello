const getUrlOrigin = (url: string|null|undefined): void|string => {
    if (!url) {
        return;
    }

    const { origin } = new URL(url);
    return origin;
};

export { getUrlOrigin };

import { extractContent } from '../utils/contentExtractor.js';

export async function extractProductDetails(page, prdClass, url) {
    const results = { url };
    Object.assign(results, Object.fromEntries(await Promise.all(
        Object.entries({
            title: ['content', page, prdClass.title],
            description: ['content', page, prdClass.description],
            details: ['content', page, prdClass.details],
            image: ['attribute', page, prdClass.image, 'src'],
            video: ['attribute', page, prdClass.video, 'src'],
            price: ['content', page, prdClass.price]
        }).map(async ([key, args]) => [key, await extractContent(...args)])
    )));
    return results;
}

export async function processVariants(page, variantClass) {
    const variantsContainer = await page.$$(variantClass.container);
    if (!variantsContainer.length) return [];

    return Promise.all(variantsContainer.map(async (container) => {
        let label = (await extractContent('content', container, variantClass.label)).substring(0, 50);

        const variant = {
            label,
            labelTrimmed: label.length === 50, // Check if label is trimmed. room for error and a bit lazy but i like it cut G
            rawTxt: [],
            hrefs: []
        };

        variant.rawTxt = Array.from(new Set(await container.$$eval('*', (nodes) =>
            nodes.map(node => node.textContent.trim())
                .filter(text => text && text.length <= 50)
        )));

        variant.hrefs = Array.from(new Set(await container.$$eval('a', (nodes) =>
            nodes.map(node => node.getAttribute('href')).filter(href => href)
        )));

        return variant;
    }));
}
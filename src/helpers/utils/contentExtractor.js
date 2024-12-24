/**
 * Universal content extractor for DOM elements
 * @param {string} type - 'content' | 'contents' | 'attribute'
 * @param {Page|ElementHandle} element - Playwright page or element handle
 * @param {string} selector - CSS selector
 * @param {string} [attribute] - Attribute name (only for 'attribute' type)
 * @returns {Promise<string|string[]>}
 */
export const extractContent = async (type, element, selector, attribute = null) => {
    if (!selector) {
        // console.warn('Empty selector provided to extractContent');
        return type === 'content' ? '' : [];
    }

    try {

        const isPage = element.constructor.name === 'Page';
        const handlers = {
            content: async () => {
                if (isPage) {
                    return element.$$eval(selector, elements => {
                        const el = elements[0];
                        if (!el) return '';
                        const listItems = el.querySelectorAll('li');
                        return listItems.length 
                            ? Array.from(listItems).map(li => li.textContent.trim())
                            : el.textContent.trim();
                    });
                } else {
                    const elements = await element.$$(selector);
                    if (!elements.length) return '';
                    const text = await elements[0].textContent();
                    return text ? text.trim() : '';
                }
            },
            contents: async () => {
                if (isPage) {
                    return element.$$eval(selector, 
                        elements => elements.map(el => el?.textContent?.trim() || ''));
                } else {
                    const elements = await element.$$(selector);
                    return Promise.all(elements.map(async el => {
                        const text = await el.textContent();
                        return text ? text.trim() : '';
                    }));
                }
            },
            attribute: async () => {
                if (isPage) {
                    return element.$$eval(selector, 
                        (elements, attr) => elements.map(el => el?.getAttribute(attr) || ''),
                        attribute);
                } else {
                    const elements = await element.$$(selector);
                    return Promise.all(elements.map(async el => {
                        return (await el.getAttribute(attribute)) || '';
                    }));
                }
            }
        };

        return await (handlers[type] || (() => {
            throw new Error(`Invalid extraction type: ${type}`);
        }))();
    } catch (error) {
        console.error(`Error extracting ${type} from ${selector}:`, error);
        return type === 'content' ? '' : [];
    }
}; 
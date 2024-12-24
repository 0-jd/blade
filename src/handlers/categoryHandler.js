import { fetchPagination } from '../helpers/modules/fetchPaginated.js';
import { matchCategory } from '../config/config.js';
import { removePopups } from '../helpers/utils/removePopups.js';

export async function categoryHandler({ request, page, log, enqueueLinks}) {
    await page.waitForLoadState();
    await removePopups(page, log, 3000);
    
    const match = request.url.match(matchCategory);
    const matchedCategory = match ? match[0].toLowerCase() : 'unknown';
    const selector = request.userData.selectors.prdLinks;
    let links = [];

    if (request.userData.config.isPaginated) {
        links = await fetchPagination(page, request, selector, enqueueLinks);
    } else {
        await page.waitForSelector(selector);
        const prdLinks = await page.$$(selector);
        links = await Promise.all(prdLinks.map(async link => {
            const href = await link.evaluate(el => el.getAttribute('href'));
            return href;
        }));
    
    }

    console.log(links.length, 'From request', request.url);

    await enqueueLinks({
        urls: links,
        label: 'product',
        userData: {
            ...request.userData,
            category: matchedCategory,
        },
    });
}

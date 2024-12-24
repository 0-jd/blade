import { processCategory } from '../helpers/modules/processCategory.js';
import { removePopups } from '../helpers/utils/removePopups.js';

export async function defaultHandler({ request, enqueueLinks, log, page }) {
    const { selectors } = request.userData;
    try {
        await page.waitForLoadState();
        await removePopups(page, log, 2000);
        await page.waitForSelector(selectors.navbar, { timeout: 5000 });

        const navbarItems = await page.$$(selectors.navbar); 
        log.info(`Found ${navbarItems.length} navbar items`);

        const matchedUrls = await processCategory(navbarItems, page, log, selectors);
        matchedUrls.push(...lado)
        console.log(matchedUrls);
        await enqueueLinks({
            urls: matchedUrls,
            label: 'category',
            userData: { 
                ...request.userData, 
                site: request.label 
            },
        });
    } catch (error) {
        log.error('Default handler error:', error);
        throw error;
    }
}

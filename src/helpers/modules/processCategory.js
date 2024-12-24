import { matchCategory } from "../../config/config.js";
import { removePopups } from "../utils/removePopups.js";
export async function processCategory(navbarItems, page, log, selectors) {

    const urls = [];
    for (const item of navbarItems) {
    
        try {

            await removePopups(page, log, 1000);
            await item.hover();
            await page.waitForTimeout(500); 

            // Waits for the Pop up to appear and populate the DOM with the links.
            // Ignore the error from this part because it's expected to happen.
            // await removePopups(page, log);
            await item.waitForSelector(selectors.itemsMenu, { timeout: 1000 }).catch(() => { throw new Error(null) });
            const links = await item.$$(selectors.itemsMenu);
            console.log(links.length, 'From processCategory')
            const matchingUrls = await Promise.all(
                links.map(async link => {
                    const href = await link.evaluate(el => el.getAttribute('href'));
                    return matchCategory.test(href) ? href : null;
                })
            ).then(urls => urls.filter(url => url !== null));
            urls.push(...matchingUrls);

            await page.mouse.move(0, 0);
            await page.waitForTimeout(300);
        } catch (error) {
            if (error.message === 'null') continue; // Ignore this error because it's expected to happen.
            log.error(`Error processing navbar item: ${error.message}`);
            continue;
        }
    }
    return urls;
}
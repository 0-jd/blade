import { extractProductDetails, processVariants } from '../helpers/modules/processProducts.js';
import { KeyValueStore, Dataset } from 'crawlee';
import { removePopups } from '../helpers/utils/removePopups.js';

export async function productHandler({ request, page, log }) {
    try {
        const { prdClass, variantClass } = request.userData.selectors;
        await page.waitForLoadState();
        await removePopups(page, log, 2000);
        
        await Promise.all([
            page.mouse.wheel(0, 2000),
            page.waitForTimeout(1000)
        ]);

        const results = await extractProductDetails(page, prdClass, request.url);
        
        // Only process variants if we successfully got product details
        if (Object.values(results).some(val => val && val.length)) {
            results.variants = await processVariants(page, variantClass, prdClass, results);
        } else {
            results.variants = [];
            log.warning('No product details found, skipping variant processing. Product URL: ', request.url);
            
            const failedUrlData = {
                url: request.url,
                timestamp: new Date().toISOString(),
                reason: 'No product details found'
            };

            // Log the failed URL to the storage
            const store = await KeyValueStore.open('failed-fetch');
            let failedUrls = await store.getValue('products') || [];
            failedUrls.push(failedUrlData);
            await store.setValue('products', failedUrls);
        }
        
        console.log(JSON.stringify(results, null, 2));
        const storage = await Dataset.open(`${request.userData.site}/${request.userData.category}`);
        await storage.pushData(results);
        await page.keyboard.press('Escape').catch(() => {});
        
    } catch (error) {
        log.error('Product handler error:', error);
        throw error;
    }
}

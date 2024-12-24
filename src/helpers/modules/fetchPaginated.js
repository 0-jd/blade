import { log } from "crawlee";


const DEFAULT_TIMEOUT = 1000;
const MAX_RETRIES = 3;

/**
 * Fetches paginated content by either scrolling, clicking a load more button, or extracting links
 * @param {Object} page - Playwright page object
 * @param {Object} config - Configuration object containing pagination settings
 * @param {string} productSelector - CSS selector for product elements
 * @param {RequestQueue} requestQueue - Crawlee request queue
 * @returns {Promise<string[]>} Array of unique product URLs
 */
export async function fetchPagination(page, request, productSelector, enqueueLinks) {
    const config = request.userData.config;
    log.info('Fetching paginated content');
    const extractedLinks = new Set();

    try {
        if (config.paginateMode === 'scroll') {
            await handleScrollPagination(page, config, productSelector, extractedLinks);
        } else if (config.paginateMode === 'click') {
            await handleClickPagination(page, config, productSelector, extractedLinks);
        } else if (config.paginateMode === 'extract') {
            await handleExtractPagination(page, request, config, productSelector, extractedLinks, enqueueLinks);
        } else {
            throw new Error(`Invalid pagination mode: ${config.paginateMode}`);
        }
    } catch (error) {
        console.error('Fatal error during pagination:', error.message);
        console.log(error);
    } finally {
        console.log(`Total unique links found: ${extractedLinks.size}`);
        return Array.from(extractedLinks);
    }
}

// Helper function to extract links safely (now outside fetchPagination)
async function extractCurrentLinks(page, productSelector) {
    await page.waitForSelector(productSelector);
    const prdLinks = await page.$$(productSelector);
    const links = await Promise.all(prdLinks.map(async link => {
        const href = await link.evaluate(el => el.getAttribute('href'));
        return href;
    }));
    return links;
}

// Function to handle scroll-based pagination
async function handleScrollPagination(page, config, productSelector, extractedLinks) {
    let noNewLinks = 0;

    while (noNewLinks < MAX_RETRIES) {
        try {
            // await page.waitForTimeout(DEFAULT_TIMEOUT);
            const links = await extractCurrentLinks(page, productSelector);
            const initialSize = extractedLinks.size;
            links.forEach(link => extractedLinks.add(link));
            console.log(links.length, 'From scroll')

            await page.locator(config.loadMoreSelector).scrollIntoViewIfNeeded().catch(() => { });

            // Wait for potential new content to load
            await page.waitForTimeout(2 * DEFAULT_TIMEOUT);

            if (extractedLinks.size === initialSize) {
                noNewLinks++;
                console.log(`No new links found. Attempt ${noNewLinks} of ${MAX_RETRIES}`);
            } else {
                noNewLinks = 0;
                console.log(`Found ${extractedLinks.size - initialSize} new links`);
            }
        } catch (scrollError) {
            console.error('Error during scroll pagination:', scrollError.message);
            break;
        }
    }
}

// Function to handle click-based pagination
async function handleClickPagination(page, config, productSelector, extractedLinks) {
    const buttonSelector = config.loadMoreSelector;
    let noNewLinks = 0;

    // Extract initial links
    const initialLinks = await extractCurrentLinks(page, productSelector);
    initialLinks.forEach(link => extractedLinks.add(link));
    console.log(`Initially found ${extractedLinks.size} links`);

    while (noNewLinks < MAX_RETRIES) {
        try {
            const button = await page.$(buttonSelector);
            if (!button) {
                console.log('Load more button not found in DOM. Returning extracted links.');
                break;
            }

            const initialSize = extractedLinks.size;

            await page.waitForLoadState()
                .catch(() => console.log('Network did not reach idle state'));
            await button.click();

            const newLinks = await extractCurrentLinks(page, productSelector);
            newLinks.forEach(link => extractedLinks.add(link));

            if (extractedLinks.size === initialSize) {
                noNewLinks++;
                console.log(`No new links found. Attempt ${noNewLinks} of ${MAX_RETRIES}`);
            } else {
                noNewLinks = 0;
                console.log(`Found ${extractedLinks.size - initialSize} new links`);
            }
        } catch (buttonError) {
            console.error('Error during button pagination:', buttonError.message);
            break; 
        }
    }
}

// Function to handle link extraction-based pagination
async function handleExtractPagination(page, request, config, productSelector, extractedLinks, enqueueLinks) {
    const linkSelector = config.linkSelector;
    const nextButtonSelector = config.loadMoreSelector;

    try {

        const productLinks = await extractCurrentLinks(page, productSelector);
        productLinks.forEach(link => extractedLinks.add(link));
        console.log(`Initially found ${extractedLinks.size} product links`);

        const nextButton = await page.$(nextButtonSelector);
        if (nextButton) {
            const nextHref = await nextButton.evaluate(el => el.getAttribute('href'));
            if (nextHref) {
                console.log(nextHref)

                await enqueueLinks({
                    urls: [nextHref],
                    userData: {
                        ...request.userData,
                        label: 'category',
                        referrer: page.url(),
                    },
                    forefront: true,
                });
                console.log(`Added next page ${nextHref} to the queue.`);
            } else {
                console.log('Next button found but does not have an href. Stopping pagination.');
            }
        } else {
            console.log('No next button found. Stopping pagination.');
        }
    } catch (extractError) {
        console.error('Error during link extraction:', extractError.message);
      
    }
}


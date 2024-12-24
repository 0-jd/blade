import { fetchPagination } from "./fetchPaginated.js";

export async function fetchCategory(request, page) {

    const selector = request.userData.selectors.prdLinks;

    if (request.userData.config.isPaginated) {
        console.log(request.url)
        const links = await fetchPagination(page, request.userData, selector);
        return links;
    }

    await page.waitForSelector(selector);
    const prdLinks = await page.$$(selector);
    const links = await Promise.all(prdLinks.map(async link => {
        const href = await link.evaluate(el => el.getAttribute('href'));
        return href;
    }));
    return links;
};
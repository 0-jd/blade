const popupSelectors = [
    '[class*="popup"]',
    '[id*="popup"]',
    '[class*="modal"]',
    '[id*="modal"]',
    'dialog',
    '[role="dialog"]',
    '[aria-modal="true"]',
    '[class*="overlay"]',
    '[class*="lightbox"]',
    '[class*="notification"]',
    '[class*="cookie"]',
    '[class*="consent"]',
    '[class*="cookie-consent"]',
    '[class*="cookie-banner"]',
    '[class*="cookie-notice"]',
    '[aria-label*="POPUP"]',
];

const closeButtonSelectors = [
    'button',
    '[class*="close"]',
    '[id*="close"]',
    '[aria-label*="close"]',
    '[aria-label*="Close"]',
    '[class*="close-button"]',
    '[class*="close-icon"]',
    '[class*="close-icon"]',
    '[class*="close-button"]',
];

const acceptButtonSelectors = [
    '[class*="accept"]',
    '[id*="accept"]',
    '[aria-label*="accept"]',
    'button',
];

/**
 * Helper function to remove popups using multiple detection strategies
 * @param {Page} page - Crawlee/Playwright page object
 * @param {Object} log - Crawlee logger object
 * @param {number} [waitTimeout=1000] - Time to wait for additional popups to appear (in milliseconds)
 * @param {string[]} [excludedSelectors=[]] - Array of CSS selectors to exclude from the removal process
 */
export async function removePopups(page, log, waitTimeout = 1000, excludedSelectors = []) {
    // Toggle for logging removed elements
    const shouldLogRemovedElements = true;

    try {

        const filteredPopupSelectors = popupSelectors.filter(selector => !excludedSelectors.includes(selector));
        const filteredCloseButtonSelectors = closeButtonSelectors.filter(selector => !excludedSelectors.includes(selector));

        async function acceptCookieConsent() {
            await page.evaluate((selectors) => {
                for (const selector of selectors) {
                    const buttons = Array.from(document.querySelectorAll(selector));
                    buttons.forEach(button => {
                        const buttonText = button.textContent.toLowerCase();
                        if (buttonText.includes('accept') || buttonText.includes('agree') || buttonText.includes('ok')) {
                            button.click();
                        }
                    });
                }
            }, acceptButtonSelectors)
            console.log('Cookie consent accepted.');
        }

        await acceptCookieConsent();


        async function removeOrCloseElements(popupSelectors, closeButtonSelectors) {
            return await page.evaluate(({ popupSelectors, closeButtonSelectors, shouldLogRemovedElements, excludedSelectors }) => {
                let count = 0;

                const isExcluded = (element, excludedSelectors) => {
                    if (!excludedSelectors || excludedSelectors.length === 0) {
                        return false;
                    }
                    for (const selector of excludedSelectors) {
                        if (element.matches(selector) || element.querySelector(selector)) {
                            return true;
                        }
                    }
                    return false;
                };

                const removeElements = (selectors) => {
                    for (const selector of selectors) {
                        const elements = Array.from(document.querySelectorAll(selector));
                        elements.forEach(element => {
                            if (!isExcluded(element, excludedSelectors)) {
                                if (shouldLogRemovedElements) {
                                    console.log('Removing element:', element);
                                }
                                element.remove();
                                count++;
                            } else if (shouldLogRemovedElements) {
                                console.log('Skipping removal of excluded element:', element);
                            }
                        });
                    }
                };

                const closeElements = (selectors) => {
                    for (const selector of selectors) {
                        const buttons = Array.from(document.querySelectorAll(selector));
                        buttons.forEach(button => {
                            if (!isExcluded(button, excludedSelectors)) {
                                const buttonText = button.textContent.toLowerCase();
                                if (buttonText.includes('close') || buttonText.includes('x') || buttonText.includes('dismiss')) {
                                    if (shouldLogRemovedElements) {
                                        console.log('Closing element:', button);
                                    }
                                    button.click();
                                    count++;
                                }
                            } else if (shouldLogRemovedElements) {
                                console.log('Skipping closing of excluded element:', button);
                            }
                        });
                    }
                };

                removeElements(popupSelectors);
                closeElements(closeButtonSelectors);

                const highZIndexElements = Array.from(document.querySelectorAll('*'));
                highZIndexElements.forEach(element => {
                    const zIndex = parseInt(window.getComputedStyle(element).zIndex);
                    if (zIndex > 9999) {
                        if (shouldLogRemovedElements) {
                            console.log('Removing element with high z-index:', element);
                        }
                        element.remove();
                        count++;
                    }
                });

                return count;
            }, { popupSelectors, closeButtonSelectors, shouldLogRemovedElements, excludedSelectors });
        }
        
        await removeOrCloseElements(filteredPopupSelectors, filteredCloseButtonSelectors);
        await new Promise(resolve => setTimeout(resolve, waitTimeout));
        await removeOrCloseElements(filteredPopupSelectors, filteredCloseButtonSelectors);

        return true;
    } catch (error) {
        log.error('Error removing popups:', { message: error.message });
        return false;
    }
}
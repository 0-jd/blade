import { createPlaywrightRouter } from 'crawlee';
import { defaultHandler } from '../handlers/defaultHandler.js';
import { categoryHandler } from '../handlers/categoryHandler.js';
import { productHandler } from '../handlers/productHandler.js';

export const router = createPlaywrightRouter();

router.addDefaultHandler(defaultHandler);
router.addHandler('category', categoryHandler);
router.addHandler('product', productHandler);
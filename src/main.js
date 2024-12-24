import 'dotenv/config';
import { PlaywrightCrawler } from "crawlee";
import { router } from "./helpers/routes.js";
import { startUrls } from "./config/urls.js";


const crawler = new PlaywrightCrawler({
    requestHandler: router,
});

crawler.run(startUrls);
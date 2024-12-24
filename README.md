# Crawlee + Playwright Project for E-commerce Scraping

This project utilizes Crawlee and Playwright to scrape product data from various e-commerce websites. It's designed to be a production-ready boilerplate, offering a robust and scalable solution for web scraping tasks.

## Features

- **Modular Design**: The project is structured with separate modules for different tasks:
    - `defaultHandler.js`: Handles navigation and initial category link extraction.
    - `categoryHandler.js`: Processes category pages, handles pagination and extracts product links.
    - `productHandler.js`: Scrapes detailed information from product pages, including variants.
    - `routes.js`: Manages routing of requests to appropriate handlers.
    - `config.js`: Contains configuration settings like regex for category matching.
    - `urls.js`: Defines the starting URLs and their specific configurations.
    - `selectors.js`: Centralized location for all CSS selectors for different sites.
    - `processCategory.js`: Extracts category links from navigation bars.
    - `fetchPaginated.js`: Handles pagination logic using different techniques.
    - `processProducts.js`: Extracts main product details and processes variants.
    - `utils`: Contains helper functions like `removePopups.js` and `contentExtractor.js`.
- **Dynamic Configuration**: Each starting URL includes its own specific configuration and CSS selectors.
- **Flexible Pagination Handling**: Supports multiple pagination techniques:
    - Scroll-based pagination.
    - Click-based pagination (load more buttons).
    - Extraction based pagination using next page links.
- **Robust Error Handling**: Implements error handling in different modules to ensure graceful scraping and logging of errors.
- **Data Persistence**: Product details are saved in Crawlee datasets, allowing for easy storage and retrieval.
- **Headless Browser**: Uses Playwright for browser automation, ensuring compatibility with complex websites and JS rendering.
- **Environment Variables**: Utilizes dotenv for configuration, making it easy to manage API keys and other secrets.

## Project Structure
```
.
├── config/
│ ├── config.js # Configuration settings (e.g. matchCategory)
│ ├── selectors.js # CSS selectors for various sites
│ └── urls.js # Starting URLs and associated configurations
├── handlers/
│ ├── categoryHandler.js # Handles category pages and product link extraction
│ ├── defaultHandler.js # Default handler for initial navigation and category extraction
│ └── productHandler.js # Extracts product details from product pages
├── helpers/
│ ├── modules/
│ │ ├── fetchPaginated.js # Handles paginated content using different techniques
│ │ ├── processCategory.js # Extracts category links from navigation menus
│ │ └── processProducts.js # Extracts product details and processes variants
│ └── utils/
│ ├── contentExtractor.js # Extracts content from the DOM
│ └── removePopups.js # Removes popups using multiple detection strategies
├── routes.js # Configures request routing
├── main.js # Main entry point of the crawler
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (>=16.0.0)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_name>

### Install dependencies:

```bash
npm install
```
or
```bash
yarn install
```

Create a .env file in the root of the project, and add your environment variables.

### Running the Crawler

```bash
npm start
```

This will start the crawler which will navigate to the URLs specified in urls.js, extract product data and save it in dataset storage.
You can monitor the progress and view the data in the Crawlee console using crawlee open.

### Configuration

#### Start URLs (config/urls.js)

```javascript
export const startUrls = [
    {
      url : 'https://www.quince.com',
      label : 'quince',
      userData : {
        selectors : selectors.quince,
        config : {
          isPaginated : false,
          returnAllPages : false,
          paginteMode : '',
          loadMoreSelector : '',
        }
      }
    },
   // ... other sites
];
```

Each object in the startUrls array defines:

- url: The starting URL to crawl.
- label: An identifier for the site
- userData:

selectors: Object which contains the CSS selectors specified in selectors.js needed for scraping the given url.

config: Various config options for pagination and other site specific behavior.

CSS Selectors (config/selectors.js)

This file contains CSS selectors for various sites in an object called selectors. The keys correspond to the labels defined in urls.js. Each key maps to an object with properties for navigation, links, and product details. Example:

```javascript
const quinceSelectors = {
    navbar : ".header-module--desktopMenu--7a2b6",
    navBarItems : "",
    itemsMenu : ".megaMenu-module--megaMenu--1fcef",
    itemsMenuLink : "",
    prdLinks : '.product-card-module--productCard--340e0',
    prdClass : {
        title : "h1.productInfo-module--container__header__text--9c624",
        description : ".productForm-module--container__content--a6ef5 p",
        price : ".sales_price_selector_for_force_update",
        image : ".productImages-module--image_container--afd3f img",
        video : "",
        details : ".productDetails-module--productDetails__textContent--2757e ul",
    },
    variantClass : {
        container: ".productForm-module--container--e9f9b .productForm-module--container__options--f896f",
        button: ".optionSelector-module--optionWrapper--9e7bf, .productForm-module--container__options__option--c0bc4 a",
        label : "legend.productForm-module--container__label--b33f0 , .productForm-module--container__label--b33f0 span",
        Price : ".sales_price_selector_for_force_update",
        Image : ".custom-swiper-module--swiperContainer--31a86 img",
        Video : "",
        Details : ".productDetails-module--productDetails__textContent--2757e ul",
        Description : ".productForm-module--container__content--a6ef5 p",
    }
}
```

#### Category Matching (config/config.js)

You can configure the regular expression used to match category links. Example:

```javascript
export const matchCategory = /earrings/i
```

This regex is used to filter navigation links and to categorize products.

#### Request Routing (routes.js)

The router defines how to handle different types of requests:

defaultHandler: The default handler that is run at the initial url and is responsible for adding to the queue

categoryHandler: For requests labeled as "category" which corresponds to a category page.

productHandler: For requests labeled as "product" which corresponds to a product page.

### Customization

Add More Sites: To add a new site, add a new object to startUrls in urls.js and add the corresponding CSS selectors in selectors.js.

Customize Pagination: Modify the fetchPagination.js to handle new pagination techniques

Data Extraction: Adjust the selectors in selectors.js and adapt processProducts.js to extract your specific product details.

Add new features: Create new handlers for more specific logic, or expand current handlers with more features.

### Dependencies

crawlee: A web scraping and automation library.

playwright: A library for browser automation.

dotenv: For managing environment variables.

axios: For making HTTP requests.

string-similarity: A library for comparing strings


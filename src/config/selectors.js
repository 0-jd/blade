
// const sitesConfig = [
//     {
//       site: {
//         name: "Quince",
//         baseURL: "https://www.quince.com",
//         scrapeURL: "",
//         type: "Jewelry"
//       },
//       selectors: {
//         navbar: ".header-module--desktopMenu--7a2b6",
//         navBarItems: ".header-module--desktopMenu--7a2b6 > div",
//         categoryLinks: ".megaMenu-module--megaMenu--1fcef",
//       },
//       config : {
//         categories: [],
//         maxPrdScrape: 0,
//         maxCatScrape: 0,
//       }
//     }
//   ];


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

const oakandlunaSelectors = {
    navbar : ".mainMenu_MainMenu__B1l0t > .accordion-group-items",
    navBarItems : "",
    itemsMenu : ".accordion-group-items",
    itemsMenuLink : "",
    prdLinks : '.productListing_ProductsGrid__PNfcb',
    prdClass : {
        title : ".productName_ProductName__CcylB",
        description : ".description_Description__8yExe",
        price : ".productPage_MainInfo__RRMfG .selling-price",
        image : ".mediaGallery_Container__URsv_ img",
        video : ".productVideo_VimeoPlayer__4yCMA iframe",
        details : ".material_Information__k3Mgc ul",
    },
    variantClass : {
        container: ".iec-type-selection",
        label : ".iec-category-label",
    }
}

const shopdorseySelectors = {
    navbar : ".Header__MainNav .HorizontalList__Item",
    navBarItems : "",
    itemsMenu : ".MegaMenu__Links",
    itemsMenuLink : "",
    prdLinks : '.ProductList a',
    prdClass : {
        title : ".ProductMeta__Title",
        description : ".Rte p",
        price : ".productPage_MainInfo__RRMfG .selling-price",
        image : ".Product__Slideshow img",
        video : ".Product__Slideshow source",
        details : ".ProductMeta__AccordionDescription",
    },
    variantClass : {
        container: ".ProductForm__Variants",
        label : ".ProductForm__Label",
    }
}

const davidyurmanSelectors = {
    navbar : "ul.js-top-nav .nav-item",
    navBarItems : "",
    itemsMenu : ".dropdown-item a",
    itemsMenuLink : "",
    prdLinks : 'a.pdp-link',
}

const stoneandstrandSelectors = {
    navbar : ".main-nav > ul > li",
    navBarItems : "",
    itemsMenu : ".main-nav__column a",
    itemsMenuLink : "",
    prdLinks : '.product-card__visual a',
    prdClass : {
        title : ".product__name > h1",
        description : ".product__description-content",
        price : "p.product__price",
        image : ".product__thumbs-wrapper img",
        video : ".product-card__video",
        details : ".product-card__details",
    },
    variantClass : {
        container: ".product__options > .product__option",
        label : "label",
    }
}

const zalesoutletSelectors = {
    navbar : ".primary-container .main-nav > ul > .node-link",
    navBarItems : "",
    itemsMenu : ".node-link a",
    itemsMenuLink : "",
    prdLinks : '.product-scroll-wrapper .prod-row-item a.main-thumb',
    prdClass : {
        title : ".product-detail__summary--name h1",
        description : "#ngb-accordion-item-1 .accordion-content__description",
        price : ".product-price__price",
        image : ".swiper-wrapper img",
        video : ".product-video",
        details : ".product-details",
    }
}

// vimeoVideoPlayer_VimeoVideoPlayer__Xih4x productVideo_VimeoPlayer__4yCMA

// .iec-edit-mode-wrapper 

export const selectors = {
    quince : quinceSelectors,
    oakandluna : oakandlunaSelectors,
    shopdorsey : shopdorseySelectors,
    davidyurman : davidyurmanSelectors,
    stoneandstrand : stoneandstrandSelectors,
    zalesoutlet : zalesoutletSelectors,
}

// itemEditorWrapper_ItemEditorWrapper__qZoBJ productOptions_ProductOptions__tAO6_
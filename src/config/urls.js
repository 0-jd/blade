import { selectors } from "./selectors.js";


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
    {
      url : 'https://www.oakandluna.com/',
      label : 'oakandluna',
      userData : {
        selectors : selectors.oakandluna,
        config : {
          isPaginated : true,
          paginateMode : 'click',
          loadMoreSelector : '.productListing_LoadMore__9YkAc',
        }
      }
    },
    {
      url : 'https://www.shopdorsey.com/',
      label : 'shopdorsey',
      userData : {
        selectors : selectors.shopdorsey,
        config : {
          isPaginated : true,
          paginateMode : 'extract',
          loadMoreSelector : 'a[title="Next page"]',
        }
      }
    },
    {
      url : 'https://www.stoneandstrand.com',
      label : 'stoneandstrand',
      userData : {
        selectors : selectors.stoneandstrand,
        config : {
          isPaginated : false,
          paginateMode : '',
          loadMoreSelector : '',
        },
      }
    },
    {
      url : 'https://www.zalesoutlet.com/',
      label : 'zalesoutlet',
      userData : {
        selectors : selectors.zalesoutlet,
        config : {
          isPaginated : false,
          paginateMode : '',
          loadMoreSelector : '',
        }
      }
    },
  ]


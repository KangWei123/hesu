import {
  listAllStoreByAppId,
  queryProvinceList,
  queryCityList,
  queryStoreByLocation,
  stroeQuery,
} from '@/mod-console/src/api/storeApi';

import { listIndustries, listApp, listAllApp, allApp } from '@/mod-console/src/api/appApi';

export const sharedStoreApi = {
  queryProvinceList,
  queryCityList,
  queryStoreByLocation,
  listAllStoreByAppId,
  stroeQuery,
};

export const sharedAppApi = {
  listIndustries,
  listApp,
  listAllApp,
  allApp,
};

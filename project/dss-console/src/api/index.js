import wpBaseApi from '@/business-common/wp-base-api';
const WpSchema = wpBaseApi.WpSchema;
export const app = {
  list: WpSchema + '',
  add: WpSchema + '',
  update: WpSchema + '',
};

import baseApi from '@/dss-common/api/base';

const params = {
  isSetMenu: true,
  isRedirect: false
};
export default baseApi.checklogin(params).then(
  res => {
    return res;
  },
  res => {
    throw res;
  }
);

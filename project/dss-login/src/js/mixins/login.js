import { login as loginRequest } from '@/dss-login/src/api/index';
import wpBaseApi from '@/business-common/wp-base-api';
import utilUrl from '@/dss-common/utils/url';
import Cookies from 'js-cookie';
import axios from 'axios';
import services from '@/dss-common/utils/services';
import chooseApi from '@/business-common/api/epApi';

const WHITE_DOMAIN = /(wakedata.com)|(wakedata.cn)|(wakecloud.com)/;
export default {
  methods: {
    isNotSafe() {
      const gotoUrl = utilUrl.queryString('gotoUrl', window.location.href);
      try {
        const { href, protocol, hostname } = new URL(gotoUrl, window.location.href);
        return !!href && !/^https?:$/.test(protocol) && !WHITE_DOMAIN.test(hostname.split('.').slice(-2).join('.'));
      } catch {
        /* ignore */
      }
      return true;
    },
    /**
     *
     * @param {*} params 接口请求参数
     * @param {*} isAutoLogin 是否为自动登录，第一次登录失败后(wp接口抛出)，尝试自动登录一次
     */
    login(params, isAutoLogin = false) {
      this.$emit('on-loading');
      const failCB = res => {
        this.$emit('un-loading');
        this.$message({
          showClose: true,
          type: 'error',
          duration: 2000,
          message: res.errorMessage || '登录失败，请重试',
        });
      };

      return loginRequest(params)
        .then(res => {
          if (res.errorCode === 302) {
            this.$emit('un-loading');
            window.top.location.href = res.errorMessage;
            return;
          }
          if (!res.success || res.success === 'false' || res.data === false || res.data === 'false') {
            failCB(res);
            return;
          }

          const gotoUrl = utilUrl.queryString('gotoUrl', window.location.href);

          // 查询登录成功后才跳
          wpBaseApi
            .checkWpLogin(false)
            .then(() => {
              if (gotoUrl) {
                if (this.isNotSafe()) {
                  this.$message({
                    showClose: true,
                    type: 'error',
                    duration: 2000,
                    message: '域名不安全，跳转失败',
                  });
                } else {
                  this.$emit('un-loading');
                  window.top.location.href = gotoUrl;
                }
              } else {
                this.$emit('ok');
                window.top.location.href = '/wkb.html';
              }
            })
            .catch(res2 => {
              if (isAutoLogin) {
                failCB(res2);
              } else {
                this.login(params, true);
              }
            });
        })
        .catch(res => {
          failCB(res);
        });
    },
    async checkInUmp(applist, { id, userId }, gotoUrl) {
      const rs = applist.some(item => item.id === parseInt(id));
      if (rs) {
        await chooseApi.chooseEp({
          employeeChooseAppId: id,
          employeeId: userId,
        });
        window.top.location.href = gotoUrl;
      } else {
        window.top.location.href = '/app.html';
      }
    },
    /**
     * 惟数平台登录
     */
    wsLogin(username, password) {
      // 须在nginx上配置相关代理转发
      localStorage.removeItem('wdToken');
      return services
        .post(
          '/dw/auth/login?clientId=',
          {
            username,
            password,
          },
          {
            // 单独配置
            withCredentials: true,
            hidden: true,
          }
        )
        .done(res => {
          if (res.success) {
            return axios.get('/crossGetUserInfo', {
              // 单独配置
              withCredentials: true,
            });
          }
        })
        .done(res => {
          console.log('crossGetUserInfo', res);
          if (res.data && res.data.data) {
            const tokenCookie = res.data.data.tokenCookie;
            localStorage.setItem('wdToken', tokenCookie.value);
            // const cookieApi = Cookies.withAttributes({ path: '/', domain: '.wakedata.com' });
            Cookies.set(tokenCookie.name, tokenCookie.value, { path: '/', domain: '.wakedata.com' });
          }
        });
    },
  },
};

/**
 * 这里是ajax的通用访问接口处理
 */
import axios from 'axios';
import Qs from 'qs';
import './expromise';
import Message from './msgbox';

const showMessage = (message, type = 'error') => {
  Message({
    showClose: true,
    type: type,
    duration: 4000,
    message,
  });
};

export default {
  /**
   * 封装导出Excal文件post请求
   * @param url  下载接口url
   * @param data 参数
   * @param name 文件名
   * @returns {Promise}
   */
  download(url, options = {}, name) {
    this.filterEmptyKey(options, false);
    return new Promise((resolve, reject) => {
      axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
      axios({
        method: 'post',
        url: url, // 请求地址
        data: options, // 参数
        responseType: 'blob', // 表明返回服务器返回的数据类型
      }).then(
        response => {
          let blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel',
          });
          if (blob === null) {
            blob = new Blob([response.data], {
              type: 'application/octet-stream',
            });
          }
          // 判断类型是否返回json，返回json时报错
          if (response.data.type !== 'application/vnd.ms-excel' && response.data.type !== 'application/octet-stream') {
            const reader = new FileReader();
            reader.onload = e => {
              const result = JSON.parse(e.target.result);
              if (result) {
                showMessage(result.errorMessage || result.msg);
                return reject(result);
              }
            };
            reader.readAsText(blob);
          } else {
            resolve(response.data);
            const now = new Date();
            const fileName = name ? name + '.xlsx' : now.getTime() + '.xlsx';
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              // 释放内存
              window.URL.revokeObjectURL(link.href);
            }
          }
        },
        err => {
          reject(err);
        }
      );
    });
  },

  /**
   * 服务端接口empty字符串跟null返回的结果不同，过滤掉empty字符串
   * @param params
   * @param emptyString 是否过滤空字符串
   */
  filterEmptyKey(params, emptyString) {
    Object.keys(params).forEach(key => {
      if (params[key] === null || (emptyString && params[key] === '')) {
        delete params[key];
      }
    });
  },

  /**
   * 封装导出Excal文件get请求
   * @param url  下载接口url
   * @param data 参数
   * @param name 文件名
   * @returns {Promise}
   */
  getDownload(url, options = {}, name) {
    this.filterEmptyKey(options, true);
    options = Qs.stringify(options, {
      arrayFormat: 'repeat',
    });
    return new Promise((resolve, reject) => {
      axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
      axios({
        method: 'get',
        url: url + '?' + options, // 请求地址
        responseType: 'blob', // 表明返回服务器返回的数据类型
      }).then(
        response => {
          let blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel',
          });
          if (blob === null) {
            blob = new Blob([response.data], {
              type: 'application/octet-stream',
            });
          }
          // 判断类型是否返回json，返回json时报错
          if (response.data.type !== 'application/vnd.ms-excel' && response.data.type !== 'application/octet-stream') {
            const reader = new FileReader();
            reader.onload = e => {
              const result = JSON.parse(e.target.result);
              if (result) {
                showMessage(result.errorMessage || result.msg);
                return reject(result);
              }
            };
            reader.readAsText(blob);
          } else {
            // 正确时导出文件
            resolve(response.data);
            const now = new Date();
            const fileName = name ? name + '.xlsx' : now.getTime() + '.xlsx';
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              // 释放内存
              window.URL.revokeObjectURL(link.href);
            }
          }
        },
        err => {
          reject(err);
        }
      );
    });
  },
};

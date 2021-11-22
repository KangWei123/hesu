import services from '@/dss-common/utils/services';
import date from '@/dss-common/utils/date';
import { blob2JSON } from '@/dss-common/utils/binary';

/**
 * 导出方法
 * @param {{url: string, method?: string, data: any, headers?: object, withFileName?: boolean}} params
 */
export function exporter(params) {
  const { url, method, data, headers, ...others } = params;
  const payload = {
    url: url,
    method: method || 'POST',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...others,
  };

  if (payload.method === 'GET') {
    payload.params = data;
  } else {
    payload.data = data;
  }

  return services(payload).then(
    /**
     * @param {Blob} res | AxiosResponse<any>
     * 如果 res.config.withFileName 存在返回的是 AxiosResponse<any>
     * 如果 res.config.withFileName 不存在返回的是 Blob
     */
    async res => {
      const withFileName = res && res.config && res.config.withFileName;
      let responseData = res;
      if (withFileName) {
        responseData = res.data;
      }
      if (responseData.type.includes('json')) {
        const jsonRes = await blob2JSON(responseData);
        throw new Error(jsonRes.errorMessage || jsonRes.msg || jsonRes.message || jsonRes.error || '格式错误');
      }

      let fileName = date.format(new Date(), 'MM月DD日'); // 下载的文件名
      if (withFileName) {
        fileName = res.headers['content-disposition'];
        if (fileName && fileName.length >= 2) {
          fileName = fileName.split('=')[1];
        }
        fileName = decodeURIComponent(fileName);
      }

      const link = document.createElement('a');
      const blob = new Blob([responseData], { type: 'application/vnd.ms-excel' });

      link.style.display = 'none';
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  );
}

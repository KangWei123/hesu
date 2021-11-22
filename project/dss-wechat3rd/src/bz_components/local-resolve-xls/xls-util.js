/**
 * Created by a123 on 2020/3/18.
 * @author trumpli<李志伟>
 */

import XLSX from 'xlsx';

export default {
  readFile(file) {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onload = function(e) {
        // pre-process data
        const bytes = new Uint8Array(e.target.result);
        const length = bytes.byteLength;
        let binary = '';
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        /* read workbook */
        const wb = XLSX.read(binary, { type: 'binary' });

        /* grab first sheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        /* generate JSON */
        const JSON = XLSX.utils.sheet_to_json(ws);
        resolve(JSON);
      };
      reader.readAsArrayBuffer(file);
    });
  }
};

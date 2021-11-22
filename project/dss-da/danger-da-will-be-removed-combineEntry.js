/**
 * Created by love on 18/9/3.
 * @author trumpli<李志伟>
 */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

function absPath(file) {
  return path.join(__dirname, file);
}

module.exports = function(entryChunk) {
  return {
    entry: {
      da: absPath('src/index.js')
    },
    plugins: [
      // 快速注册
      new HtmlWebPackPlugin({
        template: absPath('src/index.html'),
        filename: 'da.html',
        chunks: entryChunk('da')
      })
    ]
  };
};

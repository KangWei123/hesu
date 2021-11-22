export default {
  //js方法的媒体查询
  /* eslint-disable */
  mediaInquiry() {
    !(function () {
      function e() {
        var e = document.documentElement.clientWidth,
          t = document.querySelector('html'),
          f = (e > 770 ? 320 : e) / 20;
        window.fontSize = f;
        t.style.fontSize = f + 'px';
      }
      e(), window.addEventListener('resize', e);
    })();
  }
};

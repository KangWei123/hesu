<div class="header-nav">
  <div class="nav-box" id="key-header">
    <div class="pc">
      <div class="header <%= type || '' %>">
        <a class="logo" href="javascript:;" style="display: inline-block;cursor: default;">
          <img class="header-logo publicLogo" src="https://cdn.wakedata.com/resources/dss-web-portal/portal/image/logo-d.cf61866d.png" />
          <img class="header-logo privateLogo"
            src="https://cdn.wakedata.com/resources/dss-web-portal/portal/image/logo-d.cf61866d.png" />
        </a>
      </div>
    </div>
    <div class="mobile" id="header-mobile">
      <div class="header <%= type || '' %>">
        <div class="left">
          <a href="javascript:;" style="display: inline-block;cursor: default;">
            <img class="header-logo" src="https://cdn.wakedata.com/resources/dss-web-portal/portal/image/logo-d.cf61866d.png" />
          </a>
        </div>
      </div>

    </div>
  </div>
  <div class="app-loading app-loading-hide" id="app-loading">
    <img src="<%= require('@/dss-common/img/loading.gif') %>" />
  </div>
</div>
<script>
  (function () {
    /* eslint-disable */
    //三方来源访问:加个进度条,隐藏头部
    if (location.search.indexOf('third-corp=') != -1) {
      document.getElementById('key-header').style.opacity = 0;
      document.getElementById('app-loading').classList.remove('app-loading-hide');
    }

  })();

  //显示菜单栏
  function showMenu(cbThis, str) {
    var _this = cbThis;
    if (_this.checked) {
      document.getElementById('header-mobile').className = 'mobile mobile-' + str + '-on';
      var headerCb = document.getElementsByName("headerCb");
      for (var i in headerCb) {
        headerCb[i].checked = false; //将头部所有复选框去除选中，以便下次切换
      }
      _this.checked = true; //将当前的复选框设置为选中状态
    } else {
      document.getElementById(
        'header-mobile').classList.remove('mobile-' + str + '-on');
    }
  }

  //隐藏菜单栏
  function hideMenu(str) {
    document.getElementById('header-mobile').classList.remove('mobile-' + str + '-on');
    document.getElementById(str + '-checkbox').checked = false; //将选中复选框去除，以便下次切换
  }

</script>

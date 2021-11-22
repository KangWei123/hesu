<div class="app-loading app-loading-hide" id="app-loading">
  <img src="<%= require('@/dss-common/img/loading.gif') %>"/>
</div>
<style>
  .app-loading {
    text-align: center;
    padding: 100px;
  }

  .app-loading-hide {
    display: none;
  }

  body.third-corp .app-loading {
    display: none;
  }

  body.third-corp .key-header {
    display: none;
  }

  body.third-corp .bg-div {
    display: none;
  }

  body.third-corp .side-menu {
    display: none;
  }

  body.third-corp .body-div {
    margin-left: 0;
    height: 100vh;
    width: 100vw;
  }
</style>
<script>
  (function () {
    //三方来源访问:加个进度条,隐藏头部
    if (location.search.indexOf('third-corp=') != -1) {
      document.getElementById('key-header').style.opacity = 0;
      document.getElementById('app-loading').classList.remove('app-loading-hide');
    }
  })();
</script>

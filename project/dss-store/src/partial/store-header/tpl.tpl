<div class="header-pc">
  <div class="key-header" id="key-header">
    <div class="header <%= type || '' %>">
      <a href="javascript:;" style="display: inline-block;cursor: default;">
        <img class="header_logo publicLogo" src="<%= require('@/dss-common/img/new-portal/common/logo.png')%>" />
        <img class="header_logo privateLogo" src="<%= require('@/dss-common/img/new-portal/common/logo-blue.png')%>" />
      </a>
      <div class="header_menu">
        <ul class="key-header_menu console_menu">
          <li class="key-header_menu_li" style="display:<%= activity || 'none' %>">
            <a id="list" href="/activity.html#/activities" class="headerTab">我的活动</a>
          </li>
          <li class="key-header_menu_li" style="display:<%= activity || 'none' %>">
            <a id="effect" href="/activity.html#/effect" class="headerTab">效果分析</a>
          </li>
          <li class="key-header_menu_li">
            <a id="analysis" href="/store.html" class="headerTab">经营分析</a>
          </li>
          <li class="key-header_menu_li">
            <a href="/dmp.html" target="_blank" class="headerTab">客户洞察</a>
          </li>
          <li class="key-header_menu_li">
            <a href="/dsp.html" target="_blank" class="headerTab">精准投放</a>
          </li>
          <li class="key-header_menu_li">
            <a id="storeMgr" href="/console.html" class="headerTab">门店管理</a>
          </li>
        </ul>
      </div>
      <div class="btn-box" id="trialAndLogin">
        <a class="key-header_btn onTrial" href="/quickjoin.html">申请试用</a>
        <a class="key-header_btn login" href="/login.html">登录</a>
      </div>
      <div class="key-header_avatar key-header_menu_li" id="avatar" style="display: none;">
        <img class="avatar" style="width:36px;height: 36px;" src="<%= require('@/dss-common/img/avatar.svg') %>"
          alt="" />
        <img class="avatar-blue" style="width:36px;height: 36px;"
          src="<%= require('@/dss-common/img/avatar-blue.png') %>" alt="" />
        <span class="user-info"></span>
        <ul class="key-header_menu_li_first_ul">
          <li><a href="javascript:;" id="logout">退出</a></li>
        </ul>
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

    //给头部菜单添加选中事件
    var headerTabArr = document.getElementsByClassName('headerTab');
    var headerMenuDivArr = document.getElementsByClassName('key-header_menu_li_div');
    for (var i in headerTabArr) {
      headerTabArr[i].onclick = function () {
        activityMenu(this);
      }
      headerTabArr[i].onmouseover = function () {
        activityMenu(this);
      }
      headerTabArr[i].onmouseout = function () {
        unActivityMenu(this);
      }
    }
    for (var r in headerMenuDivArr) {
      headerMenuDivArr[r].onmouseover = function () {
        activityMenu(this);
      }
      headerMenuDivArr[r].onmouseout = function () {
        unActivityMenu(this);
      }
    }
  })();

  //给头部菜单添加选中事件
  function activityMenu(e) {
    e.parentNode.classList.add('activity-menu');
  }
  //给头部菜单删除选中事件
  function unActivityMenu(e) {
    e.parentNode.classList.remove('activity-menu');
  }

</script>

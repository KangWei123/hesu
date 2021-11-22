<div class="header-mobile" id="header-mobile">
  <div class="key-header">
    <div class="header <%= type || '' %>">
      <div class="left">
        <a href="javascript:;" style="display: inline-block;cursor: default;">
          <img class="header-logo" src="<%= require('@/dss-common/img/new-portal/common/logo-blue.png')%>" />
        </a>
      </div>
      <div class="right">
        <div class="avatar-box">
          <div class="avata-unLogin" id="avata-unLogin">
            <a href="/login.html"><img class="avatar" src="<%= require('../../img/avatar-mobile.png') %>" alt="" /></a>
          </div>
          <div class="avata-login" id="avata-login">
            <input type="checkbox" name="headerCb" id="avatar-checkbox" onchange="showMenu(this,'avatar','more')" />
            <img class="avatar" src="<%= require('../../img/avatar-mobile.png') %>" alt="" />
          </div>
        </div>
        <div class="key-header-more">
          <input type="checkbox" name="headerCb" id="more-checkbox" onchange="showMenu(this,'more','avatar')" />
          <img class="more" src="<%= require('../../img/header-more.png') %>" alt="" />
          <img class="close" src="<%= require('../../img/header-close.png') %>" alt="" />
        </div>
      </div>
    </div>
    <div class="header-avatar" id="header-avatar" onclick="hideMenu('avatar')">
      <div class="content" id="avatarStopBubble">
        <ul class="first-menu-ul">
          <!-- <li class="first-menu-li">
            <p><a href="/console.html">门店管理</a></p>
          </li> -->
          <li class="first-menu-li">
            <p><a href="javascript:;" id="logout-mobile">退出</a></p>
          </li>
        </ul>
      </div>
    </div>
    <div class="header-menu" onclick="hideMenu('more')">
      <div class="content" id="menuStopBubble">
        <ul class="first-menu-ul">
          <li class="first-menu-li haveSubmenu">
            <input type="checkbox" class="first-menu-checkbox" onchange="showSecondMenu(this)" />
            <p>门店分析</p>
            <ul class="second-menu-ul">
              <li>
                <a href="/store.html#/passflow/overview">客流分析</a>
                <a href="/store.html#/portrait/basis">画像分析</a>
              </li>
              <li>
                <a href="/console.html#/member/list">会员分析</a>
                <a href="/store.html#/diagnosis/passflow">门店诊断</a>
              </li>
            </ul>
          </li>
          <li class="first-menu-li haveSubmenu">
            <input type="checkbox" class="first-menu-checkbox" onchange="showSecondMenu(this)" />
            <p>精准营销</p>
            <ul class="second-menu-ul">
              <li>
                <a href="/activity.html">活动监测</a>
                <a href="/dmp.html">客户洞察</a>
              </li>
              <li>
                <a href="/dsp.html">精准投放</a>
                <a href="/wifi.html">门店WiFi</a>
              </li>
            </ul>
          </li>
          <li class="first-menu-li haveSubmenu">
            <input type="checkbox" class="first-menu-checkbox" onchange="showSecondMenu(this)" />
            <p>企业决策</p>
            <ul class="second-menu-ul">
              <li>
                <a href="/store.html#/overview">全局分析</a>
                <a href="/selection.html">门店选址</a>
              </li>
              <li>
                <a href="/industry.html">行业报告</a>
              </li>
            </ul>
          </li>
          <li class="first-menu-li">
            <p><a href="/wkb.html">惟客宝</a></p>
          </li>
          <li class="first-menu-li">
            <p><a href="/aboutUS.html">关于我们</a></p>
          </li>
        </ul>
        <div class="btn-box" id="loginAndRegister">
          <span class="btn-login"><a href="/login.html">登录</a></span>
          <span class="btn-register"><a href="/quickjoin.html">注册</a></span>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
  (function () {
    /* eslint-disable */

    //登录信息栏点击阻止冒泡
    document.getElementById('avatarStopBubble').onclick = function (event) {
      event.stopPropagation();
    }
    //菜单栏点击阻止冒泡
    document.getElementById('menuStopBubble').onclick = function (event) {
      event.stopPropagation();
    }
  })();

  //显示菜单栏
  function showMenu(cbThis, str) {
    var _this = cbThis;
    if (_this.checked) {
      document.getElementById('header-mobile').className = 'header-mobile header-mobile-' + str + '-on';
      var headerCb = document.getElementsByName("headerCb");
      for (var i in headerCb) {
        headerCb[i].checked = false; //将头部所有复选框去除选中，以便下次切换
      }
      _this.checked = true; //将当前的复选框设置为选中状态
    } else {
      document.getElementById(
        'header-mobile').classList.remove('header-mobile-' + str + '-on');
    }
  }

  //隐藏菜单栏
  function hideMenu(str) {
    document.getElementById('header-mobile').classList.remove('header-mobile-' + str + '-on');
    document.getElementById(str + '-checkbox').checked = false; //将选中复选框去除，以便下次切换
  }

  //显示二级菜单
  function showSecondMenu(fmcbThis) {
    var _this = fmcbThis;
    if (_this.checked) {
      _this.parentNode.classList.add('first-menu-on');
    } else {
      _this.parentNode.classList.remove('first-menu-on');
    }
  }

</script>

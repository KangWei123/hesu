<template>
  <div class="custom-page">
    <div class="home-decorate-tips">
      <span>1、完全实现自定义页面不同模块组合及样式的自由编辑</span>
      <span>2、商家可创建不同活动页面，独立推广，提升传播量</span>
    </div>

    <div class="library-tab" v-if="isAreaManager">
      <el-button
        class="library-tab-item"
        :class="{ active: curLibrary === 'brand' }"
        @click="handleChangeLibrary('brand')"
        >品牌库</el-button
      >
      <el-button
        v-if="isAreaManager"
        class="library-tab-item"
        :class="{ active: curLibrary === 'store' }"
        @click="handleChangeLibrary('store')"
        >门店库</el-button
      >
    </div>

    <div class="search">
      <el-input placeholder="请输入自定义页名称" v-model.trim="keyword" class="input-with-select"></el-input>
      <el-button @click="handleSearch" style="border-radius: 1px;" type="primary">搜索</el-button>
    </div>

    <div class="home-decorate-container" v-loading="loading">
      <template v-if="curLibrary === 'brand'">
        <div class="custom-page-wrapper" v-if="!isAreaManager" >
          <!-- <div class="edit-name"></div> -->
          <div class="custom-page-block custom-page-edit-block" @click="clickDecorate">
            <div class="add">
              <i class="el-icon-plus"></i>
            </div>
            <!-- <div class="name custom-name">新增自定义主页</div> -->
          </div>
        </div>

        <div class="custom-page-wrapper" v-for="(item, index) in customPages1" :key="index">
          <!-- <div class="edit-name" v-if="!isAreaManager">
            <div class="edit-name-box" v-if="item._isEdit">
              <el-input class="edit-name-input" v-model="curTemplateName"></el-input>
              <span class="btn" @click="confirmEditName(item, index)">确定</span>
              <span class="btn" @click="cancelEditName(item, index)">取消</span>
            </div>
            <div class="name-text-box" v-else>
              <span class="name-text">{{ item.name }}</span>
              <span class="edit-icon el-icon-edit" v-if="!isAreaManager" @click="editTemplateName(item, index)"></span>
            </div>
          </div> -->
          <div
            class="custom-page-block"
            :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
          >
            <div class="preview"></div>
            <div class="edit-name" v-if="!isAreaManager">
              <div class="edit-name-box" v-if="item._isEdit">
                <el-input maxlength="15" class="edit-name-input" v-model="curTemplateName"></el-input>
                <span class="btn" @click="confirmEditName(item, index)">确定</span>
                <span class="btn" @click="cancelEditName(item, index)">取消</span>
              </div>
              <div class="name-text-box" v-else>
                <span class="name-text">{{ item.name }}</span>
                <span class="edit-icon el-icon-edit" v-if="!isAreaManager" @click="editTemplateName(item, index)"></span>
              </div>
            </div>

            <div class="edit-name" v-if="isAreaManager">
              <div class="name-text-box">
                <span class="name-text">{{ item.name }}</span>
              </div>
            </div>
            <div class="mask">
              <div @click="updatePage(item)" class="oper-item">{{ isAreaManager ? '查看' : '编辑' }}</div>
              <div class="oper-item" v-if="item.templateTag !== 1 && !isAreaManager" @click="deletePage(item, index)">
                删除
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="curLibrary === 'store' && isAreaManager">
        <div class="custom-page-wrapper">
          <!-- <div class="edit-name"></div> -->
          <div class="custom-page-block custom-page-edit-block" @click="clickDecorate">
            <div class="add">
              <i class="el-icon-plus"></i>
            </div>
            <!-- <div class="name custom-name">新增自定义主页</div> -->
          </div>
        </div>

        <div class="custom-page-wrapper" v-for="(item, index) in customPages1" :key="index">
          <!-- <div class="edit-name">
            <div class="edit-name-box" v-if="item._isEdit">
              <el-input class="edit-name-input" v-model="curTemplateName"></el-input>
              <span class="btn" @click="confirmEditName(item, index)">确定</span>
              <span class="btn" @click="cancelEditName(item, index)">取消</span>
            </div>
            <div class="name-text-box" v-else>
              <span class="name-text">{{ item.name }}</span>
              <span class="edit-icon el-icon-edit" @click="editTemplateName(item, index)"></span>
            </div>
          </div> -->
          <div
            class="custom-page-block"
            :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
          >
            <div class="preview"></div>
            <div class="edit-name">
              <div class="edit-name-box" v-if="item._isEdit">
                <el-input maxlength="15" class="edit-name-input" v-model="curTemplateName"></el-input>
                <span class="btn" @click="confirmEditName(item, index)">确定</span>
                <span class="btn" @click="cancelEditName(item, index)">取消</span>
              </div>
              <div class="name-text-box" v-else>
                <span class="name-text">{{ item.name }}</span>
                <span class="edit-icon el-icon-edit" @click="editTemplateName(item, index)"></span>
              </div>
            </div>
            <div class="mask">
              <div @click="updatePage(item)" class="oper-item">编辑</div>
              <div class="oper-item" v-if="item.status !== 2" @click="deletePage(item, index)">删除</div>
            </div>
          </div>
        </div>
      </template>
      <i></i><i></i><i></i><i></i><i></i>
    </div>
  </div>
</template>

<script>
import service from '@/dss-wechat3rd/src/api/index';
import '../custom-page-block.less';
import './index.less';
import { mapState } from 'vuex';
import store from '@/business-common/store.js';
export default {
  data: function() {
    return {
      dataSource: [],
      dialogVisible: false,
      customPages1: [],
      curLibrary: 'brand',
      loading: false,
      curTemplateName: '', // 当前编辑模版名称(暂存)
      keyword: ''
    };
  },

  computed: {
    ...mapState({
      curTemplateId: 'sellerTemplateId',
      customPages: 'customPages',
      roleList: 'roleList',
      curStore: 'curStore',
      curApp: 'curApp'
    }),
    // 是否允许门店自定义页编辑(店长/区管/经销商)
    isAreaManager() {
      return (
        (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
          !!~this.roleList.split(',').indexOf('common_role_dealer_manager') ||
          !!~this.roleList.split(',').indexOf('common_role_storeKeeper')) &&
        !!this.curApp.canCustomDecorate
      );
      // return false;
    }
  },

  mounted() {
    if (!this.curTemplateId) {
      service.getUserTemplate().then(response => {
        if (response.data && response.data.templateId) {
          store.commit('set_sellerTemplateId', response.data.id);
          this.getCustomPages();
        }
      });
    } else {
      this.getCustomPages();
    }
  },

  methods: {
    // 获取所有的自定义页
    getCustomPages() {
      this.loading = true;
      service
        .getCustomPagesV3({
          sellerTemplateId: this.curTemplateId,
          storeId: this.curLibrary === 'brand' ? 0 : this.curStore.id,
          name: this.keyword
        })
        .then(response => {
          if (response.success === true) {
            if (response.data) {
              response.data.forEach(item => {
                item.imgUrl += '?t=' + new Date().getTime();
              });
            }
            this.customPages1 = response.data;
            store.commit('set_customPages', response.data);
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    updatePage(val) {
      this.$router.push({
        path: '/setting/homedecorate/custom-page/decorate',
        query: { pageIndex: val.index, library: this.curLibrary, pageId: val.id }
      });
    },

    deletePage(val, index) {
      this.$confirm('确定删除自定义页面吗？', '删除提醒', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          service
            .deleteCustomPage({
              index: val.index,
              sellerTemplateId: this.$store.state.sellerTemplateId,
              storeId: this.isAreaManager ? this.curStore.id : 0,
              pageId: val.id
            })
            .then(response => {
              if (response.success === true) {
                this.customPages.splice(index, 1);
              }
            });
        })
        .catch(() => {
          console.log('取消');
        });
    },

    clickTemplateItem(val) {
      this.$router.push({
        path: '/setting/homedecorate/custom-page/decorate',
        query: { templateConfig: val.config }
      });
    },

    clickDecorate() {
      // this.$router.push('/setting/homedecorate/custom-page/decorate');
      this.$router.push({
        path: '/setting/homedecorate/custom-page/decorate',
        query: { library: this.curLibrary }
      });
    },
    handleChangeLibrary(val) {
      this.curLibrary = val;
      this.getCustomPages();
    },

    editTemplateName(item, index) {
      this.curTemplateName = item.name || '';
      this.$set(this.customPages1[index], '_isEdit', true);
    },

    // 确定修改模板名称
    confirmEditName(item, index) {
      const name = this.curTemplateName;
      if (!name) return;
      this.loading = true;
      service
        .updatePage({
          name,
          config: item.config,
          index: item.index,
          sellerTemplateId: this.curTemplateId,
          storeId: 0,
          pageId: item.id
        })
        .then(response => {
          this.curTemplateName = '';
          this.getCustomPages();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 取消修改模板名称
    cancelEditName(item, index) {
      this.curTemplateName = '';
      this.$set(this.customPages1[index], '_isEdit', false);
    },

    handleSearch() {
      this.getCustomPages();
    }
  }
};
</script>

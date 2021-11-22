<template>
  <!-- 一级分类 -->
  <div class="category-first"
       v-loading="firstLoading">
    <div class="category-first-content">
      <!-- 屏幕 -->
      <div class="screen-area-1">
        <div class="header"><!--分类--></div>
        <div class="search-bar">
          <div class="search-btn">
            <div class='search-tip'>搜搜你想要的商品</div>
          </div>
        </div>
        <div class="container clearfix">
          <!-- 左边的分类 -->
          <div class="left">
            <div>
              <div class="categroty-item"
                   v-for="(item,index) in storeCategory"
                   :key="index"
                   @click="clickItem(index)"
                   :style="{'background-color': index=== editIndex ? 'white' : null}">
                <div class="field">{{item.name}}</div>
              </div>
            </div>
          </div>
          <!-- 右边的分类结果 -->
          <div class="right"
               v-if="storeCategory[editIndex]">
            <!--<div class="condition-header">
              <div class='tip-title'>{{storeCategory[editIndex].category}}</div>
            </div>-->
            <!--  -->
            <div class="banner-img1" v-if="editData.topicImageURL"
                 :style="{'background': 'transparent url('+editData.topicImageURL+') center / cover no-repeat'}"></div>
            <guide-shop :dataSource="dataSource"></guide-shop>
          </div>
        </div>
      </div>
      <!-- 编辑区域 -->
      <div class="editor-area">
        <guide-secound-edit class="category-second-edit"
                              :categorySecond='editData'
                              ref='categoryEdit'
                              @chooseImg='chooseBannerImg'
                              @chooseGoods='chooseBannerGoods'></guide-secound-edit>
      </div>
    </div>

    <div>
      <el-button type="primary" style="margin-top: 15px"
                 @click="saveCategory">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import merchantApi from '@/dss-wechat3rd/src/api/merchant.js';
import GuideShop from './guide-shop.vue';
import GuideSecoundEdit from './guide-second-edit.vue';

export default {
  components: {
    GuideShop,
    GuideSecoundEdit
  },
  data() {
    return {
      firstLoading: false,
      storeCategory: [],
      dataSource: [], // 商品的数据
      editIndex: 0,
      editIndexs: [] //编辑过的category
    };
  },

  computed: {
    editData() {
      return this.editIndex !== -1 ? this.storeCategory[this.editIndex] : null;
    },
    ...mapState({
      curStore: 'curStore'
    })
  },

  mounted() {
    //查询一级类目数据
    this.getData();
  },

  methods: {
    //选择banner主题图片
    chooseBannerImg(imgObj) {
      this.storeCategory[this.editIndex].topicImageURL = imgObj.src;
      this.editIndexs.push(this.editIndex);
    },
    chooseBannerGoods(imgUrlValue) {
      if (!this.editIndexs.includes(this.editIndex)) {
        this.editIndexs.push(this.editIndex);
      }
      this.storeCategory[this.editIndex].imgUrlValue = imgUrlValue;
    },
    //查询一级类目数据
    getData() {
      /*const params = {
        itemType: goodsTypeEnum.product.value
      };
      service.queryAllCategoryList(params).then(res => {
        let bigArr = res.data;
        let x = [];
        bigArr.forEach(item => {
          x.push(this.findLastCategory(item));
        });
        this.storeCategory = this.flatten(x);
        if (this.storeCategory && this.storeCategory.length) {
          this.clickItem(0);
        }
      });*/
      let storeId = this.curStore ? this.curStore.id : 0;
      merchantApi
        .queryFloorList({
          storeId: storeId
        })
        .done(res => {
          this.storeCategory = res.data;
          if (this.storeCategory && this.storeCategory.length > 0) {
            this.clickItem(0);
          }
        })
        .always(() => {});
    },

    // 寻找最终的category
    findLastCategory(category) {
      if (!category.childrenCategory.length) {
        return category;
      } else {
        let x = [];
        category.childrenCategory.forEach(element => {
          x.push(this.findLastCategory(element));
        });
        return x;
      }
    },

    flatten(arr) {
      let res = [];
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          res = res.concat(this.flatten(arr[i]));
        } else {
          res.push(arr[i]);
        }
      }
      return res;
    },

    clickItem(index) {
      this.editIndex = index;
      // 请求当前系统类目的商品
      this.queryCategoryOfItem(this.storeCategory[index].id);
    },

    //查询总店商品列表
    queryCategoryOfItem(categoryId, callBack) {
      const params = {
        storeyId: categoryId
      };
      //查询总店商品列表
      this.firstLoading = true;
      merchantApi
        .businessQueryLogos(params)
        .done(res => {
          this.dataSource = res.data || [];
          callBack && callBack(res.data);
        })
        .always(() => {
          this.firstLoading = false;
        });
    },

    //保存二级类目模式
    saveCategory() {
      // 获取已经修改过的的category
      let changedCategorys = [];
      this.editIndexs.forEach(index => {
        changedCategorys.push(this.storeCategory[index]);
      });
      this.$emit('updataCategoryType', changedCategorys);
    }
  }
};
</script>
<style lang="less" scoped>
.category-first {
  min-height: 100%;
  .category-first-content {
    overflow: hidden;
    .screen-area-1 {
      background: url('../../../../images/decorate/phone.png') no-repeat 100% 100%;
      background-size: cover;
      width: 376px;
      height: 669px;
      overflow-y: hidden;
      float: left;
      border: 1px solid #f0f1f5;

      .header {
        margin-top: 20px;
        cursor: pointer;
        height: 44px;
        text-align: center;
        padding-top: 10px;
        box-sizing: border-box;
      }

      .search-bar {
        padding: 5px 15px;
        background-color: white;
        width: 375px;
        overflow: hidden;
        box-sizing: border-box;
        .search-btn {
          height: 32px;
          background-color: rgba(240, 241, 245, 1);
          border-radius: 32px;
          position: relative;

          .icon {
            width: 15px;
            height: 15px;
            position: absolute;
            left: 9px;
            top: 9px;
          }
        }
        .search-tip {
          position: absolute;
          left: 27px;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(162, 162, 164, 1);
          text-align: left;
          line-height: 32px;
        }
      }

      .container {
        width: 375px; //比父类多出15px
        height: 563px;
        background-color: white;

        .left {
          float: left;
          width: 80px;
          height: 100%;
          background: rgba(240, 241, 245, 1);
          overflow-y: auto;

          .categroty-item {
            width: 100%;
            height: 42px;
            overflow: hidden;
            cursor: pointer;
            line-height: 42px;
            text-align: center;
            position: relative;
            .field {
              height: 100%;
              overflow: hidden;
            }
            .cover {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              border: 1px dashed rgba(151, 151, 151, 1);
              display: none;

              .com-close {
                cursor: pointer;
                position: absolute;
                top: 0;
                right: 0;
              }
            }

            & .select,
            &:hover .cover {
              display: block;
            }
          }
          .drag {
            background-color: lightgrey;
            overflow: hidden;
          }
        }

        .right {
          float: left;
          width: 295px;
          box-sizing: border-box;
          height: 562px;
          overflow-y: auto;
          padding: 0 10px;

          .condition-header {
            height: 67px;
            background-color: white;
            padding: 10px 0 0 10px;
            box-sizing: border-box;
            .tip-title {
              height: 17px;
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(55, 58, 68, 1);
              line-height: 17px;
              margin-bottom: 5px;
            }
            .sort-container {
              display: flex;
              & > div {
                width: 70px;
                height: 24px;
                border-radius: 12px;
                font-size: 0;
                margin-right: 5px;
                position: relative;
              }

              .sort-title {
                position: absolute;
                font-size: 12px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                line-height: 24px;
                text-align: center;
                top: 0;
                height: 24px;
                left: 23px;
              }

              .sort-image {
                position: absolute;
                top: 7px;
                width: 8px;
                height: 11px;
                right: 10px;
              }
            }
          }
          .banner-img1 {
            // width: 100%;
            height: 84px;
            margin-bottom: 10px;
            border-radius:5px;
          }
        }
      }
    }
    .editor-area {
      width: 384px;
      height: 669px;
      overflow-y: auto;
      background: rgba(255, 255, 255, 1);
      border: 1px solid #f0f1f5;
      border-radius: 0 4px 4px 0;
      margin-left: 20px;
    }
  }
}
</style>


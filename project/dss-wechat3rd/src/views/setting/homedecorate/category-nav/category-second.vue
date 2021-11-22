<template>
  <!-- 一级分类 -->
  <div class="category-second">
    <div class="category-second-content">
      <!-- 屏幕 -->
      <div class="screen-contanier-area">
        <div class="screen-head"></div>
        <div class="screen-area">
          <div class="header">分类</div>
          <div class="search-bar">
            <div class="search-btn">
              <div class='search-tip'>搜搜你想要的商品</div>
            </div>
          </div>
          <div class="container clearfix">
            <!-- 左边的分类 -->
            <div class="left">
              <el-scrollbar style="height: 100%" class="category-scrollbar">
                <div>
                  <div class="categroty-item"
                      v-for="(item,index) in storeCategory"
                      :key="index"
                      @click="clickItem(index)"
                      :style="{'background-color': index=== editIndex ? 'white' : null}">
                    <div class="field limit-line">{{item.category}}</div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <!-- 右边的分类结果 -->
            <div class="right"
                v-if="storeCategory[editIndex]">
              <el-scrollbar style="height: 100%" class="category-scrollbar">
                <div style="margin: 0 16px;">
                  <div class="condition-header"
                      v-if="!showType">
                    <div class='tip-title'>{{storeCategory[editIndex].category}}</div>
                    <div class='sort-container'>
                      <div v-for="(item,index) in sortArray"
                          :key="index"
                          :style="{color:currentSortIndex === index? 'rgba(255,255,255,1)' : 'rgba(162,162,164,1)',backgroundColor: currentSortIndex === index ? 'rgba(255,187,59,1)' : 'rgba(240,241,245,1)'}">
                        <div class='sort-title'>{{item.name}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="banner-img"
                      :class="showType === 1 ? 'child-category-banner' : ''"
                      v-if="storeCategory[editIndex].imgUrl"
                      :style="{'background': 'transparent url('+storeCategory[editIndex].imgUrl+') no-repeat center center / cover'}"></div>

                  <!-- 显示商品 -->
                  <div class="second-goods-conteiner"
                      v-if="!showType">
                    <category-goods :dataSource="dataSource"></category-goods>
                  </div>
                  <!-- 显示子分类 -->
                  <div v-else>
                    <div wx:else
                        class='content-container'>
                      <div v-for="(item,index) in childCategorys"
                          :key="index"
                          class="child-item"
                          :class="`column_${columnNum}`">
                        <img v-if="item.categoryImgUrl"
                            :src="item.categoryImgUrl"
                            class="icon"
                            alt="">
                        <div class="icon" style="background: #f0f1f5; display:inline-block;" v-else></div>
                        <div class="name">{{item.category}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
      <!-- 编辑区域 -->
      <div class="editor-area">
        <category-second-edit class="category-second-edit"
                              :categorySecond='editData'
                              ref='categoryEdit'
                              @chooseImg='chooseBannerImg'
                              @chooseGoods='chooseBannerGoods'></category-second-edit>
      </div>
    </div>

    <div class="bottom-button">
      <el-button type="primary"
                 @click="saveCategory">保存</el-button>
    </div>
  </div>
</template>

<script>
import categorySecondEdit from './category-edit.vue';
import categoryGoods from './category-goods.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import service from '@/dss-wechat3rd/src/api/wx_store_item.js';
import './category-second.less';
export default {
  components: {
    categoryGoods,
    categorySecondEdit
  },
  props: {
    columnNum: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      firstLoading: false,
      storeCategory: [],
      dataSource: [], // 商品的数据
      childCategorys: [],
      showType: 0,
      editIndex: 0,
      currentSortIndex: 0,
      sortArray: [
        {
          name: '综合',
          id: null,
          icon: null
        },
        {
          name: '销量',
          id: 'salesVolume',
          icon: null
        },
        {
          name: '价格',
          id: 'salePrice',
          icon: null
        }
      ],
      editIndexs: [] //编辑过的category
    };
  },

  computed: {
    editData() {
      return this.editIndex !== -1 ? this.storeCategory[this.editIndex] : null;
    }
  },

  mounted() {
    //查询一级类目数据
    this.getFirstCategory();
  },

  methods: {
    //选择banner主题图片
    chooseBannerImg(imgObj) {
      this.storeCategory[this.editIndex].imgUrl = imgObj.src;
      this.editIndexs.push(this.editIndex);
    },
    chooseBannerGoods(imgUrlValue) {
      if (!this.editIndexs.includes(this.editIndex)) {
        this.editIndexs.push(this.editIndex);
      }
      this.storeCategory[this.editIndex].imgUrlValue = imgUrlValue;
    },

    //查询一级类目配置
    getFirstCategory() {
      this.secondLoading = true;
      const params = {
        type: goodsTypeEnum.product.value
      };
      service
        .queryFirstCategory(params)
        .done(res => {
          this.storeCategory = res.data || [];
          if (this.storeCategory.length) {
            //默认查询第一个一级类目中的二级类目配置
            this.getSecondCategory(this.storeCategory[0].id);
          }
        })
        .always(() => {
          this.secondLoading = false;
        });
    },

    //查询二级类目配置
    getSecondCategory(firstCategoryId) {
      this.secondLoading = true;
      const params = {
        id: firstCategoryId,
        type: goodsTypeEnum.product.value
      };
      service
        .querySecondCategory(params)
        .done(res => {
          // 处理数据，将数据扁平化
          const childCategorys = res.data.childrenCategory;
          // 有子分类
          if (childCategorys.length) {
            this.showType = 1;
            this.childCategorys = this.flatterArray(childCategorys);
          } else {
            this.showType = 0;
            // 没有子分类  展示商品数据
            this.queryCategoryOfItem(res.data.id);
          }
        })
        .always(() => {});
    },

    flatterArray(arr) {
      let x = [];
      arr.forEach(item => {
        if (item.childrenCategory && item.childrenCategory.length) {
          x = x.concat(this.flatterArray(item.childrenCategory));
        } else {
          x.push(item);
        }
      });
      return x;
    },

    //查询总店商品列表
    queryCategoryOfItem(categoryId) {
      const params = {
        type: goodsTypeEnum.product.value,
        status: 1
      };
      params.categoryId = categoryId;
      //查询总店商品列表
      this.firstLoading = true;
      service.queryGoodsList(params).then(res => {
        if (res.success === true) {
          this.dataSource = res.data;
        }
      });
    },

    clickItem(index) {
      this.editIndex = index;
      this.dataSource = [];
      // 请求当前系统类目的商品
      this.getSecondCategory(this.storeCategory[index].id);
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

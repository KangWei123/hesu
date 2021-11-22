<template>
  <div class="special-activity">
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/activities' }" replace> 专题活动管理 </el-breadcrumb-item>
      <el-breadcrumb-item>专题活动</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="special-activity-add-container" v-loading="loading" element-loading-text="更新中...">
      <el-form
        class="activity-form"
        :model="activityForm"
        @submit.native.prevent
        :rules="activityRules"
        label-width="85px"
        ref="activityForm"
      >
        <el-form-item label="活动名称:" class="activity-label" prop="topicName">
          <el-input
            placeholder="请输入活动名称"
            class="activity-input"
            size="mini"
            v-model="activityForm.topicName"
          ></el-input>
        </el-form-item>
        <!--图片-->
        <el-form-item label="主题图片:" class="activity-label" prop="topicImgUrl">
          <choose-images v-model="activityForm.topicImgUrl" @delete="handleDelImg" />
          <span class="img-tip">图片大小：750*250px</span>
        </el-form-item>
        <!--图片-->
        <el-form-item label="主题配色:" class="activity-label" prop="topicColor">
          <el-color-picker
            class="activity-color-picker"
            v-model="activityForm.topicColor"
            size="mini"
          ></el-color-picker>
          <span class="colorTip">{{ activityForm.topicColor }}</span>
        </el-form-item>
        <el-form-item label="字体颜色:" class="activity-label" prop="fontColor">
          <el-radio v-model="activityForm.fontColor" label="#ffffff">白色</el-radio>
          <el-radio v-model="activityForm.fontColor" label="#000000">黑色</el-radio>
        </el-form-item>
        <div class="navigation-box" v-for="(nav, navIndex) in activityForm.topicPartitionList" :key="navIndex">
          <i class="com-close del-icon" v-if="navIndex > 0" @click="handleDeleteNav(navIndex)"></i>
          <el-form-item
            label="快捷导航:"
            :prop="'topicPartitionList.' + navIndex + '.partName'"
            :rules="[
              { required: true, message: '导航名称不能为空', trigger: 'blur' },
              { max: 25, message: '长度不超过25个字符', trigger: 'blur' },
            ]"
            class="activity-label"
          >
            <el-input placeholder="请输入活动名称" size="mini" v-model="nav.partName" class="activity-input">
            </el-input>
            <div class="navigation-tip">商品过多时，建议创建多个区域并通过导航帮助用户快速定位</div>
          </el-form-item>
          <!--选择商品-->
          <el-form-item
            label="选择商品:"
            :prop="'topicPartitionList.' + navIndex + '.type'"
            :rules="{ required: true, validator: chooseProductValidator, trigger: 'change' }"
            class="activity-label choose-goods"
          >
            <el-radio-group v-model="nav.type">
              <el-radio :label="CHOOSE_TYPE.CATEGORY">指定分类</el-radio>
              <el-button
                v-if="nav.type === CHOOSE_TYPE.CATEGORY"
                class="activity-button"
                @click="handleSelectCategory(navIndex)"
                >选择分类<i class="el-icon-caret-bottom"></i>
              </el-button>
              <el-radio :label="CHOOSE_TYPE.GOODS">指定商品</el-radio>
              <el-button
                v-if="nav.type === CHOOSE_TYPE.GOODS"
                class="activity-button"
                @click="handleSelectGoods(navIndex)"
                >选择商品<i class="el-icon-caret-bottom"></i>
              </el-button>
            </el-radio-group>
          </el-form-item>

          <el-table
            class="wkt-table goods-table"
            max-height="333"
            :data="nav.productList"
            v-if="nav.productList && nav.productList.length && nav.type === CHOOSE_TYPE.GOODS"
          >
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="售价(￥)" prop="salePrice">
              <span slot-scope="scope">
                <span v-if="!scope.row.salesType">
                  {{ scope.row.salePrice | price }}
                </span>
                <span v-else>{{ scope.row.displayPrice || '到店咨询' }}</span>
              </span>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <a class="dss-link" href="javascript:;" @click="handleDelProductItem(nav.productList, scope.$index)"
                  >删除</a
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            class="category-box"
            v-if="nav.categoryList && nav.categoryList.length && nav.type === CHOOSE_TYPE.CATEGORY"
          >
            <!-- <div class="category-label">分类名称</div> -->
            <!-- <div class="category-content"> -->
            <div
              class="category-item-box"
              v-for="(categoryList, groupIndex) in nav.groupCategoryList"
              :key="groupIndex"
            >
              <el-tag
                v-for="(tag, tagIndex) in categoryList"
                :key="tag.id"
                effect="plain"
                @close="handleDelCategoryItem(nav, groupIndex, tagIndex)"
                closable
              >
                {{ tag.category }}
              </el-tag>
            </div>
            <!-- </div> -->
          </div>
        </div>
        <div style="text-align: end; width: 520px; margin-top: 5px">
          <a href="javascript:void(0);" class="add-nav" @click="handleAddNavigation">+添加导航</a>
        </div>
        <div class="bottom-button">
          <div class="button-center">
            <el-button @click="onGiveUp">取消</el-button>
            <el-button v-if="this.$route.query.topicId" type="primary" @click="updateActivityData()">更新 </el-button>
            <el-button v-else type="primary" @click="onSubmit()">保存 </el-button>
          </div>
        </div>
      </el-form>

      <goods-select-dialog
        v-model="showSelectProductDialog"
        enable-multiple
        show-goods-type-tab
        :active-tabs="[goodsTypeEnum.product]"
        :selected-list="activityForm.topicPartitionList[navIndex].productList"
        @selected="onProductChoosed"
      >
      </goods-select-dialog>
      <category-select-dialog
        v-model="showSelectCategoryDialog"
        @choosed="onCategoryChoosed"
        :selected-categories="activityForm.topicPartitionList[navIndex].categoryList"
      >
      </category-select-dialog>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
  import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
  import CategorySelectDialog from '@/dss-wechat3rd/src/bz_components/category-select-dialog/index.vue';
  import api from '@/dss-wechat3rd/src/api/activity.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import GoodsType from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';

  const supplierApi = api.supplier;

  /* 创建活动选择商品的类型 */
  const CHOOSE_TYPE = { GOODS: '2' /* 商品 */, CATEGORY: '1' /* 分类 */ };

  /* 分类中每列显示的条数 */
  const CATEGORY_GROUP_COUNT = 9;

  export default {
    components: {
      ChooseImages,
      GoodsSelectDialog,
      CategorySelectDialog,
    },
    computed: {
      ...mapState({ curApp: 'curApp' }),
    },
    data() {
      return {
        GoodsType,
        CHOOSE_TYPE,
        goodsTypeEnum,
        navIndex: 0 /* 快捷导航的索引，供弹窗选额分类或者商品后，定位到某个快捷导航是用 */,
        showSelectProductDialog: false,
        showSelectCategoryDialog: false,
        loading: false,
        activityForm: {
          createTime: '',
          topicColor: '#396CDC',
          fontColor: '#ffffff',
          topicImgUrl: null,
          topicName: '',
          topicPartitionList: [this.initNavigationData()],
          updateTime: '',
        },
        activityRules: {
          topicName: [
            { required: true, message: '活动名称不能为空', trigger: 'blur' },
            { max: 25, message: '长度不超过 25 个字符', trigger: 'blur' },
          ],
          topicImgUrl: [{ required: true, message: '请输入主题活动图片', trigger: 'change' }],
          topicColor: [{ required: true, message: '主题配色不能为空' }],
          fontColor: [{ required: true, message: '字体颜色不能为空' }],
        },
      };
    },
    watch: {
      'activityForm.topicImgUrl': {
        handler(newVal, oldVal) {
          this.$nextTick(() => {
            this.$refs.activityForm.validateField('topicImgUrl');
          });
        },
      },
    },
    mounted() {
      if (this.$route.query.topicId) {
        this.getActivityDetail();
      }
    },
    methods: {
      chooseProductValidator(rule, value, callback) {
        const fullFieldArr = rule.fullField.split('.');
        const { productList, categoryList } = this.activityForm.topicPartitionList[Number(fullFieldArr[1])];

        if (value === CHOOSE_TYPE.GOODS) {
          if (productList && productList.length) {
            return callback();
          } else {
            return callback(Error('商品不能为空'));
          }
        } else if (value === CHOOSE_TYPE.CATEGORY) {
          if (categoryList && categoryList.length) {
            return callback();
          } else {
            return callback(Error('分类不能为空'));
          }
        }
      },
      initNavigationData() {
        return {
          createTime: '',
          productList: [],
          categoryList: [],
          groupCategoryList: [],
          itemList: [
            {
              mappingId: '',
              name: '',
              price: '',
            },
          ],
          partId: '',
          partName: '',
          type: CHOOSE_TYPE.CATEGORY,
        };
      },
      handleDelImg() {
        this.activityForm.topicImgUrl = null;
      },
      handleSelectCategory(navIndex) {
        this.navIndex = navIndex;
        this.showSelectCategoryDialog = true;
      },
      handleSelectGoods(navIndex) {
        this.navIndex = navIndex;
        this.showSelectProductDialog = true;
      },
      onProductChoosed(selectedProducts) {
        // 过滤非线上售卖商品
        const onLineSelectedProducts = [];
        const offLineProducts = [];
        (selectedProducts || []).forEach(item => {
          if (item.salesType) {
            offLineProducts.push(item);
          } else {
            onLineSelectedProducts.push(item);
          }
        });
        if (offLineProducts.length) {
          this.$message.warning('专题活动暂不支持非线上售卖商品');
        }
        this.activityForm.topicPartitionList[this.navIndex].productList = onLineSelectedProducts;
        this.$refs.activityForm.validateField('topicPartitionList.' + this.navIndex + '.type');
      },
      onCategoryChoosed(selectedCategories) {
        this.activityForm.topicPartitionList[this.navIndex].categoryList = selectedCategories;
        this.$refs.activityForm.validateField('topicPartitionList.' + this.navIndex + '.type');
        const nav = this.activityForm.topicPartitionList[this.navIndex];
        this.assembleGroupCategoryList(nav);
      },
      handleDelProductItem(productList, index) {
        productList.splice(index, 1);
        this.$refs.activityForm.validateField('topicPartitionList.' + this.navIndex + '.type');
      },
      handleDelCategoryItem(nav, groupIndex, tagIndex) {
        nav.categoryList.splice(groupIndex * CATEGORY_GROUP_COUNT + tagIndex, 1);
        this.assembleGroupCategoryList(nav);
        this.$refs.activityForm.validateField('topicPartitionList.' + this.navIndex + '.type');
      },
      assembleGroupCategoryList(nav) {
        nav.groupCategoryList = [];
        let start = 0;
        while (start < nav.categoryList.length) {
          // 每6个分成一组展示
          nav.groupCategoryList.push(nav.categoryList.slice(start, start + CATEGORY_GROUP_COUNT));
          start += CATEGORY_GROUP_COUNT;
        }
      },
      handleAddNavigation() {
        this.activityForm.topicPartitionList.push(this.initNavigationData());
      },
      handleDeleteNav(navIndex) {
        if (navIndex === this.navIndex) {
          this.navIndex = 0;
        }
        this.activityForm.topicPartitionList.splice(navIndex, 1);
      },
      // 活动列表
      onSubmit() {
        this.$refs.activityForm.validate(valid => {
          if (!valid) {
            return;
          }
          const params = {
            topicColor: this.activityForm.topicColor,
            fontColor: this.activityForm.fontColor,
            topicName: this.activityForm.topicName,
            topicImgUrl: this.activityForm.topicImgUrl.imgUrl,
            topicPartitionList: this.activityForm.topicPartitionList.map(nav => {
              let itemData = null;
              if (nav.type === CHOOSE_TYPE.GOODS) {
                itemData = nav.productList.map(item => {
                  return {
                    itemNo: item.itemNo,
                    mappingId: item.itemNo,
                    name: item.name,
                    price: item.salePrice,
                  };
                });
              } else if (nav.type === CHOOSE_TYPE.CATEGORY) {
                itemData = nav.categoryList.map(item => {
                  return {
                    id: item.id,
                    mappingId: item.id,
                    name: item.category,
                  };
                });
              }
              return {
                itemList: itemData,
                partName: nav.partName,
                type: nav.type,
              };
            }),
          };
          this.loading = true;
          supplierApi
            .add_activity(params)
            .done(res => {
              this.$router.back();
            })
            .always(res => {
              this.loading = false;
            });
        });
      },
      // 取消时返回上一页
      onGiveUp() {
        this.$router.back();
      },
      // 获取主题活动详情
      getActivityDetail() {
        supplierApi
          .getActivityDetail({ topicId: this.$route.query.topicId })
          .done(res => {
            this.activityForm = res.data || '';
            this.activityForm.topicImgUrl = { imgUrl: res.data.topicImgUrl };
            this.activityForm.topicPartitionList = res.data.topicPartitionList.map(nav => {
              let productList = [];
              let categoryList = [];
              if (nav.type.toString() === CHOOSE_TYPE.GOODS) {
                productList = nav.itemList.map(item => {
                  return {
                    itemNo: item.mappingId,
                    name: item.name,
                    salePrice: item.price,
                  };
                });
              } else if (nav.type.toString() === CHOOSE_TYPE.CATEGORY) {
                categoryList = nav.itemList.map(item => {
                  return {
                    id: item.mappingId,
                    category: item.name,
                  };
                });
                nav.categoryList = categoryList;
                this.assembleGroupCategoryList(nav);
              }
              return {
                createTime: '',
                productList: productList,
                categoryList: categoryList,
                groupCategoryList: nav.groupCategoryList,

                partId: nav.partId,
                partName: nav.partName,
                type: nav.type.toString(),
              };
            });
          })
          .always(res => {
            this.loading = false;
          });
      },
      // 更新主题活动详情
      updateActivityData() {
        this.$refs.activityForm.validate(valid => {
          if (!valid) {
            return;
          }
          const params = {
            topicId: this.$route.query.topicId,
            topicColor: this.activityForm.topicColor,
            fontColor: this.activityForm.fontColor,
            topicName: this.activityForm.topicName,
            topicImgUrl: this.activityForm.topicImgUrl.imgUrl,
            topicPartitionList: this.activityForm.topicPartitionList.map(nav => {
              let itemData = null;
              if (nav.type === CHOOSE_TYPE.GOODS) {
                itemData = nav.productList.map(item => {
                  return {
                    mappingId: item.itemNo,
                    name: item.name,
                    price: item.salePrice,
                  };
                });
              } else if (nav.type === CHOOSE_TYPE.CATEGORY) {
                itemData = nav.categoryList.map(item => {
                  return {
                    mappingId: item.id,
                    name: item.category,
                  };
                });
              }
              return {
                itemList: itemData,
                partName: nav.partName,
                type: nav.type,
              };
            }),
          };
          this.loading = true;
          supplierApi
            .updateActivityData(params)
            .done(res => {
              this.$router.back();
            })
            .always(res => {
              this.loading = false;
            });
        });
      },
    },
  };
</script>

<style lang="less">
  @header: 48px; //头部高度
  @scroll: 17px; //滚动条高度
  @footerHeight: 44px; //footer高度
  @titleHeight: 58px; //标题高度
  // .special-activity:after {
  //   content: '';
  //   height: 60px;
  //   display: block;
  // }
  .special-activity {
    background: #fff;
    margin-bottom: 35px;
    min-height: calc(100vh - @header - @footerHeight - @titleHeight - 10px);
  }
  .bottom-button {
    .button-center {
      width: 281px;
      margin-left: 33%;
    }
    button {
      margin-right: 0px !important;
    }
  }
  .el-radio {
    margin-right: 8px;
  }
  .activity-button {
    border: none;
    span {
      color: #a1a4ab;
    }
  }
  .add-nav {
    display: inline-block;
    width: 88px;
    height: 32px;
    border: 1px solid #fa8c16;
    border-radius: 4px;
    text-align: center;
    vertical-align: middle;
    line-height: 32px;
    color: #fa8c16;
  }
  .special-activity-add-container {
    border-radius: 2px;
    background: white;
    font-family: 'Hiragino Sans GB', 'Microsoft YaHei', Helvetica, Tahoma, Arial, SimSun, Heiti, sans-serif;
    padding: 20px 20px;

    .activity-form {
      .activity-label {
        color: #606266d4;
        font-size: 14px !important;

        .activity-input {
          width: 350px;
        }
      }
    }

    .img-uploader {
      width: 84px !important;
      height: 84px !important;
      line-height: 84px !important;

      i {
        line-height: 84px !important;
      }

      img {
        // max-height: 50px !important;
      }
      .avatar {
        width: 84px !important;
        height: 84px !important;
      }

      .btn-img-del {
        top: -30px;
        right: 0;
      }
    }

    .img-tip {
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @light-black-color;
      line-height: 17px;
      display: block;
    }

    .activity-color-picker {
      vertical-align: middle;
      cursor: pointer;

      .el-color-picker__trigger {
        border: none;
        width: 94px;
      }
    }

    .colorTip {
      width: 91px;
      height: 28px;
      background: #ffffff;
      border: 1px solid #dce1e6;
      border-radius: 2px;
      display: inline-block;
      text-align: center;
      line-height: 28px;
      position: relative;
      top: 2px;
    }

    .choose-goods {
      margin-bottom: 0px;
      .el-radio-group {
        vertical-align: middle;
      }
      .el-button--mini {
        margin-right: 20px;
      }
    }

    .navigation-box {
      width: 520px;
      // max-height: 571px;
      border: 1px solid rgba(235, 235, 235, 1);
      position: relative;
      padding-top: 20px;

      .del-icon {
        right: -8px;
        top: -8px;
        position: absolute;
      }

      .navigation-tip {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: @light-black-color;
        line-height: 17px;
      }
    }

    .navigation-box + .navigation-box {
      margin-top: 30px;
    }

    .add-nav-btn {
      width: 70px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      line-height: 20px;
      cursor: pointer;
    }

    .wkt-table .el-table__header th {
      background: rgba(245, 245, 245, 1);
    }

    .wkt-table .el-table__header .cell {
      padding: 0 15px;
    }

    .goods-table {
      margin: 0 20px 20px;
      width: 480px;
    }

    .category-box {
      margin: 0 20px 20px;
      width: 500px;
      .category-label {
        height: 30px;
        line-height: 30px;
        background: rgba(245, 245, 245, 1);
        padding-left: 23px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      // .category-content {
      //   max-height: 303px;
      //   border: 1px solid rgba(235, 235, 235, 1);
      //   padding: 14px 23px;
      .category-item-box {
        display: inline-block;
        vertical-align: top;
        margin-left: 65px;
      }

      .el-tag {
        height: 24px;
        line-height: 23px;
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        border: 1px solid #dce1e6;
        border-radius: 2px;
        display: inline-block;
        background: none;
        margin-left: 16px;
        .el-icon-close {
          background: #000;
          color: #fff;
          opacity: 0.5;
        }
        .el-icon-close:before {
          margin-left: 2px;
        }
      }
      .el-tag + .el-tag {
        margin-top: 15px;
      }
      // }
    }

    .choice-type-good {
      width: 60%;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
    }

    .top {
      width: 100%;

      .title {
        width: 50%;
        display: inline-block;
        padding: 20px 0 0 20px;
        font-weight: bolder;
      }

      .search {
        width: 300px;
        display: inline-block;
        float: right;
        padding: 20px 20px 0 0;
      }
    }
  }
</style>

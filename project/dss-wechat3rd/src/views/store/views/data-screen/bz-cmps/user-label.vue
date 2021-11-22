<template>
  <div class="user-label blue-shadow-box">
    <div class="box-title">
      <div>用户标签</div>
    </div>
    <div class="content">
      <div class="row">
        <span class="label">线上标签</span>
      </div>
      <div class="tags">
        <div class="tag" v-for="(tag, index) in jiGuangTag" :key="index">
          {{ tag }}
        </div>
        <div class="no-data" v-if="jiGuangTag && !jiGuangTag.length">暂无标签</div>
      </div>

      <div class="row">
        <span class="label">商家标签</span>
      </div>
      <div class="tags">
        <div class="tag" v-for="(tag, index) in ImpressionList" :key="index">
          {{ tag }}
        </div>
        <div class="no-data" v-if="ImpressionList && !ImpressionList.length">暂无标签</div>
      </div>
    </div>
    <slot name="decoration"></slot>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/date.js';
  import cameraFlowApi from '@/dss-common/api/camera-flow.js';
  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        img_1: '',
        img_2: '',
        curent: 1,
        tagList: [],
        jiGuangTag: [],
        userName: null,
        ImpressionList: [],
      };
    },
    watch: {
      data(val, oldVal) {
        if (val) {
          this.tagJson(val);
          this.getTagList(val);
          // this.getShopTag(val);
        }
        if (oldVal && val.idStr === oldVal.idStr) {
          return;
        }
        if (this.curent === 1) {
          this.img_2 = val.faceImgUrl;
          this.curent = 2;
          if (!oldVal) {
            this.img_1 = val.faceImgUrl;
          }
        } else {
          this.img_1 = val.faceImgUrl;
          this.curent = 1;
          if (!oldVal) {
            this.img_2 = val.faceImgUrl;
          }
        }
      },
    },
    filters: {
      textoverflow(val) {
        if (val.length > 16) {
          val = val.substring(0, 15) + '...';
        }
        return val;
      },

      age(val) {
        if (val < 18) {
          val = '< ' + 18;
        }
        return val;
      },
    },

    created() {
      if (this.data) {
        this.img_1 = this.data.faceImgUrl;
        this.img_2 = this.data.faceImgUrl;
      }
    },
    methods: {
      // 根据tagTemplate获取tag列表
      getTagList(row) {
        const tagList = [];
        if (row.tagTemplate) {
          const tagTemplate = JSON.parse(row.tagTemplate);
          const customTag = JSON.parse(row.tag) || {};
          if (!tagTemplate) {
            return;
          }
          tagTemplate.forEach(item => {
            const tag = {
              name: item.tagName,
              tagKey: item.tagKey,
              value: null,
            };
            // type为0从row里面取数据，1从customTag里取数据
            if (item.type === 0) {
              if (item.tagKey === 'vip') {
                tag.value = row[item.tagKey] === 0 ? '否' : '是';
              } else if (item.tagKey === 'updateTime') {
                tag.value = this.formatDate(row[item.tagKey]);
              } else if (item.tagKey === 'count') {
                tag.value = row[item.tagKey] + '次';
              } else {
                tag.value = row[item.tagKey];
              }
              tagList.push(tag);
            } else {
              // 如果有userName，替换name
              if (item.tagName === 'userName') {
                this.userName = customTag[item.tagKey];
              } else {
                tag.value = customTag[item.tagKey];
                tagList.push(tag);
              }
            }
          });
        }
        this.tagList = tagList;
      },

      // 获取序列化极光tag
      tagJson: function (item) {
        const list = [];
        if (item.jiGuangTag) {
          const jiGuangTag = this.$plain(JSON.parse(item.jiGuangTag));
          // 消费能力
          if (jiGuangTag.fim_fism_conl_cir) {
            if (jiGuangTag.fim_fism_conl_cir !== '低') this.pushList(list, '消费能力' + jiGuangTag.fim_fism_conl_cir);
          }
          // 职业
          if (jiGuangTag.som_ocm_career && jiGuangTag.som_ocm_career !== '其他') {
            // list.push(item.jiGuangTag.som_ocm_career);
            this.pushList(list, jiGuangTag.som_ocm_career);
          }
          // 学历
          if (jiGuangTag.cpl_indm_edu_level) {
            if (jiGuangTag.cpl_indm_edu_level !== '低') this.pushList(list, '学历' + jiGuangTag.cpl_indm_edu_level);
          }
          // 消费偏好
          if (jiGuangTag.gbm_bhm_purb_conp) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_conp));
            this.pushList(list, jiGuangTag.gbm_bhm_purb_conp);
          }
          // 上网目的
          if (jiGuangTag.gbm_bhm_purb_supr) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_supr));
            this.pushList(list, jiGuangTag.gbm_bhm_purb_supr);
          }
          // 应用偏好
          if (jiGuangTag.gbm_bhm_appp_appr_s) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_appp_appr_s));
            this.pushList(list, jiGuangTag.gbm_bhm_appp_appr_s);
          }
          // 购买方式
          if (jiGuangTag.gbm_bhm_purb_purw) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_purw));
            this.pushList(list, jiGuangTag.gbm_bhm_purb_purw);
          }
          // 兴趣爱好
          if (jiGuangTag.gbm_hbm_s) {
            // list.push(this.getOne(item.jiGuangTag.gbm_hbm_s));
            this.pushList(list, jiGuangTag.gbm_hbm_s);
          }
        }
        this.jiGuangTag = list;
      },

      pushList(list, tag) {
        if (!tag) {
          return;
        }
        // 从大类中取一个标签，过滤标签等于其他，取下一个
        const reg = /(其它)|(未知)|(-99999)/;
        tag = tag.split(',');
        for (let i = 0, j = tag.length; i < j; i++) {
          if (!!tag[i] && !reg.test(tag[i])) {
            return list.push(tag[i]);
          }
        }
      },

      // 获取商家印象
      getShopTag(row) {
        cameraFlowApi
          .getImpression({
            customerId: row.customerId,
          })
          .then(result => {
            this.ImpressionList = result.data || [];
          })
          .always(() => {});
      },

      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), 'MM/DD HH:mm', 8);
      },

      splitTag(tags) {
        if (!tags) {
          return [];
        }
        return tags.split(',');
      },
    },
  };
</script>

<style lang="less" scoped>
  .user-label {
    width: 100%;
    height: 100%;
    .row {
      line-height: 35px;
      color: #feffff;
      span {
        display: inline-block;
      }

      .label {
        font-size: 14px;
        padding-left: 20px;
        box-sizing: border-box;
        font-family: 'PingFangSC-Regular';
        vertical-align: top;
      }
    }

    .tags {
      padding: 0px 10px;
      margin-bottom: 20px;
      height: 66px;
      overflow: hidden;
      font-size: 14px;
      color: #feffff;
      position: relative;
    }

    .tag {
      line-height: 28px;
      min-width: 70px;
      height: 28px;
      background: #6081b8;
      border-radius: 4px;
      padding: 0 7px;
      display: inline-block;
      margin: 0 0px 10px 10px;
      text-align: center;
      box-sizing: border-box;
    }
  }
</style>

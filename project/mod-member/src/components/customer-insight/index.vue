<template>
  <el-dialog
    class="customer-insight"
    style="padding: 0"
    top="1vh"
    :lock-scroll="true"
    :visible.sync="show"
    :show-close="true"
    v-loading="loading"
  >
    <div class="search">
      <span class="search-title">{{ title }}</span>
      <el-input
        class="input"
        placeholder="请输入标签关键字"
        @blur="callportraittagsSearch"
        @keyup.enter.native="callportraittagsSearch"
        v-model="keyword"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="portrait_group_main">
      <div v-if="!hideIndicatorbar" class="portrait_group_indicator position-rel">
        <!-- 全部标签 -->
        <portrait-tags
          ref="portraittagsRef"
          :default-label="defaultLabel"
          :choose-group="false"
          :choose-label="true"
          :key-word="keyword"
          :choose-tag="true"
          @tag-choose="chooseTag"
          @group-choose="addGroup"
        ></portrait-tags>
      </div>

      <div v-else class="portrait_group_result position-rel">
        <div>
          <query-result :total="total" :count="valueConditions.length"></query-result>
        </div>
      </div>
    </div>
    <div class="end-footer">
      <span class="insight-index-title">洞察指标：</span>
      <div class="indicator_condition" :class="{ true: 'ml30', false: '' }[hideIndicatorbar]">
        <template v-if="rechoosedTag && rechoosedTag.length">
          <div v-for="(item, index) in rechoosedTag" :key="index">
            <span class="condition_item_tag">{{ item.name }}</span>
            <el-button
              type="danger"
              @click="onRemoveSelectesTag(item)"
              class="btn-delete"
              title="移除分析指标"
              icon="el-icon-close"
              circle
            ></el-button>
          </div>
        </template>
        <template v-else>
          <selected-indicator
            :selected-tags="selectedTags"
            @remove="onRemoveTag"
            :hide-sidebar="hideIndicatorbar"
          ></selected-indicator>
        </template>
      </div>
    </div>
    <div class="end-btn-group">
      <el-button class="btn-cancle" @click="show = false">取 消</el-button>
      <el-button
        v-if="rechoosedTag && rechoosedTag.length"
        type="primary"
        class="btn-sure primary-btn"
        @click="toGroupInsight"
        :disabled="rechooseTags.length === 0"
        >去洞察</el-button
      >
      <el-button
        v-else
        type="primary"
        class="btn-sure primary-btn"
        @click="toInsight"
        :disabled="selectedTags.length === 0"
        >去洞察</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
  import helper from '@/mod-member/src/mixins/helper';
  import api from '@/mod-member/src/api/new-dmp';
  import PortraitTags from '../../views/portrait/PortraitTags';
  import SelectedIndicator from '../../views/portrait/group/SelectedIndicator';
  import QueryResult from '../queryResult';
  export default {
    components: {
      PortraitTags,
      SelectedIndicator,
      QueryResult,
    },
    props: {
      model: {
        type: Object,
        default() {
          return {};
        },
      },
      // 已经格式化完成的字符串
      strCdn: {
        type: String,
        default: '',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      conditions: {
        type: Array,
        default() {
          return [];
        },
      },
      isFromList: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '选择洞察指标',
      },
      totalCount: {
        type: Number,
        default: -1,
      },
      rechooseTags: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        tagKeyword: '',
        loading: false,
        keyword: '',
        showShadow: false,
        defaultLabel: [], // 选中的标签
        dialog: {
          select: false,
        },
        total: -1,
        selectedTags: [],
        analysisResult: {
          // 分析查询的结果
          value: [], // 具体的各标签结果
        },
        hideIndicatorbar: false, // 是否隐藏指标选择区
        MAX_TAG_COUNT: 50, // 分析指标时：最多可选数量
        rechoosedTag: [],
      };
    },
    computed: {
      show: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
      valueConditions() {
        return this.conditions.filter(cdn => cdn.type !== 'symbol');
      },
    },
    watch: {
      visible(val) {},
    },
    mounted() {
      // 客户洞察-显示默认已选指标
      if (this.rechooseTags && this.rechooseTags.length > 0) this.rechoosedTag = this.rechooseTags;
      console.log('洞察页已选指标', this.rechoosedTag);
    },
    methods: {
      setValues() {
        const temModel = this.model || {};
        this.form.name = temModel.name;
        this.form.desc = temModel.desc;
      },
      onCancle() {
        this.show = false;
      },
      onRemoveSelectesTag(tag) {
        this.rechoosedTag = this.rechoosedTag.filter(tagItem => tagItem.code !== tag.code);
        this.defaultLabel = this.defaultLabel.filter(item => item !== tag.code);
      },
      onRemoveTag(tag) {
        this.selectedTags = this.selectedTags.filter(tagItem => tagItem.code !== tag.code);
        this.defaultLabel = this.defaultLabel.filter(item => item !== tag.code);
      },
      addGroup(tagInfo) {
        this.defaultLabel.push(tagInfo.id);
        if (this.rechooseTags && this.rechooseTags.length) {
          if (this.rechoosedTag.length >= this.MAX_TAG_COUNT) {
            this.$message({
              showClose: true,
              message: '最多允许选取' + this.MAX_TAG_COUNT + '个洞察指标',
              type: 'warning',
            });
            return false;
          }

          if (this.rechoosedTag.length && this.judgeMerchantByName(this.rechoosedTag, tagInfo)) {
            this.$message({
              showClose: true,
              message: '指标已经存在',
              type: 'warning',
            });
            return;
          }
          this.rechoosedTag.push(tagInfo);
        } else {
          if (this.selectedTags.length >= this.MAX_TAG_COUNT) {
            this.$message({
              showClose: true,
              message: '最多允许选取' + this.MAX_TAG_COUNT + '个洞察指标',
              type: 'warning',
            });
            return false;
          }

          if (this.selectedTags.length && this.judgeMerchantByName(this.selectedTags, tagInfo)) {
            this.$message({
              showClose: true,
              message: '指标已经存在',
              type: 'warning',
            });
            return;
          }
          this.selectedTags.push(tagInfo);
        }
      },
      // 条件指标
      chooseTag(tagInfo) {
        this.defaultLabel.push(tagInfo.code);
        if (this.rechooseTags && this.rechooseTags.length) {
          if (this.rechoosedTag.length >= this.MAX_TAG_COUNT) {
            this.$message({
              showClose: true,
              message: '最多允许选取' + this.MAX_TAG_COUNT + '个洞察指标',
              type: 'warning',
            });
            return false;
          }

          if (this.rechoosedTag.length && this.judgeTags(this.rechoosedTag, tagInfo)) {
            this.$message({
              showClose: true,
              message: '指标已经存在',
              type: 'warning',
            });
            return;
          }
          this.rechoosedTag.push(tagInfo);
        } else {
          if (this.selectedTags.length >= this.MAX_TAG_COUNT) {
            this.$message({
              showClose: true,
              message: '最多允许选取' + this.MAX_TAG_COUNT + '个洞察指标',
              type: 'warning',
            });
            return false;
          }

          if (this.selectedTags.length && this.judgeTags(this.selectedTags, tagInfo)) {
            this.$message({
              showClose: true,
              message: '指标已经存在',
              type: 'warning',
            });
            return;
          }
          this.selectedTags.push(tagInfo);
        }
      },
      judgeMerchantByName(selectedTags, tagInfo) {
        return !!selectedTags.find(tag => tag.name === tagInfo.name);
      },
      // 判断已选指标中是否存在重复的标签
      judgeTags(selectedTags, tagInfo) {
        return !!selectedTags.find(tag => tag.code === tagInfo.code);
      },
      // 我的人群页选择的标签操作
      groupChoose(tagInfo, labelType) {
        console.log(tagInfo);
        const finded = this.conditions.find(cdn => cdn.tag.groupId === tagInfo.id);
        if (finded) {
          // 人群已经存在条件中
          return;
        }

        // TODO:不能修改props值
        const lastElement = this.conditions.slice(-1);
        if (this.conditions.length > 0 && lastElement[0].type !== 'brackets') {
          // this.conditions.push({
          //   type: 'symbol',
          //   tag: { name: 'and', code: 'AND' },
          //   id: helper.newId()
          // })
        }
        // this.conditions.push({
        //   id: helper.newId(),
        //   type: 'group',
        //   tag: {
        //     name: '人群',
        //     labelType,
        //     groupId: tagInfo.id
        //   },
        //   value: tagInfo.id,
        //   strValue: tagInfo.name
        // })
      },
      callportraittagsSearch() {
        this.$refs.portraittagsRef.searchTags();
      },
      searchTags() {
        this.keyword = this.tagKeyword;
      },
      toGroupInsight() {
        const metrics = this.rechoosedTag.map(tag => {
          return {
            tagCode: tag.code,
            limit: 10,
          };
        });
        const params = {
          stores: JSON.stringify(helper.areasToString(this.area)),
          conditions: this.strCdn,
          metrics: JSON.stringify(metrics),
        };
        api
          .getAnalysis(params)
          .done(res => {
            console.log('res', res);
            if (res.data && res.data.length) {
              this.$emit('changeInsight', res.data, this.rechoosedTag, this.conditions, this.strCdn);
            }
          })
          .always(() => {
            this.$emit('close');
          });
      },
      toInsight() {
        const metrics = this.selectedTags.map(tag => {
          return {
            tagCode: tag.code,
            limit: 10,
          };
        });
        const params = {
          stores: JSON.stringify(helper.areasToString(this.area)),
          conditions: this.strCdn,
          metrics: JSON.stringify(metrics),
        };
        api
          .getAnalysis(params)
          .done(res => {
            console.log('res', res);
            if (res.data && res.data.length) {
              // 当前页面为洞察页
              if (this.$router.history.current.name === 'portraitGroup') {
                this.$emit('changeInsight', res.data, this.selectedTags, this.conditions, this.strCdn);
              }
              // 当前页为画像页
              else {
                this.$router.push({
                  name: 'portraitGroup',
                  params: {
                    analysisResult: res.data,
                    hideIndicatorbar: true,
                    selectedTags: this.selectedTags,
                    conditions: this.conditions,
                    strCdn: this.strCdn,
                    total: this.totalCount,
                  },
                });
              }
            }
          })
          .always(() => {
            this.$emit('close');
          });
      },
    },
  };
</script>
<style lang="less" scoped>
  .search {
    padding: 10px 20px;
  }
  .portrait_group_main {
    padding: 10px 20px;
  }
  .el-input {
    width: 600px;
  }
  .search-title {
    font-size: 20px;
    font-weight: bold;
    color: #000000;
  }
  .insight-index-title {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    padding-left: 10px;
  }
  .end-footer {
    background: #f0f2f5;
    position: relative;
    padding: 24px 0 80px 0;
  }
  .end-btn-group {
    position: absolute;
    right: 33px;
    bottom: 49px;
    display: flex;
  }
  .el-dialog__body {
    padding: 0;
  }
  .condition_item_tag {
    margin: 5px;
    box-sizing: border-box;
    padding: 2px 10px;
    background: #3d7dfa;
    border: 0 none;
    color: #ffffff;
    font-size: 14px;
    border-radius: 10px;
    position: relative;
  }
  .btn-delete {
    position: relative;
    right: 25px;
    top: -21px;
    display: inline-block;
    border-radius: 50%;
  }
</style>

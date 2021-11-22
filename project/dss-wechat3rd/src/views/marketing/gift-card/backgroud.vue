<template>
  <div class="gift-card-bg" v-loading="isLoading">
    <div class="theme-bg">
      <image-selector
        style="margin-top: 10px"
        v-model="styleUrl"
        @input="onImageAdd"
        @delete="onDelete(item)"
        confirm-title="此操作将删除该卡片背景, 是否继续?"
        is-delete-confirm
      />
      <div class="theme-name">
        <div class="theme-text-name" style="max-width: 100%">尺寸支持1280*960px</div>
      </div>
    </div>
    <div class="theme-bg" v-for="(item, index) in images" :key="index">
      <image-selector
        v-model="item.url"
        :can-reset="false"
        is-delete-confirm
        confirm-title="此操作将删除该卡片背景, 是否继续?"
        @input="onImageChange"
        @delete="onDelete(item)"
      />
      <div class="theme-name">
        <div v-if="!item.isEdit" class="theme-text-name" :title="item.name">{{ item.name }}</div>
        <el-input
          v-else
          size="mini"
          :ref="'input_' + index"
          placeholder="请输入主题名称"
          v-model.trim="item.name"
          @blur="onBlur(item)"
          @keyup.enter.native="onKeyEnter(item)"
        ></el-input>
        <i v-if="item.url" class="el-icon-edit theme-icon" @click="onEdit(item, index)" v-show="!item.isEdit"></i>
        <!-- <a class="table-href"
                   @click="onEdit(item, index)"
                   v-show="!item.isEdit">修改 -->
        <!-- </a> -->
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
  import itemCardApi from '@/dss-wechat3rd/src/api/wx-item-card.js';
  import regexps from '@/dss-common/utils/regexps.js';

  const { name } = regexps;

  export default {
    components: {
      ImageSelector,
    },
    data() {
      return {
        isLoading: false,
        images: [],
        curEditItem: null,
        styleUrl: null,
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      onEdit(item, index) {
        const preItem = this.curEditItem;
        if (preItem && preItem.id !== item.id && preItem.isEdit && preItem.preName !== preItem.name) {
          return;
        }
        this.setEdit(item, index);
      },
      setEdit(item, index) {
        item.isEdit = true;
        this.curEditItem = item;
        Vue.nextTick(() => {
          this.$refs[`input_${index}`][0].focus();
        });
      },
      onBlur(item) {
        if (item.name !== item.preName) {
          this.onSave(item)
            .then(() => {
              this.fetchData();
            })
            .catch(() => {
              item.isEdit = true;
            });
        } else {
          item.isEdit = false;
        }
      },
      onKeyEnter(item) {
        item.isEdit = false;
      },
      onSave(item) {
        const p = new Promise((resolve, reject) => {
          if (!item.name) {
            this.$message.info('请输入主题名称');
            return reject();
          }
          if (item.name.length > 16) {
            this.$message.info('最大长度16个字符');
            return reject();
          }
          if (!name.reg.test(item.name)) {
            this.$message.info(`主题名称由${name.msg}`);
            return reject;
          }
          this.isLoading = true;
          if (item.id) {
            itemCardApi
              .theme_update({ id: item.id, name: item.name })
              .done(
                res => {
                  item.isEdit = false;
                  resolve();
                },
                () => {
                  reject();
                }
              )
              .always(() => {
                this.isLoading = false;
              });
          } else {
            itemCardApi
              .theme_add({ name: item.name, bgImg: item.url.imgUrl })
              .done(
                res => {
                  item.isEdit = false;
                  resolve();
                },
                () => {
                  reject();
                }
              )
              .always(() => {
                this.isLoading = false;
              });
          }
        });
        return p;
      },
      onImageAdd(info) {
        let canAdd = true;
        if (this.curEditItem && this.curEditItem.isEdit) {
          this.$message({
            message: '请先保存编辑的主题名称。',
            type: 'warning',
          });
          canAdd = false;
        }
        if (canAdd) {
          const item = {
            url: info,
            name: '',
            isEdit: true,
          };
          this.curEditItem = item;
          this.images.push(item);
        }
        Vue.nextTick(() => {
          this.styleUrl = null;
        });
      },
      onImageChange(info) {
        // todo: save image to server
      },
      onDelete(item) {
        if (this.curEditItem && this.curEditItem.id === item.id) {
          this.curEditItem = null;
        }
        if (!item.id) {
          this.images = this.images.filter(img => img !== item);
          return;
        }
        this.isLoading = true;
        itemCardApi
          .theme_delete({ id: item.id })
          .done(res => {
            this.images = this.images.filter(img => img.id !== item.id);
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          })
          .always(() => {
            this.isLoading = false;
          });
      },
      fetchData() {
        this.isLoading = true;
        itemCardApi
          .theme_select({
            pageNo: 1,
            pageSize: 1000,
          })
          .done(res => {
            this.images = (res.data || []).map(item => {
              return {
                id: item.id,
                name: item.name,
                preName: item.name,
                isEdit: false,
                url: {
                  imgUrl: item.bgImg,
                },
              };
            });
          })
          .always(() => {
            this.isLoading = false;
          });
      },
    },
  };
</script>

<style scoped lang="less">
  .gift-card-bg {
    padding: 20px 90px;
    background: #fff;

    .theme-img {
      width: 174px;
      height: 130px;
    }

    .theme-bg {
      position: relative;
      width: 174px;
      display: inline-block;
      margin-right: 50px;
      vertical-align: top;
    }

    .theme-name {
      position: relative;
      text-align: center;

      .theme-text-name {
        display: inline-block;
        box-sizing: border-box;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        height: 28px;
        line-height: 28px;
        color: @black-color;
        width: 100%;
      }

      .theme-icon {
        position: absolute;
        top: -180px;
        left: 0;
        background: #fff;
        width: 36px;
        height: 36px;
        line-height: 36px;
        border-radius: 50%;
        text-align: center;
        color: #ff5b56;
      }

      .theme-icon:hover {
        background: #fff1e8;
      }
    }

    .theme-add {
      background: #eff2f5;
      text-align: center;
      line-height: 130px;
      cursor: pointer;
    }
  }
</style>

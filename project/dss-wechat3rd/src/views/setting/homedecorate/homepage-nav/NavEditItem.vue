<template>
  <div
    class="nav-edit-item"
    :class="!(dataSource.icon || dataSource.selectedIconPath || dataSource.iconPath)?'nav-add-item':''"
  >
    <div class="com-close" @click="deleteItem" v-if="boolEdit">
      <i class="el-icon-close icon"></i>
    </div>
    <!-- <i class="com-close"></i> -->
    <!-- 增加一个遮罩，首页和我的显示，狙击事件传递 -->
    <!-- <div v-if="!boolEdit"
    class="cover"></div>-->
    <!-- <div class="title">导航{{index + 1}}:</div> -->
    <div @click="clickIt" class="edit-item-container" :class="validate?'':'error'">
      <!--icon图标-->
      <div class="row">
        <div class="cell">图标：</div>
        <!--已有图标-->
        <div
          class="cell"
          v-if="dataSource.icon || dataSource.selectedIconPath || dataSource.iconPath"
        >
          <div class="icon-area">
            <span
              class="img-box"
              :style="{background: OnIconImgSrc && !OnIconImgSrc.startsWith('http') ? themeColor : ''}"
            >
              <img :src="OnIconImgSrc" />
            </span>
            <span>选中</span>
          </div>
          <div class="icon-area">
            <img :src="OffIconImgSrc" />
            <span>未选中</span>
          </div>
          <a
            class="dss-link"
            style="display: table-cell"
            href="javascript:;"
            @click="iconVisible = true"
          >修改</a>
        </div>
        <!--没有图标-->
        <div class="cell" v-else>
          <div class="icon-area">
            <div class="icon-box" @click="iconVisible = true">
              <i class="el-icon-plus"></i>
            </div>
            <span>请选择导航图标</span>
          </div>
        </div>
      </div>

      <!--导航名称-->
      <div class="row">
        <div class="cell">名称：</div>
        <div class="cell">
          <el-input
            type="input"
            style="width:155px"
            maxlength="6"
            v-model="dataSource.text"
            placeholder="不能为空"
          >{{dataSource.text}}</el-input>
        </div>
      </div>

      <!--导航条颜色-->
      <div class="row">
        <div class="cell">标题栏背景色：</div>
        <div class="cell">
          <el-color-picker
            class="com-color-picker"
            style="border: 3px solid #d0d5d9;"
            color-format="hex"
            v-model="dataSource.navBackgroundColor"
            size="mini"
          ></el-color-picker>
        </div>
      </div>

      <!--导航条字体颜色-->
      <div class="row" v-if="dataSource.navFrontColor">
        <div class="cell">状态栏主题色：</div>
        <div class="cell">
          <el-radio-group v-model="dataSource.navFrontColor" size="small">
            <el-radio label="#ffffff">白</el-radio>
            <el-radio label="#000000">黑</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!--导航链接-->
      <div class="row">
        <div class="cell">链接：</div>
        <div class="cell cover-parents">
          <!-- <el-dropdown size="medium"
                       @command="pickLink">
            <div class='input-select'
                 :class="boolEdit ? 'input-select-able' : 'input-select-disable'">{{dataSource.name||''}}</div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in pages"
                                :key="index"
                                :command="item">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
          <div>
            <div v-if="!boolEdit" class="input-select input-select-disable">{{dataSource.name||''}}</div>
            <!-- <tabbar-link-select
              v-else
              :selectedOptions="selectedOptions()"
              @change="pickLink"
              :usedPages="usedPages"
            ></tabbar-link-select> -->
            <custom-link-select
              v-else
              :selectedOptions="selectedOptions()"
              @change="pickLink"
              :usedPages="usedPages"
            ></custom-link-select>
          </div>
          <div v-if="!boolEdit" class="cover"></div>
        </div>
      </div>

      <!--图标选择-->
      <icon-picker
        v-if="iconVisible"
        :theme-color="themeColor"
        @picked="onIconPicked"
        @closed="onIconClosed"
      ></icon-picker>
    </div>
  </div>
</template>

<script>
import '../custom-page-block.less';
import './index.less';
import imageLibrary from './imageLibrary';
import IconPicker from './IconPicker.vue';
import { mapState } from 'vuex';
// import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';

// import tabbarLinkSelect from '@/dss-wechat3rd/src/bz_components/tabbarLinkSelect/index.vue';
import CustomLinkSelect from '@/dss-wechat3rd/src/bz_components/custom-link-select/index.vue';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';

export default {
  mixins: [industryHelperMixin],
  components: { IconPicker, MaterialsImage, CustomLinkSelect },
  props: {
    index: {
      type: Number,
      default: 1
    },
    dataSource: {
      type: Object
    },
    pages: {
      type: Array
    },
    usedPages: {
      type: Object
    },
    boolEdit: {
      type: Boolean
    },
    themeColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      env: 'env'
    }),

    OnIconImgSrc() {
      if (this.dataSource.selectedIconPath.startsWith('http')) {
        return this.dataSource.selectedIconPath;
      } else {
        if (this.dataSource.icon) {
          const icon = imageLibrary.iconMap(this.mGetIndustryKey())[this.dataSource.icon];
          if (icon) {
            return icon.onIcon;
          }
        }
      }
      return null;
    },
    OffIconImgSrc() {
      if (this.dataSource.iconPath.startsWith('http')) {
        return this.dataSource.iconPath;
      } else {
        if (this.dataSource.icon) {
          const icon = imageLibrary.iconMap(this.mGetIndustryKey())[this.dataSource.icon];
          if (icon) {
            return icon.offIcon;
          }
        }
      }
      return null;
    },
    customPages() {
      return this.pages;
    }
  },
  data: function() {
    return {
      validate: true,
      iconVisible: false
    };
  },

  mounted() {},

  methods: {
    selectedOptions() {
      let editItem = this.dataSource;
      if (!editItem.pagePath) {
        return [];
      }
      let x = JSON.stringify({ index: editItem.realPath, name: editItem.name });
      if (!!editItem.pagePath) {
        if (editItem.pagePath.includes('tabbar-custom')) {
          return ['custom', x];
        } else {
          return ['default', x];
        }
      } else {
        return ['custom', x];
      }
    },
    onIconPicked(name) {
      if (typeof name === 'string') {
        this.$set(this.dataSource, 'icon', name);
        this.$set(this.dataSource, 'iconPath', 'images/tabbar/' + name + '-off.png');
        this.$set(this.dataSource, 'selectedIconPath', 'images/tabbar/' + name + '-on.png');
        this.iconVisible = false;
      } else {
        if (name.selectedIconPath) {
          this.$set(this.dataSource, 'selectedIconPath', name.selectedIconPath);
        }
        if (name.iconPath) {
          this.$set(this.dataSource, 'iconPath', name.iconPath);
        }
        this.iconVisible = false;
      }
    },

    onIconClosed() {
      this.iconVisible = false;
    },

    clickIt() {
      this.$emit('choose', this.index);
    },

    tryToValidate() {
      this.validate = false;
      if (!this.dataSource.iconPath || !this.dataSource.selectedIconPath) {
        return '请选择图标';
      }
      if (!this.dataSource.text) {
        return '请输入导航名称';
      }
      if (!this.dataSource.name) {
        return '请选择链接';
      }
      this.validate = true;
    },

    pickLink(params) {
      if (!params.length) {
        this.$emit('pickPageChange', {
          context: this.dataSource,
          params: null
        });
        return;
      }
      const item = JSON.parse(params[1]);
      this.$emit('pickPageChange', {
        context: this.dataSource,
        params: item
      });
    },

    deleteItem() {
      this.$emit('deleteItem', this.dataSource, this.index);
    }
  }
};
</script>

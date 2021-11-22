<template>
  <div class="wx-msg-panel">
    <div class="wx-msg-body">
      <content-title
        :type="store.type"
        :store="store"
        :hiddenOption="hiddenOption"
        @titleChange="catchTitleChange"
      ></content-title>
      <simple-text-editor
        v-if="store.type===ButtonTypes.TEXT"
        ref="$ste"
        bz="bzName"
        :store="store"
        :MAX_LENGTH='textLength'
        :writeHandler="changeMaterials"
      ></simple-text-editor>
      <rich-editor
        ref="$re"
        v-else
        :store="store"
        :isMass='isMass'
        :isSelfMotion='isSelfMotion'
        @changeMaterials="changeMaterials"
        :choosedMaterials="choosedMaterials"
        :contentType="store.type"
      ></rich-editor>
      <p class="_err_h5tips" v-if="err">{{err}}</p>
    </div>
  </div>
</template>

<script>
import { ButtonTypes } from '@/dss-wechat3rd/src/constants/wx-msg';
import SimpleTextEditor from '../simple-text-editor/index.vue';
import RichEditor from '../rich-editor/index.vue';
import ContentTitle from './ContentTitle.vue';
export default {
  components: { ContentTitle, SimpleTextEditor, RichEditor },
  props: {
    bzName: {
      type: String,
      default: 'dss'
    },
    store: {
      type: Object,
      default() {
        return {};
      }
    },
    isMass: {
      type: Boolean,
      default: false
    },
    choosedMaterials: {
      type: Object,
      default() {
        return {};
      }
    },
    hiddenOption: {
      type: Object,
      default() {
        return {};
      }
    },
    textLength: {
      type: Number,
      default: 400
    },
    isSelfMotion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      err: null,
      ButtonTypes: ButtonTypes
    };
  },
  computed: {},
  methods: {
    catchTitleChange(type) {
      this.store.type = type;
      if (type === ButtonTypes.TEXT && !this.choosedMaterials[this.store.type]) {
        return (this.store.value = '');
      }
      this.store.value = this.choosedMaterials[this.store.type] || null;
    },
    changeMaterials(value) {
      this.$emit('changeMaterials', value);
    },
    verify() {
      if (this.store.type == ButtonTypes.TEXT) {
        this.$refs.$ste.verify();
      } else {
        this.$refs.$re.verify();
      }
    }
  }
};
</script>


<style rel="stylesheet/less" lang="less">
.wx-msg-panel {
  padding: 24px 40px;
  margin-bottom: 30px;
  background-color: #ffffff;
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.05);
  .wx-msg-body {
    border: solid 1px #e4e8eb;
  }
}
</style>

<template>
  <div class="label-select">
    <div class="label-select__list">
      <div v-for="(item, index) of value" :key="index" class="label-select__item">
        <el-select
          :value="item.tagId"
          :disabled="disabled"
          placeholder="请选择"
          @change="updateTagValue(index, $event)"
        >
          <el-option v-for="tag in allTypes" :key="tag.id" :label="tag.tagName" :value="tag.id"></el-option>
        </el-select>

        <el-color-picker
          class="label-select__cp"
          title="字体颜色"
          :value="item.fontColor"
          :disabled="disabled"
          size="small"
          @input="updateValue(index, 'fontColor', $event)"
        />

        <el-color-picker
          class="label-select__cp"
          title="背景颜色"
          :value="item.bgColor"
          :disabled="disabled"
          size="small"
          @input="updateValue(index, 'bgColor', $event)"
        />
        <i class="label-select__remove el-icon-remove" @click="handleRemove(index)" />
      </div>
      <div>
        <el-button v-if="!value || value.length < 10" :disabled="disabled" type="text" @click="handleAdd"
          >+ 添加标签</el-button
        >
      </div>
    </div>

    <div v-if="value.length" class="label-select__preview">
      <div class="label-select__preview-title">预览效果</div>
      <div class="label-select__labels">
        <div
          v-for="(item, index) of value"
          :key="index"
          class="label-select__label"
          :style="{ background: item.bgColor || '#F5F7FB', color: item.fontColor || '#8B97A9' }"
        >
          {{ item.tagName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter';

  /**
   * 标签选择器
   */
  export default {
    name: 'LabelSelect',
    mixins: [emitter],
    props: {
      disabled: Boolean,
      inputClass: String,
      value: {
        /**
         * tagId: number
         * tagName: string
         * fontColor: string
         * bgColor: string
         */
        type: Array,
        default: () => [],
      },
      allTypes: {
        /**
         * tagId: number
         * tagName: string
         * fontColor: string
         * bgColor: string
         */
        type: Array,
        default: [],
      },
    },

    methods: {
      updateTagValue(index, tagId) {
        const tag = this.allTypes.find(item => item.id === tagId);
        const items = [...this.value];
        items[index] = { ...items[index], tagName: tag.tagName, tagId: tag.id };
        this.update(items);
      },
      updateValue(index, key, value) {
        const items = [...this.value];
        items[index] = { ...items[index], [key]: value };
        this.update(items);
      },
      handleAdd() {
        const value = [...this.value];
        const [first] = this.allTypes;
        let tagId = 0;
        let tagName = '标签名';
        const existingIds = value.map(item => item.tagId);
        const newTag = this.allTypes.find(item => !existingIds.includes(item.id));
        if (newTag) {
          tagId = newTag.id;
          tagName = newTag.tagName;
        } else if (first) {
          tagId = first.id;
          tagName = first.tagName;
        }
        value.push({ tagId, tagName, fontColor: '#8B97A9', bgColor: '#F5F7FB' });

        this.update(value);
      },
      handleRemove(index) {
        const value = [...this.value];
        value.splice(index, 1);
        this.update(value);
      },
      update(value) {
        this.$emit('input', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
    },
  };
</script>

<style scoped>
  .label-select {
    display: flex;
  }

  .label-select__preview {
    width: 400px;
    margin-left: 55px;
    border: 1px solid #c0c4cc;
    padding: 5px 12px;
  }

  .label-select__item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .el-select {
    width: 220px;
  }

  .label-select__cp {
    margin-left: 10px;
  }

  .label-select__preview-title {
    color: gray;
  }

  .label-select__labels {
    display: flex;
    flex-wrap: wrap;
  }

  .label-select__label {
    font-size: 14px;
    line-height: 22px;
    padding: 0 0.5em;
    margin-bottom: 5px;
    margin-right: 5px;
  }

  .label-select__remove {
    font-size: 18px;
    margin-left: 10px;
    color: #e63f3f;
    cursor: pointer;
  }
</style>

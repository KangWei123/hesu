<template>
  <el-input class="input" placeholder="前缀必须包含http" v-model="model" size="mini" />
</template>

<script>
  export default {
    name: 'H5LinkInput',
    props: {
      value: { type: String, default: '{}' },
    },
    computed: {
      model: {
        get() {
          try {
            return JSON.parse(this.value).id;
          } catch (err) {
            return '';
          }
        },
        set(value) {
          const item = { id: '', name: 'H5 链接' };
          item.id = value;
          this.$emit('input', JSON.stringify(item));
        },
      },
    },
  };
</script>

<style></style>

<template>
  <el-input class="input" placeholder="小程序的appId" v-model="model" size="mini" />
</template>

<script>
  export default {
    name: 'LinkMiniappInput',
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
          const item = {
            linkType: 'miniProgram',
            id: '',
          };
          item.id = value;
          this.$emit('input', JSON.stringify(item));
        },
      },
    },
  };
</script>

<style></style>

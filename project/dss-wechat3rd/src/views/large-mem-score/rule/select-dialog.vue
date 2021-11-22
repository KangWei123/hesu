<template>
  <table-select-dialog
    v-model="showDialog"
    class="category-select-dialog"
    enable-multiple
    :columns="columns"
    :data-list="list"
    :selected-list="selected"
    :title="title"
    height="400"
    :union-keys="['id']"
    :close-on-click-modal="false"
    @choose="handleChoose"
  />
</template>

<script>
  import TableSelectDialog from '@/business-common/components/table-select-dialog/index.vue';

  export default {
    name: 'CategorySelectDialog',
    components: {
      TableSelectDialog,
    },
    props: {
      title: {
        type: String,
        default: '适用经营类目',
      },
      columns: {
        type: Array,
        default() {
          return [];
        },
      },
      value: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 0,
      },
      selected: {
        type: Array,
        default: function () {
          return [];
        },
      },
      formatData: {
        type: Function,
        default(i) {
          return i;
        },
      },
      onFetch: {
        type: Function,
        default() {},
      },
    },
    data() {
      return {
        showDialog: false,
        list: [],
      };
    },
    async mounted() {
      const { data } = await this.onFetch({
        pageNo: 1,
        pageSize: 200,
      });
      this.list = data;
    },
    watch: {
      value(newVal) {
        this.showDialog = newVal;
      },
      showDialog(newVal) {
        this.$emit('input', newVal);
      },
    },
    methods: {
      handleChoose(selectedRows) {
        this.$emit('choosed', this.formatData(selectedRows));
      },
    },
  };
</script>

<template>
  <switch-store-tip>
    <div class="category-container" v-loading="loading">
      <Guide @updataCategoryType="changeCategoryType1"></Guide>
    </div>
  </switch-store-tip>
</template>

<script>
  import service from '@/dss-wechat3rd/src/api/wx_store_item.js';
  import merchantApi from '@/dss-wechat3rd/src/api/merchant.js';
  import Guide from './guide.vue';
  import './index.less';
  import SwitchStoreTip from '@/business-common/components/switch-store-tip/index.vue';

  export default {
    components: {
      Guide,
      SwitchStoreTip,
    },
    data() {
      return {
        loading: false,
      };
    },

    mounted() {
      // 查询店铺使用类目级别配置
      this.queryUseCategory();
    },

    methods: {
      // 查询店铺使用类目级别配置
      queryUseCategory() {
        this.loading = true;
        const params = {};
        service
          .queryUseCategory(params)
          .done(res => {
            this.categoryType = String(res.data) || '1';
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 修改店铺使用类目级别配置
      changeCategoryType1(obj) {
        const x = [];
        obj.forEach(element => {
          // x.push(this.saveData(element));
          this.saveFloorData(element);
        });

        /* Promise.all(x).then(res => {
        console.log('Promise.all ---->   ', res);
        // 保存类型
        const params = {
          level: this.categoryType
        };
        service
          .updateUseCategory(params)
          .done(res1 => {
            this.$message.success('保存成功！');
          })
          .always(() => {});
      }); */
      },

      saveData(editCategory) {
        const params = {
          id: editCategory.id,
          name: editCategory.name,
          imgUrl: editCategory.topicImageURL,
          imgUrlValue: editCategory.imgUrlValue,
        };
        return service.saveCategory(params);
      },
      saveFloorData(editCategory) {
        const params = {
          id: editCategory.id,
          name: editCategory.name,
          topicImageURL: editCategory.topicImageURL,
        };
        merchantApi.updateFloor(params).done(res => {
          if (res.success) this.$message.success('保存成功');
        });
      },
    },
  };
</script>

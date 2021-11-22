<template>
  <el-dialog title="添加商家印象" :close-on-click-modal="false" :visible.sync="dialogVisible" width="500px">
    <el-form :model="form">
      <el-form-item label="选择标签:" prop="tags" label-width="100px">
        <multi-cascader
          :show-loading-indicator="false"
          separator=":"
          show-all-levels
          :select-children="true"
          children-key="sub"
          :allow-load-children="true"
          label-key="title"
          output-level-value
          :load-children-method="tagLoadChildrenMethod"
          :panel-width="'auto'"
          value-key="id"
          v-model="form.tags"
          :options="tagList"
          select-width="300px"
          size="mini"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="onOk" :disabled="disabledOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import MultiCascader from '@/mod-member/src/components/multiCascader/index.vue';
  import memberApi from '@/mod-member/src/api/memberAPI.js';
  import api from '@/mod-member/src/api/manage.js';

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: Number,
        default: -1,
      },
      // 会员id，添加商家印象需要传入
      memberId: {
        type: Number,
        default: -1,
      },
      impressionTags: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    components: {
      MultiCascader,
    },
    data() {
      return {
        tagList: [],
        dialogVisible: false,
        form: {
          tags: [],
        },
        childTag: [],
        btnLoading: false,
      };
    },
    computed: {
      disabledOk() {
        return !this.form.tags.length;
      },
    },
    watch: {
      visible(val) {
        if (val !== this.dialogVisible) {
          this.dialogVisible = val;
        }
      },
      dialogVisible(val) {
        if (val !== this.visible) {
          this.$emit('update:visible', val);
        }
        if (!val) {
          this.form.tags = [];
          this.childTag = [];
        }
      },
    },
    mounted() {
      this.featchTags();
    },
    methods: {
      onCancel() {
        this.dialogVisible = false;
      },
      onOk() {
        // this.dialogVisible = false;
        if (!this.form.tags.length) {
          return false;
        }
        this.addTags();
      },
      addTags() {
        console.log('form tags---------->', this.form.tags);
        // 将标签的分类id和标签id序列化
        this.btnLoading = true;
        const tags = this.form.tags.map(item => {
          const data = item.split(':');
          return {
            categoryId: data[0],
            id: data[1],
          };
        });
        // 根据id找到标签的数据
        const labels = this.childTag
          .filter(item => {
            return !!~tags.findIndex(tag => {
              return tag.categoryId == item.categoryId && tag.id == item.id;
            });
          })
          .map(item => ({ labelName: item.name, labelId: item.id }));
        const params = {
          clientId: this.userId,
          labels: labels,
          memberId: this.memberId,
        };
        api
          .addLabel(params)
          .done(res => {
            this.dialogVisible = false;
            this.$emit('addSucceed');
            this.$message({
              message: '添加成功',
              type: 'success',
            });
          })
          .always(_ => {
            this.btnLoading = false;
          });
      },
      featchTags() {
        return memberApi
          .getLabelCategories()
          .done(res => {
            this.tagList = (res.data || []).map(item => {
              const id = item.id;
              return {
                title: item.name,
                type: 'main',
                id: id + '',
                childCount: item.childCount,
              };
            });
          })
          .catch(err => {
            console.log(err);
          });
      },
      tagLoadChildrenMethod(data) {
        if (data.childCount > 0) {
          return memberApi.getTagByCategory({ categoryId: data.id }).done(res => {
            // 保存子标签
            this.childTag = [...this.childTag, ...(res.data || [])];
            // 序列化标签内容
            return (res.data || []).map(item => {
              const disabled = !!~this.impressionTags.findIndex(tag => {
                // console.log(tag);
                return item.id === tag.tagId;
              });
              const childMax = data.title.length > 8 ? 8 : 10;
              let title = item.name || '';
              title = title.length > 10 ? title.slice(0, childMax) + '...' : title;
              return {
                title,
                id: item.id,
                disabled,
                subId: item.id,
                type: 'sub',
                sub: null,
              };
            });
          });
        } else {
          return Promise.resolve([]);
        }
      },
    },
  };
</script>

<style lang="less"></style>

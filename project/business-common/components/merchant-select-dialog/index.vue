/** * 选择适用项目包含子项目选择组件 */
<template>
  <el-dialog class="merchant-select-dialog" title="选择适用项目" :visible.sync="visible" width="800" append-to-body>
    <el-form class="filter" ref="form" :model="form" inline>
      <el-form-item label="项目名称：" prop="name">
        <el-input @input="fetchStores" class="w200" v-model.trim="form.name" clearable placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item v-if="isVisibleMerchant" label="商户名称：" prop="fuzzyName">
        <el-input
          @input="fetchMerchants"
          class="w200"
          v-model.trim="form.fuzzyName"
          clearable
          placeholder="请输入商户名称"
        />
      </el-form-item>
    </el-form>

    <div class="main-content">
      <div class="item">
        <div class="select-panel">
          <div class="select-panel__header">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="allChecked"
              @change="onCheckAllChange"
              style="color: #8d939d"
            >
              项目名称
            </el-checkbox>
            <div class="select-panel__body">
              <div class="select-panel__list">
                <el-checkbox-group v-model="checkStore" @change="handleStoreChange">
                  <el-checkbox
                    v-for="(item, idx) in storeList"
                    :key="item.id"
                    :label="item.id"
                    @change="onStoreChange($event, item.id, idx)"
                    :class="idx === index ? 'is-click' : ''"
                    :indeterminate="item.indeterminate"
                  >
                    <div @click.prevent="onClickStore(idx, item.id)">
                      <span>{{ item.name }}</span>
                      <i class="el-icon-arrow-right icon"></i>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isVisibleMerchant" class="item">
        <div class="select-panel">
          <div class="select-panel__header">
            <div class="select-panel__title">商户名称</div>
            <div class="select-panel__body">
              <div v-if="merchantList && merchantList.length" class="select-panel__list">
                <el-checkbox-group v-model="checkMerchant" @change="onMerchantChange">
                  <el-checkbox v-for="item in merchantList" :key="item.subStoreId" :label="item.subStoreId">
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="select-panel__not">
                <img class="image" src="./not.png" alt="" />
                <span class="desc">暂无数据</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import api from '@/dss-wechat3rd/src/api/index';
  import { businessApi } from '@/business-common/api';

  export default {
    name: 'MerchantSelectDialog',
    props: {
      parent: {
        type: Array,
        default: () => [],
      },
      // 停车券不展示商户选择
      isVisibleMerchant: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        form: {
          name: '',
          fuzzyName: '',
        },
        visible: false,
        allChecked: false,
        // 项目列表
        storeList: [],
        // 已选择的项目
        checkStore: [],
        storeId: '',
        // 商户列表
        merchantList: [],
        // 已选择的商户
        checkMerchant: [],
        // 选中的项目 & 商户
        checked: [],
        // 记录商户的总条数
        merchantTotalCount: 0,
        toggle: false,
        index: -1,
      };
    },
    computed: {
      // 控制项目全选展示
      isIndeterminate() {
        const checkedLength = this.checkStore.length;
        return checkedLength > 0 && checkedLength < this.storeList.length;
      },
      isItemIndeterminate() {
        const checkedLength = this.checkMerchant.length;
        return checkedLength > 0 && checkedLength < this.merchantTotalCount;
      },
    },
    watch: {
      parent: {
        handler(data) {
          if (!(data && data.length)) {
            // 清空数据
            this.checked = [];
            this.checkStore = [];
            this.checkMerchant = [];
            this.allChecked = false;
          } else {
            this.checked.forEach((x, index) => {
              const idx = data.findIndex(item => item.storeId === x.parent);

              if (idx === -1) {
                this.checked.splice(index, 1);
              } else {
                const { child } = x;
                child &&
                  child.length &&
                  child.forEach((subItem, subIndex) => {
                    const subIdx = data[idx].subStoreList.findIndex(rs => rs.subStoreId === subItem);

                    if (subIdx === -1) {
                      this.checked[index].child.splice(subIndex, 1);
                    }
                  });
              }
            });
            this.checkStore = this.checked.map(item => item.parent);
          }

          this.storeList.forEach(item => {
            if (this.checked.findIndex(x => x.parent === item.id) === -1) {
              item.indeterminate = false;
            }
          });
        },
        deep: true,
      },
    },
    mounted() {
      this.fetchStores();
    },
    methods: {
      show() {
        this.visible = true;
      },
      async fetchStores() {
        const { data } = await api.queryStoreList({ storeName: this.form.name, pageSize: 10000 });
        data.map(item => {
          return {
            ...item,
            indeterminate: false,
          };
        });

        this.storeList = data;
        this.merchantList = [];
      },
      async fetchMerchants() {
        const params = { storeId: this.storeId, fuzzyName: this.form.fuzzyName };
        const { data, totalCount } = await businessApi.business.query(params);

        this.merchantList = data;

        if (!this.form.fuzzyName) {
          // 记录未搜索时的商户总数
          this.merchantTotalCount = totalCount;
        }

        return data;
      },

      onCheckAllChange(val) {
        this.toggle = val;
        this.checkStore = val ? this.storeList.map(item => item.id) : [];

        const all = [];
        this.storeList.forEach(item => {
          item.indeterminate = false;
          all.push({
            parent: item.id,
            child: [],
            // 适用子项目类型 0：所有项目 1：部分项目
            suitSubStoreType: 0,
          });
        });

        this.checked = val ? all : [];
        this.checkMerchant = val ? this.checkMerchant : [];
        val && this.checked.map(item => item.suitSubStoreType === 0);

        // 判断勾选了部分商户的时候再全选的情况
        if (this.storeId) {
          const child = this.setCheckedMerchant(this.toggle, this.merchantList);
          this.checkMerchant = val ? child : [];
        }
      },

      onClickStore(index, id) {
        this.index = index;
        this.storeId = id;

        this.onCheckSelect(id);
      },

      onStoreChange($event, id, index) {
        this.index = index;
        this.toggle = $event;
        this.storeId = id;

        this.getCheckedNodes(id);
      },

      handleStoreChange(val) {
        const checkedCount = val.length;
        // 项目勾选的状态，全选时打勾
        this.allChecked = checkedCount === this.storeList.length;
      },

      onMerchantChange($arr) {
        // 商户选择，显示勾选项目的情况
        if (!this.checked.some(item => item.parent === this.storeId)) {
          // 没有就添加，项目对应商户
          this.checked.push({
            parent: this.storeId,
            child: [],
            // 适用子项目类型 0：所有项目 1：部分项目
            suitSubStoreType: 1,
          });
        }

        // 对应项目勾选状态
        const parent = this.storeList.find(item => item.id === this.storeId);
        parent.indeterminate = false;

        if ($arr && $arr.length) {
          const idx = this.checked.findIndex(item => item.parent === this.storeId);
          this.checked[idx].child = $arr;

          // 如果当前选择的子项目数量等于总的子项目则是全部，否则是部分子项目。
          console.log(this.merchantTotalCount);
          if ($arr.length < this.merchantTotalCount) {
            this.checked[idx].suitSubStoreType = 1;
            parent.indeterminate = this.isItemIndeterminate;
          } else {
            this.checked[idx].suitSubStoreType = 0;
          }

          this.checkStore = this.checked.map(item => item.parent);
        } else {
          const index = this.checkStore.findIndex(item => item === this.storeId);
          const checkIdx = this.checked.findIndex(item => item.parent === this.storeId);

          // 商户清空时对应清空项目
          this.checkStore.splice(index, 1);
          this.checked.splice(checkIdx, 1);
        }
      },

      onCheckSelect(storeId) {
        const promise = this.fetchMerchants();

        this.storeId &&
          promise.then(res => {
            const child = this.setCheckedMerchant(this.toggle, res);

            const o = this.checked && this.checked.length && this.checked.find(item => item.parent === storeId);

            // 全选的情况要默认全部选上，勾选的情况保留原数据
            if (this.toggle && o && !o.child.length) {
              o.child = child;
            }

            this.checkMerchant = (o && o.child) || [];
          });
      },

      getCheckedNodes(storeId) {
        const promise = this.fetchMerchants();

        this.storeId &&
          promise.then(res => {
            const child = this.setCheckedMerchant(this.toggle, res);

            // 判断是否有添加新的项目及项目项目下的商户
            if (!this.checked.some(item => item.parent === storeId)) {
              // 没有就添加，项目对应商户
              this.checked.push({
                parent: storeId,
                child: child,
                // 适用子项目类型 0：所有项目 1：部分项目
                suitSubStoreType: 0,
              });
            } else {
              // 有就更新 checked
              const idx = this.checked.findIndex(item => item.parent === storeId);

              if (this.toggle) {
                this.checked[idx].child = child;
              } else {
                this.checked.splice(idx, 1);
              }
            }
            this.checkMerchant = child;

            const current = this.storeList.find(item => item.id === storeId);
            current.indeterminate = this.isItemIndeterminate;
          });
      },

      setCheckedMerchant(isChecked, data) {
        return isChecked ? data.map(item => item.subStoreId) : [];
      },

      onSubmit() {
        const params = {};
        const checked = this.checked;

        const storeList = checked.map(item => {
          const { parent, child, suitSubStoreType } = item;
          const subStoreList =
            (child &&
              child.length &&
              child.map(c => {
                return { subStoreId: c };
              })) ||
            [];

          // 处理成后端需要的格式
          return {
            storeId: parent,
            suitSubStoreType: suitSubStoreType,
            subStoreList: subStoreList,
          };
        });

        params.storeList = storeList;

        this.$emit('select', params);
        this.visible = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .merchant-select-dialog {
    /deep/ .el-checkbox {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #eaeff5;
      padding: 0 16px;
      margin-right: 0;
    }

    .is-click {
      background: #fff7e6;
    }

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #333;
    }

    /deep/ .el-checkbox__label {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: left;
    }
  }

  .main-content {
    display: flex;
    flex-direction: row;
    border: 1px solid #eaeff5;

    .item {
      flex: 1;

      &:first-child {
        border-right: 1px solid #eaeff5;
      }
    }

    .select-panel {
      height: 300px;
      overflow-y: auto;

      .select-panel__title {
        text-align: left;
        color: #8d939d;
        padding: 0 16px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eaeff5;
      }

      .icon {
        position: absolute;
        right: 0;
        top: 13px;
        font-size: 14px;
        width: 24px;
        height: 24px;
      }

      .select-panel__not {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 64px;
      }

      .image {
        width: 80px;
        height: 80px;
      }

      .desc {
        font-size: 12px;
        color: #8d939d;
      }
    }
  }
</style>

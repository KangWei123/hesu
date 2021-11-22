<template>
  <el-dialog
    title="选择项目"
    :visible.sync="dialogVisible"
    width="800"
    :before-close="dialogBeforeClose"
    :close-on-click-modal="false"
  >
    <list-page-layout>
      <template #filters>
        <div class="filter">
          <el-form ref="form" :model="form" @submit.prevent.native="$refs.table.search()" inline>
            <el-form-item label="关键字" prop="name">
              <el-input style="width: 160px" v-model="form.name" clearable placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item label="所属区域" prop="area">
              <el-cascader
                expand-trigger="hover"
                @active-item-change="onAreaChange"
                :options="areas"
                placeholder="请选择省/市/区"
                :props="{ label: 'name', value: 'id', children: 'childNode' }"
                v-model="form.area"
                separator="-"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button plain @click="$refs.form.resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>

      <fat-table
        ref="table"
        :fetch-handler="handleFetch"
        :state.sync="form"
        selectable
        :check-selectable="selectable || checkSelectable"
        need-select-data
        :selected-data="selectData"
        :selected="selected"
        @update:selected-data="$emit('update:select-data', $event)"
        @update:selected="$emit('update:select-ids', $event)"
        row-key="id"
      >
        <el-table-column prop="prjName" align="center" label="项目名称"> </el-table-column>
        <el-table-column prop="areaName" align="center" label="所属区域"> </el-table-column>
      </fat-table>
    </list-page-layout>

    <div slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { regionApi } from '@/business-common/api';
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import { projectApi } from '@/mod-kangyang/src/api';

  export default {
    name: 'ProjectSelector',
    components: {
      ListPageLayout,
      FatTable,
    },
    props: {
      /**
       * 必传
       * 用于返回当前选择的id数组
       */
      selectIds: {
        type: Array,
        default: () => [],
      },
      /**
       * 可选
       * 用于返回用户当前选择的对象数组
       */
      selectData: {
        type: Array,
        default: () => [],
      },
      /**
       * 必传
       * 用于设置当前选择
       */
      selected: {
        type: Array,
        default: () => [],
      },
      // 决定 CheckBox 是否可以勾选
      selectable: {
        type: Function,
        default: null,
      },
    },
    data() {
      return {
        dialogVisible: true,
        areas: [],
        form: {
          name: null,
          area: [],
        },
        originSelected: null, // 第一次打开时的选中值, 用于保留状态
      };
    },
    watch: {
      selected(arr) {
        this.originSelected = this.originSelected || arr;
      },
    },
    mounted() {
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.form.area);
      });
    },
    methods: {
      checkSelectable(row) {
        return +row.useStatus !== 1 || this.originSelected?.includes(row.id);
      },
      open() {
        this.dialogVisible = true;
      },
      async handleFetch(e) {
        const params = {
          pageSize: e.pagination.pageSize,
          pageNo: e.pagination.currentPage,
        };
        if ((this.form.area || []).length > 0) {
          params.provinceId = this.form.area[0];
          params.cityId = this.form.area[1];
          params.districtId = this.form.area[2];
        }
        if (this.form.name != null) {
          params.storeName = this.form.name;
        }

        const { data } = await projectApi.getSimpleList(params);
        const list = (data || []).map(item => {
          item.name = item.prjName;
          return item;
        });

        return {
          list: list,
          total: list.length,
        };
      },
      confirm() {
        this.$emit('confirm');
      },
      cancel() {
        this.$emit('cancel');
      },
      dialogBeforeClose() {
        this.cancel();
      },
      fetchAreas(id) {
        if (id) {
          const node = this.getNodeById(this.areas, id);
          if (!node || node.isloaded) {
            return;
          }
          return regionApi.queryRegion(id).done(({ data }) => {
            node.isloaded = true;
            node.childNode = this.addChildren(data);
          });
        }

        return regionApi.queryRegion().done(({ data }) => {
          this.areas = this.addChildren(data);
        });
      },
      addChildren(nodes) {
        if (!nodes || nodes.length === 0) {
          return null;
        }
        for (const node of nodes) {
          if (!node.isLeaf) {
            node.childNode = [];
          }
        }
        return nodes;
      },
      getNodeById(areas, id) {
        for (const area of areas) {
          if (area.id === id) {
            return area;
          }
          if (area.childNode && area.childNode.length) {
            const findedNode = this.getNodeById(area.childNode, id);
            if (findedNode) {
              return findedNode;
            }
          }
        }
      },
      // 获取路径初始化值
      fetchInitAreas(index, ids) {
        if (index >= ids.length || index >= 2) {
          // 超过数组和 3 级节点，不加载
          return;
        }

        const promise = this.fetchAreas(ids[index]);
        if (promise) {
          promise.done(() => {
            this.fetchInitAreas(index + 1, ids);
          });
        } else {
          this.fetchInitAreas(index + 1, ids);
        }
      },
      getPath(areaIds) {
        let list = this.areas;
        const path = [];
        for (const areaId of areaIds) {
          const finded = list.find(a => a.id === areaId);
          if (!finded) {
            return path;
          }
          path.push(finded);
          list = finded.childNode;
        }
        return path;
      },
      onAreaChange(ids) {
        if (ids && ids.length) {
          this.fetchAreas(ids[ids.length - 1]);
        }
      },
    },
  };
</script>

<style lang="less">
  .filter {
    margin-top: -30px;
    text-align: left;
  }
</style>

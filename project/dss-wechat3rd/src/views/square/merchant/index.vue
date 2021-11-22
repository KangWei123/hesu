<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="$router.push({ path: '/square/merchant/add', query: {} })">新增商户</el-button>
    </template>
    <template #filters>
      <el-form inline :model="toolForm" ref="toolForm" label-suffix=":" @submit.prevent.native="$refs.table.search()">
        <el-form-item label="商户信息" prop="nameOrCode" class="form-item-keword">
          <el-input
            class="w220"
            v-model.trim="toolForm.nameOrCode"
            maxlength="32"
            placeholder="输入商户名称/商户编号"
            clearable
          />
        </el-form-item>

        <el-form-item label="商户分类" prop="tenantCategoryId">
          <el-select class="w220" v-model="toolForm.tenantCategoryId" placeholder="请选择经营类目" clearable>
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :value="item.id"
              :label="item.categoryName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商户状态" prop="active">
          <el-select class="w220" v-model="toolForm.active" placeholder="请选择商户状态" clearable>
            <el-option
              v-for="(item, index) in statusGroup"
              :key="index"
              :value="item.val"
              :label="item.lab"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="楼栋信息" prop="buildingName">
          <el-cascader
            class="w220"
            v-model="toolForm.buildingName"
            clearable
            placeholder="请选择楼栋"
            :options="building"
            :props="{ value: 'name', label: 'name', children: 'floor', checkStrictly: true }"
            @change="onSelectBuilding"
          />
        </el-form-item>
        <el-form-item>
          <el-button plain @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table
      class="merchant"
      ref="table"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      :state.sync="toolForm"
      remove-confirm-title="删除"
      remove-confirm-message="删除该商户后，将不再展示该商户的信息，请谨慎操作"
      row-key="id"
    >
      <el-table-column label="商户信息" width="220px" fixed="left">
        <div class="row-logo ellipsis" slot-scope="scope">
          <img class="img-l" :src="scope.row.logo" /> {{ scope.row.name }}
        </div>
      </el-table-column>
      <el-table-column label="商户编号" prop="code" min-width="150px" />
      <el-table-column label="楼层位置" prop="floor" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.buildingName ? `${scope.row.floor}-${scope.row.mallStoreCode}` : '' }}
        </template>
      </el-table-column>
      <el-table-column label="楼栋" prop="buildingName" min-width="150px" />
      <el-table-column label="分类" prop="tenantCategoryName" min-width="150px" />
      <el-table-column label="主次力店" min-width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.primarySecondary === 1">主力店</span>
          <span v-if="scope.row.primarySecondary === 2">次力店</span>
          <span v-if="scope.row.primarySecondary === 3">普通商户</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="active" min-width="100px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.active"
            active-color="#4379ed"
            inactive-color="rgba(0, 0, 0, 0.25)"
            active-text="启用"
            inactive-text="停用"
            :active-value="1"
            :inactive-value="0"
            @change="onStatusChange($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="小程序" prop="showOnApp" min-width="150px">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.active === 0"
            class="item"
            effect="dark"
            content="该商户已停用，无法打开显示"
            placement="top-start"
          >
            <el-switch
              :disabled="scope.row.active === 0"
              v-model="scope.row.showOnApp"
              active-color="#4379ed"
              inactive-color="rgba(0, 0, 0, 0.25)"
              active-text="显示"
              inactive-text="隐藏"
              :active-value="1"
              :inactive-value="0"
              @change="onShowChange(scope.row)"
            ></el-switch>
          </el-tooltip>
          <el-switch
            v-else
            :disabled="scope.row.active === 0"
            v-model="scope.row.showOnApp"
            active-color="#4379ed"
            inactive-color="rgba(0, 0, 0, 0.25)"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="1"
            :inactive-value="0"
            @change="onShowChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="排序" min-width="150px" prop="seq">
        <!-- <template slot-scope="scope">
          <merchant-ranking
            :store-id="scope.row.storeId"
            :row-rank="scope.row.seq"
            @refresh="$refs.table.refresh()"
          ></merchant-ranking>
        </template> -->
      </el-table-column>
      <el-table-column label="操作人" min-width="100px">
        <template slot-scope="scope">
          <p>{{ scope.row.operatorName || '未知' }}</p>
          <p>{{ scope.row.operatorPhone || '未知' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" min-width="200px" />
      <el-table-column label="操作" fixed="right" align="left" v-slot="scope" min-width="300px">
        <table-actions :options="tableActions(scope.row)" />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import merchantApi from '@/dss-wechat3rd/src/api/merchant';
  import categoryApi from '@/dss-wechat3rd/src/api/category';

  export default {
    components: { ListPageLayout, FatTable, TableActions },
    data() {
      return {
        toolForm: {
          nameOrCode: '',
          tenantCategoryId: '',
          active: '',
          buildingId: '',
          buildingName: '',
          floor: '',
        },
        categoryList: [], // 分类列表
        // 状态列表
        statusGroup: [
          {
            lab: '停用',
            val: 0,
          },
          {
            lab: '启用',
            val: 1,
          },
        ],
        building: [], // 楼栋列表
        classification: '',
        loading: '',
        table: {
          loading: false,
          list: [],
        },
        pageParams: {
          total: 0,
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        floor: {
          loading: false,
          curId: null,
          list: [],
        },
        dialog: {
          floorName: '',
          floorId: -1,
          floor: false,
          merchant: false,
        },
        merchantsUrl: '/square/account',
      };
    },
    computed: {
      ...mapState({
        curStore: 'curStore',
      }),
    },

    created() {
      this.fetchBuilding();
      this.fetchCategory();
    },
    methods: {
      tableActions(row) {
        return [
          {
            name: '查看',
            link: {
              path: '/square/merchant/view',
              query: { itemNo: row.storeId, id: row.id },
            },
          },
          {
            name: '编辑',
            link: {
              path: '/square/merchant/edit',
              query: { itemNo: row.storeId, id: row.id },
            },
          },
          {
            name: '删除',
            onClick: () => {
              this.$refs.table.remove(row.id);
            },
          },
        ];
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...this.toolForm,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        delete payload.buildingName;

        const { data, totalCount } = await merchantApi.business.query(payload);
        return {
          list: data,
          total: totalCount,
        };
      },
      async handleRemove(ids) {
        return merchantApi.business.del({ id: ids[0] });
      },

      onReset() {
        this.$refs.toolForm.resetFields();

        if (!this.toolForm.buildingName[0]) {
          this.toolForm.floor = '';
          this.toolForm.buildingId = '';
        }
      },
      onShowChange(row) {
        this.table.loading = true;
        const params = {
          id: row.id,
          showOnApp: row.showOnApp === 0 ? 0 : 1,
        };
        merchantApi.business.updateStatus(params).always(() => {
          this.table.loading = false;
          this.$refs.table.refresh();
        });
      },

      onStatusChange(v, row) {
        this.table.loading = true;
        const params = {
          id: row.id,
          active: v,
          showOnApp: v === 0 ? 0 : '',
        };
        merchantApi.business
          .updateStatus(params)
          .done(
            res => {
              this.$refs.table.refresh();
            },
            res => {
              row.active = v === 1 ? 0 : 1;
            }
          )
          .always(() => {
            this.table.loading = false;
          });
      },

      onSelectBuilding(e) {
        const building = this.building.find(item => item.name === e[0]);
        this.toolForm.buildingId = building && building.id;
        this.toolForm.floor = e[1];
      },

      /**
       * 获取楼栋信息
       */
      async fetchBuilding() {
        const { data } = await merchantApi.floor.queryFloor();

        this.building =
          data &&
          data.map(i => {
            return {
              id: i.id,
              name: i.name,
              floor: JSON.parse(i.floor || '{}'),
            };
          });
      },

      /**
       * 获取商户分类列表
       */
      async fetchCategory() {
        const { data } = await categoryApi.category.list();
        this.categoryList = data;
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '../../../../../dss-common/style/wkt-constants.less';

  .merchant {
    position: relative;

    .title {
      font-size: 20px;
      color: @black-color;
      padding-left: 20px;
      height: 50px;
      line-height: 50px;
    }

    .export-box {
      margin: 20px 20px 0 20px;

      .el-button {
        border-radius: 4px;
      }
    }

    @lcBarWidth: 150px;
    @floorRightMargin: 10px;

    .wkt-lcMenu {
      float: left;
      width: @lcBarWidth;
      height: 700px;
      margin: 0 @floorRightMargin;
      padding-top: 20px;

      ul {
        display: block;
        @liItemHeight: 32px;

        .floor-li {
          position: relative;
          display: block;
          height: @liItemHeight;
          line-height: @liItemHeight;
          padding-left: 20px;

          &:hover,
          &.active-li {
            background: #f5f7fa;
          }
        }

        .li-name {
          margin-right: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .li-btn {
          position: absolute;
          right: 0;
          top: 0;
          width: 32px;
          height: 100%;

          .more-pop {
            position: absolute;
            right: 0;
            top: 32px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            display: none;
            width: 80px;
            height: 60px;
            background: #fff;
            text-align: center;
            z-index: 10;
          }

          &:hover {
            .more-pop {
              display: block;
            }
          }
        }
      }
    }

    @rowHeight: 36px;

    .row-logo {
      height: @rowHeight;
      line-height: @rowHeight;
      display: flex;

      .img-l {
        height: @rowHeight;
        width: @rowHeight;
        border-radius: 50%;
        display: inline-block;
        justify-content: center;
        margin-right: 10px;
        background-size: contain;
      }
    }
  }
</style>
<style lang="less">
  .wkt-body .form-item-keword {
    .el-input {
      width: 220px;
    }
  }
</style>

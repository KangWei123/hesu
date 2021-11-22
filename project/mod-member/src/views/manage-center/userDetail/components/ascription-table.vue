<template>
  <div>
    <el-table :data="formattedList" stripe v-loading="loading" class="wkt-table ascription" ref="ascription-table">
      <el-table-column label="归属门店" prop="storeName"> </el-table-column>
      <el-table-column label="归属导购" prop="employeeName"> </el-table-column>
      <el-table-column label="客户阶段" prop="stageName"> </el-table-column>
      <el-table-column label="企微标签" prop="corpTagName" width="450">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="无归属门店或无导购跟进"
            placement="top"
            v-if="scope.row.totalTags"
          >
            <div slot="content">
              <a class="tag-light" v-for="item in scope.row.totalTags" :key="item">{{ item }}</a>
            </div>
            <div>
              <a class="tag" v-for="item in scope.row.cutTags" :key="item">{{ item }}</a>
              <span v-if="scope.row.totalTags.length !== scope.row.cutTags.length">...</span>
            </div>
          </el-tooltip>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <a href="javascript:;" @click="changeGuide(scope.row, scope.$index)" v-if="scope.row.employeeId">移交导购</a>
          <el-tooltip class="item" effect="dark" content="无归属门店或无导购跟进" placement="top" v-else>
            <span style="color: #ccc">移交导购</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <bind-info-dialog
      :visible.sync="showBindDialog"
      :store-id="storeId"
      :client-ids="String(userId)"
      event-id="crm_corp_hand_over_client"
      title="移交导购"
      @successBind="update"
    />
  </div>
</template>
<script>
  import BindInfoDialog from '../../store/components/bind-info-dialog.vue';
  import { mapState } from 'vuex';
  import stringUtil from '@/dss-common/utils/string.js';
  export default {
    name: 'Ascription',
    components: {
      BindInfoDialog,
    },
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
      userId: {
        type: Number,
        default: -1,
      },
    },
    data() {
      return {
        loading: false,
        showBindDialog: false,
        storeId: -1,
        clientId: '',
        activeIndex: '',
      };
    },
    computed: {
      formattedList() {
        return this.list.map(item => {
          if (item.corpTagIdName) {
            const totalTags = [];
            const cutTags = [];
            let currentLength = 0;
            for (const key in item.corpTagIdName) {
              const tagValue = item.corpTagIdName[key];
              totalTags.push(tagValue);
              currentLength += stringUtil.countCharLen(tagValue);
              if (currentLength <= 30) {
                cutTags.push(tagValue);
              }
            }
            item.totalTags = totalTags;
            item.cutTags = cutTags;
          }
          return item;
        });
      },
    },
    methods: {
      changeGuide(item, index) {
        this.activeIndex = index;
        this.storeId = item.storeId;
        this.showBindDialog = true;
      },
      update(employee) {
        // TODO:不能直接改变prop的值
        // this.list.unshift(this.list.splice(this.activeIndex, 1)[0]);
        // this.list[0].employeeName = employee.name;
      },
    },
  };
</script>

<style lang="less" scoped>
  .ascription {
    margin: 0 0 20px;
    /deep/.el-table__header {
      .cell {
        font-size: 15px !important;
      }
    }
    /deep/.el-table__body {
      .cell {
        font-size: 13px !important;
        padding: 9px 15px 9px;
      }
    }
    .tag {
      display: inline-block;
      color: #3879fb;
      background: rgba(56, 121, 251, 0.06);
      padding: 5px 16px;
      margin: 0 10px 0 0;
      border-radius: 2px;
      position: relative;
      font-size: 13px;
    }
  }
  .tag-light {
    color: #fff;
    padding-right: 15px;
  }
</style>

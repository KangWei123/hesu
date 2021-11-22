<template>
  <div class="wd-image-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="导购名片"></edit-header>

    <div class="com-body">
      <div class="rules-title">名片导购显示规则:</div>
      <ol class="rules-container">
        <li>门店无导购时不显示导购名片；</li>
        <li>客户在门店有归属导购时，优先展示归属导购的名片；</li>
        <li>客户在门店无归属导购时，随机展示门店导购的名片。</li>
      </ol>
      <!-- <div class="com-row">
        <span class="com-column">选择导购：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.shopGuide" @change="valueChange">
            <el-radio :label="1">
              所有导购
              <el-tooltip
                class="item"
                effect="dark"
                content="导购：拥有“导购权限”的员工，需在企微通讯录中置为导购"
                placement="top-start"
              >
                <i class="question">?</i>
              </el-tooltip>
            </el-radio>
            <br />
            <el-radio :label="2" style="margin-top: 8px">
              指定导购
              <el-tooltip class="item" effect="dark" content="若未指定导购，默认为所有导购" placement="top-start">
                <i class="question">?</i>
              </el-tooltip>
              <el-button @click="keepOnAdd" v-if="dataSource.shopGuide === 2">继续添加</el-button>
            </el-radio>
          </el-radio-group>
          <div
            v-if="chooseShopGuideList && chooseShopGuideList.length"
            style="width: 100%;border: 1px solid gray;margin-top: 5px"
          >
            <el-tag
              v-for="tag in chooseShopGuideList"
              :key="tag.id"
              effect="light"
              :hit="true"
              @close="handleClose(tag)"
              closable
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </span>
      </div>
      <div class="com-row">
        <span class="com-column">名片样式：</span>
        <span class="com-column">
           <el-radio-group v-model="dataSource.cardStyle" >
            <el-radio :label="3">名片</el-radio>
            <el-radio :label="6" >悬浮框
            <el-tooltip class="item" effect="dark" content="悬浮框会固定在右下角" placement="top-start">
                <i class="question">?</i>
            </el-tooltip>
            </el-radio>
           </el-radio-group>
        </span>
      </div>
      <div class="com-row">
        <span class="com-column">
          显示规则
          <el-tooltip
            class="item"
            effect="dark"
            content="导购名片仅在员工所属门店内显示，若某门店没有选择导购，则不显示导购名片"
            placement="top-start"
          >
            <i class="question">?</i>
          </el-tooltip>
          :
        </span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showRules">
            <el-radio :label="1">
              随机分发
              <el-tooltip
                class="item"
                effect="dark"
                content="不区分客户绑定关系，随机展示任一导购的名片信息"
                placement="top-start"
              >
                <i class="question">?</i>
              </el-tooltip>
            </el-radio>
            <br />
            <el-radio :label="2" style="margin-top: 8px">
              客户关系优先
              <el-tooltip
                class="item"
                effect="dark"
                content="对有导购跟进的客户，优先展示对应的导购名片。若选择此项，建议选择所有导购"
                placement="top-start"
              >
                <i class="question">?</i>
              </el-tooltip>
            </el-radio>
          </el-radio-group>
        </span>
      </div> -->
    </div>
    <ChooseGuide ref="chooseGuide" @shopGuideList="shopGuideList"></ChooseGuide>
  </div>
</template>

<script>
import './css/common.less';
import { mapState } from 'vuex';
import ChooseGuide from '../../../../components/chooseGuide';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import EditHeader from './edit-header.vue';

const unionKeys = ['id'];
export default {
  name: 'shopCardModuleEdit',
  mixins: [tableCheckedHelperMixin],
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  watch: {
    'dataSource.shopGuideList': {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.chooseShopGuideList = newVal;
      }
    }
  },
  components: {
    ChooseGuide,
    EditHeader
  },
  data() {
    return {
      dialogVisible: false,
      chooseShopGuideList: [],
      staffTable: ''
    };
  },
  computed: {
    ...mapState({
      customPages: 'customPages',
      linkedPages: 'linkedPages',
      storeList: 'storeList'
    })
  },
  methods: {
    shopGuideList(val) {
      this.chooseShopGuideList = val;
      this.dataSource.shopGuideList = val;
      /*this.staffTable = staffTable;*/
    },
    handleClose(tag) {
      this.chooseShopGuideList.forEach((item, index) => {
        if (item.id === tag.id) {
          this.chooseShopGuideList.splice(index, 1);
        }
      });
    },
    valueChange(val) {
      if (val === 2) {
        this.$refs.chooseGuide.open(this.chooseShopGuideList);
      } else {
        this.chooseShopGuideList = [];
        this.dataSource.shopGuideList = [];
      }
    },
    keepOnAdd() {
      this.$refs.chooseGuide.open(this.chooseShopGuideList);
    }
  }
};
</script>
<style lang='less' scoped>
.rules-title {
  font-size: 12px;
  line-height: 40px;
  color: #909399;
}
.rules-container {
  width: 300px;
  font-size: 12px;
  color: #909399;
  list-style-type: decimal;
  padding-left: 12px;
  li{
    line-height: 21px;
  }
}
</style>

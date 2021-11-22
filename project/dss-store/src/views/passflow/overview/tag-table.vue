<template>
  <div class="compare-table tag-table">
    <el-table :data="data" stripe style="width: 100%">
      <el-table-column width="120" label="序号" type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="sex" label="性别" width="180"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="profession" label="职业"></el-table-column>
      <el-table-column prop="rate" label="消费水平"></el-table-column>
      <el-table-column label="详情" width="180">
        <template slot-scope="scope">
          <el-popover placement="left" width="300" trigger="hover">
            <div class="tag-table-detail">
              <div class="detail-content">
                <div class="detail-content-item">
                  <div class="detail-content-item-th">性别</div>
                  <div>{{ scope.row.sex }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">年龄</div>
                  <div>{{ scope.row.age }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">职业</div>
                  <div>{{ scope.row.profession }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">婚姻</div>
                  <div>{{ scope.row.marriage }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">学历</div>
                  <div>{{ scope.row.education }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">消费水平</div>
                  <div>{{ scope.row.rate }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">兴趣偏好</div>
                  <div>{{ scope.row.interest }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">阅读偏好</div>
                  <div>{{ scope.row.read }}</div>
                </div>
                <div class="detail-content-item">
                  <div class="detail-content-item-th">消费偏好</div>
                  <div>{{ scope.row.consume }}</div>
                </div>
              </div>
            </div>
            <div class="detail-button" slot="reference" style="color: #409eff;">详情</div>
          </el-popover>
        </template>
      </el-table-column>
      <!--修改无数据时的展示-->
      <template slot="empty">
        <place-holder></place-holder>
      </template>

    </el-table>
  </div>
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index';

  export default {
    components: {
      PlaceHolder
    },
    props: {
      data: null
    },
    data () {
      return {
        showPopover: false
      }
    },
    methods: {
      togglePopover () {
        this.showPopover = !this.showPopover;
      },
      slimScroll () {
        $(this.$el).find('tag-table-body').slimScroll({
          size: '5px',
          height: "420px",
        }).trigger('mouseleave');
      },
      indexMethod(index) {
        return this.data.length - index;
      }
    }
  };
</script>

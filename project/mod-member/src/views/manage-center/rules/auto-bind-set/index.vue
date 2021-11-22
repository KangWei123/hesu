<template>
  <div class="auto-bind-set">
    <div class="auto-bind-container" v-loading="isLoading">
      <div class="auto-header">
        <el-select
          style="width: 158px; margin-left: 5px"
          placeholder="全部来源"
          size="mini"
          @change="onFilter"
          default-first-option
          v-model="keyword.clientSource"
          clearable
        >
          <el-option
            v-for="(item, index) in channelsList"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button class="add-button" type="primary" @click="onAdd" v-if="hasPermission">新建</el-button>
      </div>
      <div class="cue-list-content">
        <el-table :data="memberList" stripe class="wkt-table" ref="memberTable">
          <el-table-column
            label="任务名称"
            prop="taskName"
            label-class-name="member-cell"
            width="200"
            style="margin-left: 30px"
          ></el-table-column>
          <el-table-column label="来源渠道">
            <template slot-scope="scope">
              <span>{{ scope.row.clientSource | source }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="distributeCount" label="分配线索数量" />
          <el-table-column prop="createTime" :formatter="formatTime" label="创建时间" min-width="100" />
          <el-table-column prop="updateTime" :formatter="formatTime" label="更新时间" min-width="100" />
          <el-table-column label="状态" min-width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isActive"
                @change="changeStatus(scope.row)"
                active-color="#409EFF"
                inactive-color="#E0E0E0"
                active-text="开启"
                inactive-text="关闭"
                v-if="hasPermission"
              />
              <div v-else>{{ scope.row.isActive ? '开启' : '关闭' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150" v-if="hasPermission">
            <template slot-scope="scope">
              <a href="javascript:;" @click="onEdit(scope.row)">编辑</a>
              <a href="javascript:;" @click="onDelete(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next, jumper, sizes, total"
          :total="totalMemberCount"
          :page-size="pageParams.pageSize"
          :current-page="pageParams.pageNo"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          class="wkt-pagination"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<style lang="less" src="./index.less" scoped></style>
<script src="./index.js"></script>

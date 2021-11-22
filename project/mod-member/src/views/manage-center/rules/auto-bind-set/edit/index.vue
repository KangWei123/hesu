<template>
  <div class="auto-bind-set">
    <div class="auto-bind-container"></div>
    <el-form
      class="form"
      label-width="120px"
      @submit.native.prevent
      ref="form"
      :model="{
        taskName,
        clientSource,
        hour: form.hour,
        minute: form.minute,
        day: form.day,
      }"
      :rules="rules"
      label-position="right"
      v-loading="loading"
    >
      <el-form-item label="线索任务名称:" prop="taskName">
        <el-input class="form-input" v-model="taskName" placeholder="最多支持32个字符" />
        <!--<span>{{taskName?taskName.trim().length:0}}/32</span>-->
      </el-form-item>
      <el-form-item label="线索来源:" prop="clientSource" style="margin-bottom: 32px">
        <el-select size="mini" class="form-select" v-model="clientSource" placeholder="线索来源">
          <el-option v-for="(item, index) in channelsList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <div style="font-size: 16px; margin: 22px 0">辅助自动分配规则</div>
      <div class="sub-hint" v-if="distributeRuleList.length">（可拖拽调整顺序）</div>
      <draggable
        :list="distributeRuleList"
        v-if="distributeRuleList.length"
        class="list-drag"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
      >
        <transition-group>
          <el-form-item
            :label="'分支' + (index + 1) + ':'"
            v-for="(distributeRule, index) in distributeRuleList"
            :key="index"
            class="priority"
          >
            <div class="bind-rules">
              <div class="bind-item">
                <p class="bind-p">
                  筛选条件:
                  {{ distributeRule.conditionRuleList.map(conditionRule => conditionRule.text).join(' 且 ') }}
                </p>
              </div>
              <div class="bind-method">
                <a class="bind-btn" @click="edit(distributeRule)">编辑</a>
                <a class="bind-btn" @click="distributeRuleList.splice(index, 1)">删除</a>
              </div>
            </div>
          </el-form-item>
        </transition-group>
      </draggable>
      <el-form-item label="其它:" class="priority">
        <div class="bind-rules">
          <div class="bind-item">
            <p class="bind-p">其余线索，随机分配</p>
          </div>
          <div class="bind-method">
            <a href="javascript:;" @click="dialogVisible = true">选择分配导购</a>
          </div>
        </div>
      </el-form-item>
      <el-form-item style="margin: 0">
        <div class="add-rule" @click="edit()" v-if="distributeRuleList.length < 5">+添加分配规则</div>
      </el-form-item>
      <el-form-item style="margin: 0">
        <div style="color: #999; font-size: 12px">最多只能添加5条分支,按分支顺序分配线索；拖动可调整优先级顺序。</div>
      </el-form-item>
      <el-form-item class="recycle-rulers" label="收回规则设置:">
        <div>
          <el-radio v-model="isAutoRecovery" :label="false">不收回，分配即与员工绑定客户关系</el-radio>
        </div>
        <div>
          <el-radio v-model="isAutoRecovery" :label="true">逾期收回</el-radio>
          <template v-if="isAutoRecovery">
            <el-form-item prop="hour" style="display: inline-block">
              <el-input class="mini-input" v-model.number="form.hour" type="number"></el-input>小时
            </el-form-item>
            <el-form-item prop="minute" style="display: inline-block">
              <el-input class="mini-input" v-model.number="form.minute" type="number"></el-input
              >分钟未认领，系统将收回线索重新分发
            </el-form-item>
          </template>
        </div>
      </el-form-item>
      <el-form-item label="重复分配设置:" class="recycle-rulers" v-if="isAutoRecovery">
        <div>
          <el-radio v-model="isRepeatReceive" :label="true">回收线索可重复分配给同一人</el-radio>
        </div>
        <div>
          <el-radio v-model="isRepeatReceive" :label="false">回收线索不再分配给同一人</el-radio>
        </div>
        <p class="revoke-rule" v-if="!isRepeatReceive">
          <el-form-item prop="day">
            <el-input class="mini-input" v-model.number="form.day" type="number" autocomplete="off"></el-input>天
            内不能连续领取同一个线索
          </el-form-item>
        </p>
      </el-form-item>
      <el-form-item class="fix-button-dislocation">
        <el-button type="primary" @click="submit" style="background-color: rgba(56, 121, 251, 1)">保存</el-button>
        <el-button @click="$router.back()" style="background-color: rgba(56, 121, 251, 0.06)">取消</el-button>
      </el-form-item>
    </el-form>
    <!--弹窗-->
    <rule-set-dialog
      :employees="employees"
      @employees="setEmployeeOptions"
      :show-rule-dialog="dialog.show"
      :editing-distribute-rule="editingDistributeRule"
      @setRule="close"
      @close="close"
    />
    <el-dialog title="选择分配导购" :visible.sync="dialogVisible" width="30%">
      <label>选择导购:</label>
      <el-select
        size="mini"
        default-first-option
        multiple
        value-key="id"
        @visible-change="setEmployeeOptions"
        v-model="employeeIds"
        placeholder="请选择"
        clearable
        :no-data-text="employees ? undefined : '加载中...'"
      >
        <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item.id + ''" />
      </el-select>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" src="./index.less" />
<script src="./index.js"></script>

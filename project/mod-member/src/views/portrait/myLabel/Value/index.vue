<template>
  <li>
    <h6>
      <el-input v-model="value" placeholder="请输入名称" />
      <i class="remove" @click="$emit('remove')" v-if="!$route.query.id"></i>
    </h6>
    <div>
      <var @click="!$route.query.id && (relation = ++relation % 2)">{{ ['或', '且'][relation] }}</var>
      <section v-for="(rule, j) in rules" :key="rule.type">
        <header>
          <div>{{ ['客户属性', '用户行为'][j] }}</div>
          <aside @click="[addProfileRule, addEventRule][j](rule.rules)" v-if="!$route.query.id"></aside>
        </header>
        <div>
          <var :content="['或', '且'][rule.relation]" @click="changeRelation(rule)" v-if="rule.rules.length > 1"></var>
          <ol>
            <component
              :is="['profile_rule', 'event_rule'][j]"
              v-for="(item, k) in rule.rules"
              :key="item.key"
              :item="item"
              @remove="rule.rules.splice(k, 1)"
            ></component>
          </ol>
        </div>
      </section>
    </div>
  </li>
</template>
<script src="./index.js"></script>
<style scoped lang="less" src="./index.less" />

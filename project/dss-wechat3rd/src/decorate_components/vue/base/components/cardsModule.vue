<template>
  <div class="cards" :style="mystyle">
    <div
      v-for="(item, index) of dataSource.list"
      :key="index"
      :id="'tab_' + uid + '_' + index"
      class="card"
      :style="{ marginRight: dataSource.style.gap + 'px', borderRadius: dataSource.style.radius + 'px' }"
    >
      <div
        class="card__main"
        :style="{
          backgroundImage: dataSource.mode === 'cover' ? `url(${item.logo})` : undefined,
          width: dataSource.cardWidth / 2 + 'px',
          height: dataSource.cardHeight / 2 + 'px',
        }"
      >
        <div v-if="dataSource.mode !== 'cover'" class="card__nav">
          {{ item.name }}
          <div class="card__arrow">
            <i class="el-icon-arrow-right" />
          </div>
        </div>
      </div>
      <div v-if="dataSource.showModule && item.list.length > 0" class="card__items">
        <div
          v-for="(subItem, subIndex) of item.list"
          :class="[
            'card__item',
            { single: item.list.length === 1, nameAlignLeft: dataSource.moduleNameAlign === 'left' },
          ]"
          :key="subIndex"
        >
          <div class="card__item-logo" :style="{ 'background-image': `url(${subItem.logo || ''})` }" />
          <div class="card__item-name">{{ subItem.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  let uid = 0;
  export default {
    name: 'CardsModule',
    props: {
      dataSource: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        uid: uid++,
      };
    },
    computed: {
      mystyle() {
        const style = this.dataSource.style || {};
        const wrapPx = u => (u != null ? u + 'px' : undefined);

        return {
          marginTop: wrapPx(style.marginUp),
          marginBottom: wrapPx(style.marginDown),
          marginLeft: wrapPx(style.marginLeftRight),
          marginRight: wrapPx(style.marginLeftRight),
        };
      },
    },
    watch: {
      'dataSource.active'(index) {
        const el = document.getElementById('tab_' + this.uid + '_' + index);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .cards {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding: 5px;
  }

  .card {
    display: inline-block;
    background: white;
    vertical-align: middle;
    box-shadow: 0 4px 7px 1px rgb(0 0 0 / 10%);
    overflow: hidden;
  }

  .card__main {
    height: 86px;
    background-size: cover;
    font-size: 17px;
    color: #ff8341;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
  }

  .card__arrow {
    display: inline-block;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    background: #ff8341;
    color: white;
    font-size: 11px;
    border-radius: 16px;
    line-height: 16px;
    text-align: center;
    vertical-align: middle;
  }

  .card__item-logo {
    width: 20px;
    height: 20px;
    margin-bottom: 4px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .card__item-name {
    font-size: 12px;
  }

  .card__items {
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .card__item {
    display: flex;
    flex-direction: column;
    align-items: center;

    &.single {
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
      padding: 16px;

      .card__item-name {
        font-size: 16px;
      }
    }

    &.single.nameAlignLeft {
      flex-direction: row-reverse;
    }
  }
</style>

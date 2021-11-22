<template>
   <div class="preview-page">
       <div class="preview-item">
         <h2 class="preview-title">{{title}}</h2>
         <p class="time">{{updateTime|fitTime}}</p>
       </div>
       <div class="preview-item">
         <div class="preview-content" v-html="content"></div>
       </div>
   </div>
</template>
<style lang="less">
  .el-dialog{
    width: 750px;
  }
  .preview-page{
    background: #ffffff;
    color: #333333;
    min-height: 900px;
    width: 375px;
    border: 1px solid #cdcdcd;
    border-radius: 9px;
    margin: 30px auto;
    padding: 30px;
   .preview-title{
    font-size: 20px;
    font-weight:600;
    color:#000000;
    overflow-wrap: break-word;
   }
    .time{
      margin: 15px 0;
      color:#333333;
      font-size: 14px;
    }
    img{
      width: 100%;
      margin: 10px 0;
    }
   .preview-content{
    font-size: 14px;
    color: #333333;
     word-wrap: break-word;
  }
  }


</style>
<script>
  import utils from '@/dss-common/utils/index';
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      updateTime: {
        type: Number,
        default: 1565234152178
      }
    },
    data() {
      return {
        form: {
          title: '',
          content: ''
        }
      };
    },
    filters: {
      fitTime(value) {
        return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
      }
    },
    methods: {}
};
</script>

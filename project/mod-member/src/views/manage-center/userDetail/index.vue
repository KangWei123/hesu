<template>
  <div class="cue-detail">
    <div class="breadcrumb-wrap">
      <el-breadcrumb class="wkt-breadcrumb-container">
        <el-breadcrumb-item>
          <span @click="toListPage" style="font-weight: 700; color: #333; cursor: pointer">{{ parentPageTitle }}</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="btn-wrap">
        <el-button class="back-button" size="mini" type="primary" round @click="toListPage">返回</el-button>
      </div>
    </div>

    <div class="detail-content" v-loading="baseLoading">
      <!-- 左侧客户基本信息，各渠道信息 -->
      <div class="channel-detail">
        <div class="channel-detail-box overview-info">
          <img v-if="userInfo.faceImg" class="avatar" :src="'data:image/jpeg;base64,' + userInfo.faceImg" />
          <img v-else-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" />
          <img v-else class="avatar" :src="avatar" />
          <img src="../../../images/manage/male.png" class="gender-logo" v-if="userInfo.gender == 1" />
          <img src="../../../images/manage/female.png" class="gender-logo" v-else-if="userInfo.gender == 2" />
          <div class="user-name">
            <div style="color: #333">{{ userInfo.wxNickname || userInfo.realName || userInfo.nickName || '无' }}</div>
            <div class="user-id">客户ID: {{ userInfo.id }}</div>
          </div>
          <p style="display: flex">
            <span style="flex-basis: 65px">客户来源：</span>
            <span style="flex: 1">{{ userInfo.sourceList | source }}</span>
          </p>
          <p>
            <span>推广人：</span>
            <span>{{ userInfo.promoter || '无' }}</span>
          </p>
          <p>
            <span>小区名称：</span>
            <span>{{ userInfo.estateNameList || '无' }}</span>
          </p>
        </div>
        <!-- 标签 -->
        <div class="channel-detail-box tag-info">
          <div class="box-header">
            <span class="box-header-title">商家标签</span>
            <a
              class="box-header-option"
              href="javascript:;"
              @click="impressionTagVisible = true"
              v-if="userInfo.memberId"
              >添加商家印象</a
            >
          </div>
          <div>
            <span class="tag" v-for="(tag, index) in labels" :key="index"
              >{{ tag.value }}
              <i @click="deleteTag(tag)" v-if="tag.id" class="el-icon-error tag-delete-icon"></i>
            </span>
            <div class="empty-tag" v-if="!labels || !labels.length">暂无标签</div>
          </div>
          <div class="box-header">
            <span class="box-header-title" style="margin-top: 20px; display: block">条件标签</span>
          </div>
          <div>
            <span class="tag online-tag" v-for="tag in conditionTagList" :key="tag">{{ tag }}</span>
            <div class="empty-tag" v-if="!conditionTagList || !conditionTagList.length">暂无标签</div>
          </div>
        </div>
        <!-- 各渠道信息 -->
        <channel-info v-for="(item, index) in channelList" :key="index" :channel-info="item">
          <a class="box-header-option" href="javascript:;" @click="editBaseInfo" v-if="item.key === 'base'">编辑</a>
          <a class="box-header-option" href="javascript:;" @click="toBaseInfo" v-if="item.key === 'vip' && memberId"
            >去看看</a
          >
        </channel-info>
      </div>

      <!-- 右侧归属信息，记录信息 -->
      <div class="record-detail">
        <!-- 归属信息 -->
        <ascription-table
          :list="clientEmployeeBinds"
          :user-id="userId"
          v-if="parentPagePath !== '/manage/invalid-cue/list'"
        />
        <!-- 客流信息 -->
        <div class="pass-flow">
          <div class="title">客流信息</div>
          <div class="row">
            <span>
              <span class="label">到店次数：</span>
              {{ passflowInfo.enterTimes || '--' }}次
            </span>
            <i class="split"></i>
            <span>
              <span class="label">是否在白名单：</span>
              {{ passflowInfo.employee ? '是' : '否' }}
            </span>
            <i class="split"></i>
            <span v-if="passflowInfo.lastEnterTime">
              <span class="label">到店时间（最近）：</span>
              {{ passflowInfo.lastEnterTime | time('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span v-else> <span class="label">到店时间（最近）：</span>-- </span>
            <i class="split"></i>
            <span>
              <span class="label">归属地：</span>
              {{ passflowInfo.location || '--' }}
            </span>
          </div>
        </div>
        <!-- 公众号信息 -->
        <div class="pass-flow">
          <div class="title">公众号信息</div>
          <div class="row">
            <span>
              <span class="label">关注公众号：</span
              >{{ userInfo.userSubscribeDTO && +userInfo.userSubscribeDTO.status ? '是' : '否' }}</span
            >
            <i class="split"></i>
            <span v-if="userInfo.userSubscribeDTO && userInfo.userSubscribeDTO.lastSubTime">
              <span class="label">关注时间：</span>{{ (userInfo.userSubscribeDTO.lastSubTime * 1000) | format }}
            </span>
            <span v-else> <span class="label">关注时间：</span>-- </span>
            <i class="split"></i>
            <span>
              <span class="label">对话时间（最近）：</span
              >{{ (userInfo.userSubscribeDTO && userInfo.userSubscribeDTO.messageTime) || '--' }}
            </span>
            <i class="split"></i>
            <span>
              <span class="label">粉丝来源：</span
              >{{
                userInfo.userSubscribeDTO && userInfo.userSubscribeDTO.subscribeScene
                  ? fansSourceConfig[userInfo.userSubscribeDTO.subscribeScene]
                  : '--'
              }}
            </span>
            <i class="split"></i>
          </div>
        </div>
        <!-- 客户意向 -->
        <client-intention :id="userId" v-if="isTelesales"></client-intention>
        <!-- 持有统计 -->
        <div class="consume-titlee">
          <div class="column consume">
            <span class="important">
              <span class="unit">￥</span>
              {{ userInfo.accountInfo ? userInfo.accountInfo.consumeAmount : 0 | price }}
            </span>
            <span>累计消费</span>
          </div>

          <div class="column balance item-click">
            <span class="important">
              <span class="unit">￥</span>
              {{ userInfo.accountInfo ? userInfo.accountInfo.balance : 0 | price }}
            </span>
            <span>会员余额</span>
          </div>

          <div class="column split"></div>

          <div class="column card-count">
            <span>本金：￥{{ userInfo.accountInfo ? userInfo.accountInfo.sourceBalance : 0 | price }}</span>
            <span>赠额：￥{{ userInfo.accountInfo ? userInfo.accountInfo.giftBalance : 0 | price }}</span>
          </div>

          <div class="column card-count item-click">
            <span class="score">{{ userInfo.accountInfo ? userInfo.accountInfo.usableScore : 0 }}</span>
            <span>可用积分</span>
          </div>

          <div class="column card-count item-click" v-if="!hideServer">
            <span class="score">{{ userInfo.accountInfo ? userInfo.accountInfo.cardCount : 0 }}</span>
            <span>持有卡项</span>
          </div>

          <div class="column card-count item-click">
            <span class="score">{{ userInfo.accountInfo ? userInfo.accountInfo.couponCount : 0 }}</span>
            <span>持有优惠券</span>
          </div>

          <div class="column card-count item-click">
            <span class="score">{{ userInfo.accountInfo ? userInfo.accountInfo.giftCardCount : 0 }}</span>
            <span>持有礼品卡</span>
          </div>
        </div>
        <!-- 记录列表 -->
        <div class="appoint-title">
          <el-tabs v-model="detailTab">
            <el-tab-pane label="跟进记录" name="followUpTab">
              <follow-up-list :id="userId"></follow-up-list>
            </el-tab-pane>
            <el-tab-pane label="消费记录" name="orderTab">
              <div v-loading="orderListLoading">
                <!--  TODO:订单模块迁移 -->
                <!-- <order-list :order-list="orderList" @refresh="handleRefresh"></order-list> -->
                <el-pagination
                  v-if="totalOrderCount"
                  layout="prev, pager, next, jumper, sizes, total"
                  :total="totalOrderCount"
                  :page-size="pageParams.pageSize"
                  :current-page="pageParams.pageNo"
                  :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                  @size-change="onSizeChange"
                  @current-change="onPageChange"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="到店记录" name="storeTab">
              <record-list :id="customerId"></record-list>
            </el-tab-pane>
            <el-tab-pane label="浏览记录" name="browseTab">
              <browse-list :user-id="parseInt(memberId)"></browse-list>
            </el-tab-pane>
            <el-tab-pane label="电销记录" name="teleMarketTab">
              <tele-market-list :id="this.userId"></tele-market-list>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <base-info-editor v-model="baseInfoEditorVisible" :init-data="baseInfo" @success="updateBaseInfo" />
    <merchant-tag
      @addSucceed="addImpressionlabelsuccess"
      :user-id="userId"
      :member-id="memberId"
      :impression-tags="labels"
      :visible.sync="impressionTagVisible"
    />
  </div>
</template>

<script>
  import datetime from '@/dss-common/utils/date.js';
  import services from '@/dss-common/utils/services';
  import avatar from '@/dss-common/img/default-avatar.png';

  import memberApi from '@/mod-member/src/api/memberAPI.js';
  import api from '@/mod-member/src/api/manage';
  import fansSourceConfig from '@/mod-member/src/enum/fansSource.js';
  import featureIf from '@/mod-member/src/enum/featureIf';
  // import OrderList from '../../vip/members/order/order-list/order-list-table.vue';
  import RecordList from '@/mod-member/src/views/member-center/analysis/recordList.vue';
  import BrowseList from '@/mod-member/src/views/member-center/analysis/BrowseList.vue';
  import CueEditorDialog from '../components/cueEditorDialog/index.vue';

  import TeleMarketList from './components/tele-market-list.vue';
  import FollowUpList from './components/follow-up-list.vue';
  import MerchantTag from './components/merchant-tag.vue';
  import ChannelInfo from './components/channel-info.vue';
  import AscriptionTable from './components/ascription-table.vue';
  import BaseInfoEditor from './components/base-info-editor.vue';
  import ClientIntention from './components/client-intention.vue';

  import './index.less';
  import { mapState } from 'vuex';

  /**
   * 获取用户详情（客户/线索）接口返回：左侧基本信息及各渠道信息，归属信息，公众号信息，持有统计
   * 获取客流信息：用户详情 memberDTO.customerId -> 调接口查询
   * 获取消费记录：路由传参 memberId -> 调接口查询
   */
  export default {
    name: 'UserDetail',
    components: {
      AscriptionTable,
      FollowUpList,
      // OrderList,
      RecordList,
      BrowseList,
      TeleMarketList,
      CueEditorDialog,
      MerchantTag,
      ChannelInfo,
      BaseInfoEditor,
      ClientIntention,
    },
    data() {
      return {
        avatar,
        detailTab: 'followUpTab',
        userId: +this.$route.query.id, // 用户id
        memberId: +this.$route.query.memberId, // 会员id
        customerId: null, // 客流id
        parentPageTitle: this.$route.meta.parentPageTitle,
        parentPagePath: this.$route.meta.parentPagePath,
        currentPageTitle: this.$route.meta.title,

        userInfo: {}, // 用户详情总内容
        labels: [], // 商家标签
        conditionTagList: [], // 条件标签
        channelList: [], // 各渠道信息
        baseInfo: null, // 客户基本信息，用于编辑时初始化数据
        clientEmployeeBinds: [], // 归属信息
        passflowInfo: {}, // 客流信息
        orderList: [], // 消费记录
        totalOrderCount: 0, // 消费记录列表相关
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
        baseLoading: false,
        orderListLoading: false,

        impressionTagVisible: false, // 弹窗"添加商家印象"的显隐
        baseInfoEditorVisible: false,
        editUserIng: false, // 弹窗"用户信息“的显隐
        fansSourceConfig, // 粉丝来源项
        isUpdate: false, // 是否更新过基本信息
      };
    },
    computed: {
      hideServer() {
        return featureIf.can(featureIf.keys.MEMBER_DETAIL_HIDE_SERVER);
      },
      ...mapState({
        clientSourceList: state => state.dmp.clientSourceList,
        isTelesales: state => state.dmp.isTelesales,
      }),
    },
    mounted: function () {
      // 一进入详情页需要拉取订单列表
      if (this.memberId) {
        this.listOrders();
      }
      this.getDetailOnline();
    },
    beforeRouteLeave(to, from, next) {
      to.query.pageNo = from.query.pageNo;
      to.query.asign = from.query.pageNo;
      next();
    },
    methods: {
      // 获取用户详情
      getDetailOnline() {
        this.baseLoading = true;
        api
          .getClient({ id: this.userId })
          .then(res => {
            this.userInfo = res.data || {};
            this.userInfo.estateNameList = (this.userInfo.estateNameList || []).join('，');
            const { conditionTagList, labels, clientEmployeeBinds, memberDTO, memberId } = res.data;
            // 渠道数据
            this.getChannelData(this.userInfo);
            // 商家标签
            if (res.data) {
              this.conditionTagList = (conditionTagList || []).map(item => ({ name: item }));
              this.labels = (labels || []).map(item => {
                return {
                  value: item.value,
                  id: item.id,
                  tagId: item.tagId,
                };
              });
            }
            // 归属记录
            this.clientEmployeeBinds = (clientEmployeeBinds || []).map(item => {
              return {
                storeId: item.storeId,
                storeName: item.storeName || '--',
                employeeId: item.employeeId,
                employeeName: item.employeeName || '--',
                stageName: item.stageName || '--',
                corpTagIdName: item.corpTagIdName,
              };
            });
            // 客流id存在，查询客流信息
            if (memberDTO && memberDTO.customerId) {
              this.customerId = memberDTO.customerId || null;
              this.getPassflowInfo(this.customerId);
            }
          })
          .finally(() => {
            this.baseLoading = false;
          });
      },
      // 各渠道信息
      getChannelData(userInfo) {
        const {
          wxNickname,
          realName,
          nickName,
          phone,
          gender,
          birthday,
          levelName,
          wxUnionId,
          faceId,
          faceImgUrl,
          memberDTO,
          userSubscribeDTO,
          extUserInfoDTO,
          clientEmployeeBinds,
          clientTiktokInfoDTO,
          description,
        } = userInfo;
        const genderText = ['无', '男', '女'];
        const clientBaseInfo = {
          title: '客户基本信息',
          key: 'base',
          list: [
            { label: '客户姓名', value: wxNickname || realName || nickName || '无' },
            { label: '手机号', value: phone || '无' },
            { label: '客户性别', value: genderText[gender] },
            { label: '出生日期', value: birthday || '无' },
            { label: '备注', value: description || '无' },
          ],
        };
        const vipInfo = {
          title: '会员信息',
          key: 'vip',
          list: memberDTO
            ? [
                { label: '会员卡号', value: memberDTO.userNum || '无' },
                { label: '会员姓名', value: memberDTO.realName || memberDTO.nickname || '无' },
                { label: '会员等级', value: levelName || '无' },
                { label: '性别', value: genderText[memberDTO.gender] || '无' },
                { label: '手机号', value: memberDTO.phone || '无' },
                { label: '生日日期', value: memberDTO.birthday || '无' },
              ]
            : null,
        };
        const wechatInfo = {
          title: '微信信息',
          key: 'wechat',
          list: userSubscribeDTO
            ? [
                { label: 'unionID', value: userSubscribeDTO.wxUnionId || '无' },
                { label: '微信昵称', value: userSubscribeDTO.nickname || '无' },
                { label: '微信头像', value: userSubscribeDTO.headImgUrl || '', type: 'avatar' },
                { label: '性别', value: genderText[userSubscribeDTO.sex] || '无' },
                { label: '国家', value: userSubscribeDTO.country || '无' },
                { label: '省份', value: userSubscribeDTO.province || '无' },
                { label: '城市', value: userSubscribeDTO.city || '无' },
                { label: '语言', value: userSubscribeDTO.language || '无' },
                { label: '手机号', value: userSubscribeDTO.phone || '无' },
              ]
            : null,
        };
        const weworkInfo = {
          title: '企微信息',
          key: 'wework',
          list: extUserInfoDTO
            ? [
                { label: '客户昵称', value: extUserInfoDTO.name || '无' },
                { label: '微信头像', value: extUserInfoDTO.avatar || '', type: 'avatar' },
                { label: '性别', value: genderText[extUserInfoDTO.gender] || '无' },
                { label: '职位', value: extUserInfoDTO.position || '无' },
                { label: '企业简称', value: extUserInfoDTO.cropName || '无' },
                { label: '备注手机号', value: extUserInfoDTO.phone || '无' },
              ]
            : null,
        };
        const tiktokInfo = {
          title: '抖音信息',
          key: 'tiktok',
          list: clientTiktokInfoDTO
            ? [
                { label: '姓名', value: clientTiktokInfoDTO.realName || clientTiktokInfoDTO.nickName || '无' },
                { label: '手机号', value: clientTiktokInfoDTO.phone || '无' },
                { label: '性别', value: genderText[clientTiktokInfoDTO.gender] || '无' },
                { label: '出生日期', value: clientTiktokInfoDTO.birthday || '无' },
                { label: '省份', value: clientTiktokInfoDTO.province || '无' },
                { label: '城市', value: clientTiktokInfoDTO.city || '无' },
              ]
            : null,
        };
        const faceInfo = {
          title: '人脸信息',
          key: 'face',
          list: faceId
            ? [
                { label: '人脸ID', value: faceId || '无' },
                { label: '人脸图片', value: faceImgUrl || '', type: 'avatar' },
              ]
            : null,
        };

        this.channelList = [clientBaseInfo, vipInfo, wechatInfo, weworkInfo, tiktokInfo, faceInfo];
        this.baseInfo = {
          id: this.userId,
          realName: wxNickname || realName || nickName || '',
          phone,
          gender: gender || '',
          birthday,
          description,
        };
      },
      // 获取客流信息
      getPassflowInfo(customerId) {
        memberApi.getPassflowInfo({ customerId: customerId }).then(res => {
          this.passflowInfo = res.data || {};
        });
      },
      // 获取消费记录
      listOrders: function () {
        this.orderListLoading = true;
        const params = {
          userId: +this.memberId,
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
        };
        if (this.memberId) {
          services
            .get('/wp/order/list', {
              params,
              action: '交易记录',
            })
            .done(res => {
              this.orderList = res.data || [];
              this.totalOrderCount = res.totalCount;
            })
            .always(() => {
              this.orderListLoading = false;
            });
        }
      },

      // 点击跳转列表页
      toListPage() {
        this.$router.push({
          path: this.parentPagePath,
          query: {
            pageNo: this.$route.query.pageNo,
            isUpdate: this.isUpdate,
          },
        });
      },
      // 点击客户基本信息“编辑”
      editBaseInfo() {
        this.baseInfoEditorVisible = true;
      },
      // 关闭用户基本信息编辑弹窗
      updateBaseInfo(data) {
        if (!data) return;
        this.isUpdate = true;
        this.$route.meta.isUpdate = true;
        this.userInfo.realName = data.realName;
        this.userInfo.phone = data.phone;
        this.userInfo.gender = data.gender;
        this.userInfo.birthday = data.birthday;
        this.userInfo.description = data.description;
        this.getChannelData(this.userInfo);
      },
      // 点击会员信息“去看看”
      toBaseInfo() {
        this.$router.push('/vip/members/list/detail?id=' + this.memberId);
      },
      // 添加商家标签成功
      addImpressionlabelsuccess() {
        this.getDetailOnline();
      },
      // 点击删除标签
      deleteTag(tag) {
        this.$confirm('确认删除标签？').then(_ => {
          api
            .deleteLabel({
              clientLabelId: tag.id,
              labelValue: tag.value,
              memberId: this.memberId ? this.memberId : null,
            })
            .done(res => {
              if (res.success) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                });
                const index = this.labels.findIndex(item => item.id === tag.id);
                if (~index) {
                  this.labels.splice(index, 1);
                  console.log('删除后的标签labels-------->', this.labels);
                }
              }
            });
        });
      },
      // 切换“消费记录”表格长度
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.listOrders();
      },
      // 切换“消费记录”表格页码
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.listOrders();
      },
      // 刷新“消费记录”
      handleRefresh() {
        this.listOrders();
      },
      // getDetailOffiline() {
      //   let userInfo = this.$route.query.userInfo
      //   if (userInfo) {
      //     this.userInfo = userInfo
      //     for (let idx in this.userInfo.labels) {
      //       this.labels.push(this.userInfo.labels[idx].value)
      //     }
      //     return true
      //   }
      //   return false
      // },
    },

    filters: {
      format(time) {
        const date = new Date(time);
        return datetime.format(date, 'YYYY-MM-DD HH:mm:ss');
      },
      price(value, scale = 100) {
        return value ? (value / scale).toFixed(2) : '0.00';
      },
      source(value) {
        const total = (value || []).map(item => item.name).join('，');
        return total || '无';
      },
    },
  };
</script>

<style lang="less" scoped>
  .breadcrumb-wrap {
    display: flex;
    justify-content: center;
    .wkt-breadcrumb-container {
      flex: 1;
    }
    .btn-wrap {
      border-bottom: 1px solid #dcdee0;
      padding: 10px 20px 0;
    }
  }
</style>

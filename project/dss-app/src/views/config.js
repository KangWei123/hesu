/**
 * Created by love on 18/8/29.
 * @author trumpli<李志伟>
 */
const Steps = {
  Industry: 'Industry', //选择行业
  Create: 'Create', //创建店铺
  Chose: 'Chose', //选择店铺
  Order: 'Order', //订购店铺
  Pay: 'Pay' //立即支付
};
const Events = {
  IndustryReady: 'IndustryReady',
  CreateReady: 'CreateReady'
};
module.exports = { Steps, Events };

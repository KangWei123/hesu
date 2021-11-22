export default {
  template: [
    {
      module: 'product',
      typeArr: [
        {
          type: 0,
          typeName: '订单发货',
          msg: [
            {
              key: '温馨提示',
              value: '亲，您的订单已发货，请注意查收。'
            },
            {
              key: '订单号码',
              value: '54654646'
            },
            {
              key: '支付时间',
              value: '2018-09-19 16:00'
            },
            {
              key: '支付金额',
              value: '10.00'
            },
            {
              key: '物品名称',
              value: '降噪耳机索尼1000XM2'
            }
          ]
        },
        {
          type: 1,
          typeName: '订单支付 ',
          msg: [
            {
              key: '订单号码',
              value: '54654646'
            },
            {
              key: '支付时间',
              value: '2018-09-19 16:00'
            },
            {
              key: '支付金额',
              value: '10.00'
            },
            {
              key: '物品名称',
              value: '降噪耳机索尼1000XM2'
            }
          ]
        },
        {
          type: 2,
          typeName: '订单退款成功 ',
          msg: [
            {
              key: '退款金额',
              value: '20元'
            },
            {
              key: '订单号码',
              value: '54654646'
            },
            {
              key: '退款原因',
              value: '不想要了'
            },
            {
              key: '备注',
              value: '退款成功，请确认'
            }
          ]
        }
      ]
    },
    {
      module: 'reservation',
      typeArr: [
        {
          type: 3,
          typeName: '预约成功',
          msg: [
            {
              key: '温馨提示',
              value: '亲，您已经成功预约！请按时到店哦，凭手机号码确认预约即可开始享受服务'
            },
            {
              key: '预约项目',
              value: '美容'
            },
            {
              key: '预约时间',
              value: '2018-09-19 周六 16:00'
            },
            {
              key: '门店电话',
              value: '18888888888'
            },
            {
              key: '门店地址',
              value: '香洲唐家'
            }
          ]
        },
        {
          type: 4,
          typeName: '预约退款',
          msg: [
            {
              key: '温馨提示',
              value: '亲，你的预约已取消，并成功退款'
            },
            {
              key: '预约项目',
              value: '美容'
            },
            {
              key: '预约时间',
              value: '2018-09-19 周六 16:00'
            },
            {
              key: '门店电话',
              value: '18888888888'
            },
            {
              key: '门店地址',
              value: '香洲唐家'
            }
          ]
        }
      ]
    },
    {
      module: 'groupBooking',
      typeArr: [
        {
          type: 5,
          typeName: '拼团成功',
          msg: [
            {
              key: '商品名称',
              value: '洗脸'
            },
            {
              key: '订单编号',
              value: '54654646'
            },
            {
              key: '支付时间',
              value: '2018-09-19 16:00'
            },
            {
              key: '支付金额',
              value: '10.00'
            }
          ]
        },
        {
          type: 6,
          typeName: '拼团失败',
          msg: [
            {
              key: '商品名称',
              value: '洗脸'
            },
            {
              key: '失败原因',
              value: '未凑满参团人数'
            },
            {
              key: '备注',
              value: '参团款项已原路退回'
            }
          ]
        }
      ]
    },
    {
      module: 'bargain',
      typeArr: [
        {
          type: 7,
          typeName: '砍价成功',
          msg: [
            {
              key: '砍价状态',
              value: '砍价成功'
            },
            {
              key: '温馨提示',
              value: '请尽快在规定时间完成购买，否则视为放弃。'
            },
            {
              key: '剩余时间',
              value: '0天23:23:23'
            }
          ]
        },
        {
          type: 8,
          typeName: '砍价即将结束',
          msg: [
            {
              key: '当前价格',
              value: '￥18.08'
            },
            {
              key: '温馨提示',
              value: '活动即将结束，请尽快完成砍价并支付'
            },
            {
              key: '剩余时间',
              value: '仅剩1小时'
            }
          ]
        }
      ]
    },
    {
      module: 'redpacket',
      typeArr: [
        {
          typeName: '拆红包成功',
          type: 9,
          msg: [
            {
              key: '瓜分进度',
              value: '成功瓜分50元红包'
            }
          ]
        },
        {
          type: 10,
          typeName: '拆红包即将结束',
          msg: [
            {
              key: '瓜分进度',
              value: '仅剩2人瓜分50元红包'
            },
            {
              key: '剩余时间',
              value: '仅剩1小时'
            }
          ]
        }
      ]
    },
    {
      module: 'recharge',
      typeArr: [
        {
          type: 11,
          typeName: '充值成功',
          msg: [
            {
              key: '充值金额',
              value: '100元'
            },
            {
              key: '赠送金额',
              value: '10元'
            },
            {
              key: '充值时间',
              value: '2018-05-23 14:30:00'
            },
            {
              key: '账户余额',
              value: '110元'
            }
          ]
        },
        {
          type: 12,
          typeName: '余额消费',
          msg: [
            {
              key: '支付成功',
              value: '你使用余额消费了29.00元！'
            },
            {
              key: '变动时间',
              value: '2018-05-08 14:30:00'
            },
            {
              key: '变动金额',
              value: '-29.00元'
            },
            {
              key: '账户余额',
              value: '100.00元'
            }
          ]
        }
      ]
    },
    {
      module: 'giftCard',
      typeArr: [
        {
          type: 13,
          typeName: '礼品卡购买成功',
          msg: [
            {
              key: '订单编号',
              value: '54654646'
            },
            {
              key: '礼品卡金额',
              value: '100元'
            },
            {
              key: '下单时间',
              value: '2018-05-23 14:30:00'
            }
          ]
        },
        {
          type: 14,
          typeName: '礼品卡绑定成功',
          msg: [
            {
              key: '绑定进度',
              value: '礼品卡已绑定到您个人账户中，您可以抵扣现金进行消费。'
            },
            {
              key: '礼品卡金额',
              value: '100元'
            },
            {
              key: '绑定时间',
              value: '2018-05-08 14:30:00'
            }
          ]
        }
      ]
    },
    {
      module: 'taskAwardInform ',
      typeArr: [
        {
          type: 18,
          typeName: '任务奖励通知',
          msg: [
            {
              key: '任务名称',
              value: '邀请3名新用户观看直播'
            },
            {
              key: '任务奖励',
              value: '3元'
            },
            {
              key: '奖励时间',
              value: '2020.03.04 11:23:34'
            }
          ]
        }
      ]
    },
    {
      module: 'preferentialCard',
      typeArr: [
        {
          type: 17,
          typeName: '优惠卷到账通知',
          msg: [
            {
              key: '优惠卷名称',
              value: '100-30券、200-50券...'
            },
            {
              key: '优惠券数量',
              value: '3张'
            },
            {
              key: '到账时间',
              value: '2020.03.04 11:23:34'
            }
          ]
        }
      ]
    },
    {
      module: 'imageTextComment ',
      typeArr: [
        {
          type: 19,
          typeName: '图文评论回复通知',
          msg: [
            {
              key: '图文名称',
              value: '3.8女王节大促'
            },
            {
              key: '商家回复',
              value: '感谢您的参与'
            },
            {
              key: '评论内容',
              value: '我非常想参加本次活动，希望...'
            },
            {
              key: '回复时间',
              value: '2020年2月23日 19:34'
            }
          ]
        }
      ]
    }
  ],

  findMsgByType(type) {
    let msg = null;
    this.template.forEach(item => {
      item.typeArr.forEach(itemTA => {
        if (itemTA.type === type) {
          msg = itemTA.msg;
        }
      });
    });
    return msg;
  }
};

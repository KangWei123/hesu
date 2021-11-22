import textIcon from './assets/text-icon.png';
import textareaIcon from './assets/textarea-icon.png';
import addressIcon from './assets/address-icon.png';
import phoneIcon from './assets/phone-icon.png';
import radioIcon from './assets/radio-icon.png';
import sexIcon from './assets/sex-icon.png';
import emailIcon from './assets/email-icon.png';
import dateIcon from './assets/date-icon.png';
import commentIcon from './assets/comment-icon.png';

const widgetsData = [
  {
    label: '单行输入',
    type: 'text',
    required: false,
    icon: textIcon
  },
  {
    label: '多行输入',
    type: 'textarea',
    required: false,
    icon: textareaIcon
  },
  {
    label: '单选框',
    type: 'radio',
    required: false,
    icon: radioIcon
  },
  {
    label: '日期',
    type: 'date',
    required: false,
    icon: dateIcon
  },
  {
    label: '地址',
    type: 'address',
    required: false,
    icon: addressIcon
  },
  {
    label: '性别',
    type: 'sex',
    required: false,
    icon: sexIcon
  },
  {
    label: '邮箱',
    type: 'email',
    required: false,
    icon: emailIcon
  },
  {
    label: '手机号',
    type: 'phone',
    required: false,
    icon: phoneIcon
  },
  {
    label: '表单说明',
    type: 'comment',
    required: true,
    icon: commentIcon
  }
];

export default widgetsData;

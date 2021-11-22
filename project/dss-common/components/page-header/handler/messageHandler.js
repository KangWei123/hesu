import api from '../../../api/base';

const { getMessage } = api;
const sign = 'message_center_read';

class MessageHandler {
  constructor(scene, userInfo) {
    this.scene = scene;
    this.userInfo = userInfo;
    this.isNew = false;
  }

  async getMessage() {
    try {
      const { data } = await getMessage();
      const isHead = this.scene === 'head';
      const sStorage = this.getStorage(0) || {};
      const lStorage = this.getStorage(1) || {};

      if (data) {
        this.key = Object.values({ ...this.userInfo, ...{ id: data.id } }).join('-');
        this.data = data;

        const hasSession = sStorage[this.key];
        const hasLocal = lStorage[this.key];

        if (isHead) {
          if (hasLocal) {
            this.isNew = false;
          } else {
            this.isNew = true;
          }
        } else {
          this.clear();
          if (hasSession || hasLocal) {
            this.isNew = false;
          } else {
            this.isNew = true;
            sStorage[this.key] = {
              isRead: true
            };
            this.setStorage(0, sStorage);
          }
        }
      }

      return {
        isNew: this.isNew,
        message: data || {}
      };
    } catch (e) {
      return {
        isNew: false,
        message: {}
      };
    }
  }

  setRead() {
    const lStorage = this.getStorage(1) || {};

    lStorage[this.key] = {
      isRead: true,
      createTime: this.data.createTime
    };

    this.setStorage(1, lStorage);
  }

  getStorage(type) {
    const sysStorage = type ? localStorage : sessionStorage;

    return JSON.parse(sysStorage.getItem(sign));
  }

  setStorage(type, obj) {
    const sysStorage = type ? localStorage : sessionStorage;

    sysStorage.setItem(sign, JSON.stringify(obj));
  }

  clear() {
    // 清理过时的存储，避免冗余
    const storage = this.getStorage(1) || {};
    const now = Date.now();
    const someDays = 5 * 24 * 60 * 60 * 1000;

    for (let key in storage) {
      if (now - storage[key].createTime > someDays) {
        delete storage[key];
      }
    }

    this.setStorage(1, storage);
  }
}

export default MessageHandler;

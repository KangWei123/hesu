import Vue from 'vue';

export const EventType = {
  CHANGE_STORE: 'changeStore',
};

class EventBus {
  static instance;
  static get shared() {
    return this.instance || (this.instance = new Vue());
  }
}

export default EventBus.shared;

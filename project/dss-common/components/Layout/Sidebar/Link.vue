<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from './validate.js';

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return 'a';
      }
      return 'router-link';
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: this.isDisabled ? 'javascript:void(0);' : to,
          target: '_blank',
          rel: 'noopener'
        };
      }
      return {
        to: this.isDisabled ? '' : to
      };
    }
  }
};
</script>

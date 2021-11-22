<template>
  <div class="portrait-title">
    <em class="portrait-title-head">{{ headText }}</em>
    <span class="portrait-title-desc">{{ descText }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      headText: {
        type: String,
        require: true,
      },
      descText: String,
    },
  };
</script>

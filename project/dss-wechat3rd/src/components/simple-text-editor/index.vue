<template>
  <div>
    <emotion-editor
      editorHeight="188px"
      :editable="editable"
      :writeHandler="writeHandler"
      :maxLength="MAX_LENGTH"
      :store="store"
      ref="emotionEditor"></emotion-editor>
    <div style="border-top: 1px solid #e4e8eb;">
    <emotion-panel @picked="onPickedEmoji"
                   :height="36"
                   :positionIsUp="positionIsUp" v-if="editable"></emotion-panel>
    </div>
  </div>
</template>

<script>
  import EmotionEditor from '../emotion-textarea/EmotionEditor.vue';
  import EmotionPanel from '../emotion-textarea/EmotionPanel.vue';

  export default {
    props: {
      store: {
        type: Object
      },
      writeHandler: {
        type: Function,
        default: null
      },
      editable: {
        type: Boolean,
        default: true
      },
      positionIsUp: {
        type: Boolean,
        default: true
      },
      MAX_LENGTH: {
        type: Number,
        default: 400
      }
    },
    components: {
      EmotionEditor,
      EmotionPanel
    },
    methods: {
      onPickedEmoji(img) {
        this.$refs.emotionEditor.insertEmoji(img);
      },
      verify() {
        if (!this.store.value) {
          this.$message.error('群发消息内容不能为空！');
        }
      }
    }
  };
</script>

import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      selectedEp: state => state.selectedEp
    }),
    epId() {
      return this.selectedEp.epId;
    }
  }
}

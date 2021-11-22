export default    function install(Vue) {
        Vue.prototype.$plain = Vue.plain = function (data) {
            if (data === null || typeof data === 'undefined') {
                return data;
            }

            try {
                return JSON.parse(JSON.stringify(data));
            } catch (e) {
                throw 'vue-plain: Parse failed, make sure your parameter can be JSON.stringify';
            }
        };
    }

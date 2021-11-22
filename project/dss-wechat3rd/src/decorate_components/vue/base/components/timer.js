let timer = (function() {
  function timer() {}

  /**
   * 新增除定时任务
   * @param callBack 定时队列回调
   * @return timer.id 定时队列的id
   */
  timer.addQueue = function(callBack) {
    timer.id++;
    let obj = {
      id: timer.id,
      cb: callBack
    };
    timer.queues.push(obj);
    !timer.interval && timer.execute();
    return obj.id;
  };

  /**
   * 删除定时任务
   * @param queueId 定时队列id
   */
  timer.deleteQueue = function(queueId) {
    timer.queues.slice().forEach((queue, index) => {
      if (queue.id === queueId) {
        timer.queues.splice(index, 1);
      }
    });
    if (!timer.queues.length) {
      clearInterval(timer.interval);
      timer.interval = null;
    }
  };

  // 开始执行
  timer.execute = function() {
    if (timer.queues.length && !timer.interval) {
      timer.interval = setInterval(_ => {
        timer.queues.forEach(queue => {
          queue.cb && queue.cb(queue.id);
        });
      }, 1000);
    }
  };

  /** 队列 */
  timer.queues = [];
  /** timer自增id */
  timer.id = 0;
  // 定时器
  timer.interval = null;

  return timer;
})();

export default timer;

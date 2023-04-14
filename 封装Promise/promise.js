function Promise (executor) {
  // 同步调用执行器函数  
  this.PromiseState = 'pending';
  this.PromiseResult = null;
  this.callbacks = [];
  const self = this;
  function resolve (data) {
    if (self.PromiseState !== 'pending') return;
    // 修改对象的状态
    self.PromiseState = 'fulfilled';
    // 设置状态的结果值
    self.PromiseResult = data;
    // 调用成功的回调函数  
    self.callbacks.forEach(item => {
      item.onResolved(data)
    })

  }
  function reject (data) {
    if (self.PromiseState !== 'pending') return;
    // 修改对象的状态
    self.PromiseState = 'rejected';
    // 设置状态的结果值
    self.PromiseResult = data;
    self.callbacks.forEach(item => {
      item.onRejected(data)
    })
  }
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e)
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  const self = this;
  return new Promise((resolve, reject) => {
    function callback (type) {
      try {
        let result = type(this.PromiseResult);
        if (result instanceof Pormise) {
          result.then(v => {
            resolve(v);
          }, r => {
            reject(r);
          })
        } else {
          resolve(result);
        }
      } catch (e) {
        reject(e)
      }
    }
    // 调用回调函数
    if (this.PromiseState === 'fulfilled') {
      callback(onResolved)
    }

    if (this.PromiseState === 'rejected') {
      callback(onRejected)
    }
    if (this.PromiseState === 'pending') {
      // 保存回调函数
      this.callbacks.push({
        onResolved: () => {
          callback(onResolved);
        },
        onRejected: () => {
          callback(onRejected);
        }
      })
    }
  })
}


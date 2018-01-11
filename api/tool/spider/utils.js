/**
 * utils func
 */

/**
 * 限制并行任务函数
 * arr promis 函数数组
 * limit 并行数量限制
 */

function pl (concurrency = 1) {

  const queue = []
  let activeCount = 0

  const next = () => {
    activeCount--

    if (queue.length > 0) {
      queue.shift()()
    }
  }

  return fn => new Promise((resolve, reject) => {
    const run = () => {
      activeCount++

      fn().then(
        val => {
          resolve(val)
          next()
        },
        err => {
          reject(err)
          next()
        }
      )
    }

    if (activeCount < concurrency) {
      run()
    } else {
      queue.push(run)
    }
  })
}

module.exports = {
  pl,
}
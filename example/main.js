// ćšć±ćé
const global = {
  logger: {
    log (event, args) {
      console.log('send log', event, args)
    }
  }
}
function submit(object) {
  this.logger.log('submit', object.keys.length)
  console.log('do submit', object.other)
}
submit.call(global, { other: '1' })

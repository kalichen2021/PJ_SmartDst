const _config = {
  a: {
    default: 1,
    callback: () => {
      console.log(1)
    }
  },
  b: {
    default: 1,
    callback: () => {
      console.log(2)
    }
  }
}


const ValueObj = Object.keys(_config).filter(k => _config[k].default)
// const CallbackObj = Array.from()

// console.log(CallbackObj)

console.log([][7])
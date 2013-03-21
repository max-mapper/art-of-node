function takesOneSecond(callback) {
  setTimeout(after, 1000)
  function after() {
    console.log('done with one, on to the next')
    if (callback) callback()
  }
}

a = takesOneSecond, b = takesOneSecond, c = takesOneSecond

a(function() {
  b(function() {
    c()
  })
})
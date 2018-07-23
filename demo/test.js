async function test() {
  throw new Error('error')
}

// async function run() {
//   try {
//     await test()
//   } catch(e) {
//     console.log('run error')
//   }
// }

function run() {
  try {
    test().catch(message => {
      console.log(message)
      throw new Error(message)
    })
  } catch (e) {
    console.log('test Error', e)
  }
}

run()
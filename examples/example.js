var lt = require('../src/index.js')

class myTestSource {
  generateSourceConnections() {
    return new Promise((resolve, reject) => {
      let results = [{ from: { name: 'serviceA', type: 'service' }, to: { name: 'serviceB', type: 'service' } },
      { from: { name: 'serviceE', type: 'service' }, to: { name: 'serviceA', type: 'service' } },
      { from: { name: 'serviceB', type: 'service' }, to: { name: 'queueA', type: 'queue' } },
      { from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceC', type: 'service' } },
      { from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceD', type: 'service' } },
      { from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceE', type: 'service' } }];
      resolve(results);
    });
  }
}

async function generateDiagram() {
  var modeller = new lt.EntModeller.Builder()
    .addSource("elk", new myTestSource(), null)
    .addSource("elk2", new myTestSource(), null)
    .outputAsDOTDefaultServices()
    .build()

  let output = await modeller.generateOutput();
  console.log(output);
}

generateDiagram();

console.log('bye bye');

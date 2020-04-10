var lt = require('../src/index.js')

var results = [{ from: { name: 'serviceA', type: 'service' }, to: { name: 'serviceB', type: 'service' } },
{ from: { name: 'serviceE', type: 'service' }, to: { name: 'serviceA', type: 'service' } },
{ from: { name: 'serviceB', type: 'service' }, to: { name: 'queueA', type: 'queue' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceC', type: 'service' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceD', type: 'service' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceE', type: 'service' } }];

class myTestSource {
  generateSourceConnections() {
    return new Promise((resolve, reject) => {
      resolve(results);
    });
  }
}

async function generateDiagram() {
  var modeller = new lt.EntModeller.Builder()
    .addSource("elk", new myTestSource(), null)
    .addData("elk2", results, null)
    .outputAsDOTDefaultServices()
    .build()

  let output = await modeller.generateOutput();
  console.log(output);
}

generateDiagram();

console.log('bye bye');

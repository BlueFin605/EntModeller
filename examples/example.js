var lt = require('../src/index.js')

var results = [{ from: { name: 'service-type-A', type: 'service' }, to: { name: 'serviceB', type: 'service', style: 'styleA'} },
{ from: { name: 'serviceE', type: 'service' }, to: { name: 'service-type-A', type: 'service' } },
{ from: { name: 'serviceB', type: 'service', style: 'styleA' }, to: { name: 'queueA', type: 'queue' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceC', type: 'service' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceD', type: 'service' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceE', type: 'service' } }];

var styles = {
  styleA: {
    color: 'red',
    fillcolor: 'blue',
    height: 2
  }
};

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
    .outputAsDOTDefaultServices(styles)
    .build()

  let output = await modeller.generateOutput();
  console.log(output);
}

generateDiagram();

console.log('bye bye');

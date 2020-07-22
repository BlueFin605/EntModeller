var lt = require('../src/index.js')

var results = [{ from: { name: 'service-type-A', type: 'service' }, to: { name: 'serviceB', type: 'service', style: 'styleA' } },
{ from: { name: 'serviceE', type: 'service' }, to: { name: 'service-type-A', type: 'service' } },
{ from: { name: 'serviceB', type: 'service', style: 'styleA' }, to: { name: 'queueA', type: 'queue' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceC', type: 'service' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceD', type: 'service' } },
{ from: { name: 'queueA', type: 'queue' }, to: { name: 'serviceE', type: 'service' } },
{ node: { name: 'queueJ', type: 'queue' } }];

var styles = {
  styleA: {
    color: 'red',
    fillcolor: 'blue',
    height: 2
  },
  styleB: {
    color: 'green',
    fillcolor: 'orange',
    height: 3
  },
  styleC: {
    color: 'black',
    fillcolor: 'brown',
    height: 4
  }
};

var overides = [{name: 'queueJ', style: 'styleB'}, {name: 'serviceE', style: 'styleC'}];

var relFilles = [{from: 'serviceE', to: 'queueJ'}, {from: 'queueJ', to: 'serviceA'}];

var entFilles = [{ name: 'queueW', type: 'queue' }];

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
    .addStyleOverides(overides)
    .addRelationshipFills(relFilles)
    .addEntityFills(entFilles)
    .outputAsDOTDefaultServices(styles)
    .build()

  let output = await modeller.generateOutput();
  console.log(output);
}

generateDiagram();

console.log('bye bye');

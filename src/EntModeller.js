var wsd = require('./dotGraphDescriptionLanguage.js')

const EntModeller = (function () {
  const _private = new WeakMap()

  const internal = (key) => {
    // Initialize if not created
    if (!_private.has(key)) {
      _private.set(key, {})
    }
    // Return private properties object
    return _private.get(key)
  }

  class EntModeller {
    constructor(sources, data, formatter, serviceShapes, styles) {
      internal(this).sources = sources
      internal(this).data = data
      internal(this).formatter = formatter
      internal(this).serviceShapes = serviceShapes
      internal(this).styles = styles;
    }

    static get Builder() {
      class Builder {
        constructor() {
          internal(this).sources = new Map()
          internal(this).data = new Map()
        }

        addSource(name, source, comparer) {
          internal(this).sources.set(name, { name: name, source: source, comparer: comparer })
          return this
        }

        addData(name, data, comparer) {
          internal(this).data.set(name, { name: name, data: data, comparer: comparer })
          return this
        }

        outputAsDOTDefaultServices(styles) {
          internal(this).formatter = wsd.GenerateDOT

          let ss = {
            service: wsd.Shapes.ellipse,
            queue: wsd.Shapes.cds,
            database: wsd.Shapes.cylinder
          }

          internal(this).serviceShapes = ss;
          if (styles === undefined)
            styles = {};

          internal(this).styles = styles;   //no styles, so just the default

          return this;
        }

        outputAsDOT(serviceShapes, styles) {
          internal(this).formatter = wsd.GenerateDOT
          internal(this).serviceShapes = serviceShapes
          internal(this).styles = styles;
          return this;
        }

        build() {
          var tracer = new EntModeller(internal(this).sources, internal(this).data, internal(this).formatter, internal(this).serviceShapes, internal(this).styles);
          return tracer;
        }
      }

      return Builder
    }

    generateOutput() {
      return new Promise((resolve, reject) => {
        let requests = [];
        let formatter = internal(this).formatter;
        internal(this).sources.forEach(source => {
          console.log(`source:${source.name}`)
          requests.push(source.source.generateSourceConnections())
        });

        internal(this).data.forEach(data => {
          console.log(`data:${data.name}`)
          requests.push(data.data)
        });

        Promise.all(requests).then(allResults => {
          let merged = new Map();
          allResults.forEach(success => {
            success.forEach(relationship => {
              merged.set(JSON.stringify(relationship), relationship);
            })
          });
          let results = Array.from(merged.values());
          let formatted = formatter(results, internal(this).serviceShapes, internal(this).styles);
          resolve(formatted);
        });
      });
    }
  }

  return EntModeller
}())

module.exports.Builder = EntModeller.Builder
module.exports.DotShapes = wsd.Shapes
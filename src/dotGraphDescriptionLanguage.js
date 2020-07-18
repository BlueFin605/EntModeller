module.exports.GenerateDOT = function (data, serviceShapes, styles) {
    let unique = [];
    data.forEach(r => {
        if (r.from !== undefined) {
            let json = JSON.stringify(r.from)
            if (unique.some(s => JSON.stringify(s) === json) === false) {
                unique.push(r.from);
            }
        }

        if (r.to !== undefined) {
            json = JSON.stringify(r.to)
            if (unique.some(s => JSON.stringify(s) === json) === false) {
                unique.push(r.to);
            }
        }

        if (r.node !== undefined) {
            json = JSON.stringify(r.node)
            if (unique.some(s => JSON.stringify(s) === json) === false) {
                unique.push(r.node);
            }
        }
    });

    let output = 'digraph services {\r\n';
    output += '{\r\n';
    unique.forEach(e => output += `${transformName(e.name)} [shape=${serviceShapes[e.type]}${buildStyles(e, styles)}]\r\n`)
    output += '}\r\n';
    data.filter(f => f.node === undefined).forEach(relationship => output += `${transformName(relationship.from.name)} -> ${transformName(relationship.to.name)}\r\n`)
    output += '}\r\n';
    return output;
}

module.exports.Shapes = class Shapes {
    static box = 'box';
    static polygon = 'polygon';
    static ellipse = 'ellipse';
    static oval = 'oval';
    static circle = 'circle';
    static point = 'point';
    static egg = 'egg';
    static triangle = 'triangle';
    static plaintext = 'plaintext';
    static plain = 'plain';
    static diamond = 'diamond';
    static trapezium = 'trapezium';
    static parallelogram = 'parallelogram';
    static house = 'house';
    static pentagon = 'pentagon';
    static hexagon = 'hexagon';
    static septagon = 'septagon';
    static octagon = 'octagon';
    static doublecircle = 'doublecircle';
    static doubleoctagon = 'doubleoctagon';
    static tripleoctagon = 'tripleoctagon';
    static invtriangle = 'invtriangle';
    static invtrapezium = 'invtrapezium';
    static invhouse = 'invhouse';
    static Mdiamond = 'Mdiamond';
    static Msquare = 'Msquare';
    static Mcircle = 'Mcircle';
    static rect = 'rect';
    static rectangle = 'rectangle';
    static square = 'square';
    static star = 'star';
    static none = 'none';
    static underline = 'underline';
    static cylinder = 'cylinder';
    static note = 'note';
    static tab = 'tab';
    static folder = 'folder';
    static box3d = 'box3d';
    static component = 'component';
    static promoter = 'promoter';
    static cds = 'cds';
    static terminator = 'terminator';
    static utr = 'utr';
    static primersite = 'primersite';
    static restrictionsite = 'restrictionsite';
    static fivepoverhang = 'fivepoverhang';
    static threepoverhang = 'threepoverhang';
    static noverhang = 'noverhang';
    static assembly = 'assembly';
    static signature = 'signature';
    static insulator = 'insulator';
    static ribosite = 'ribosite';
    static rnastab = 'rnastab';
    static proteasesite = 'proteasesite';
    static proteinstab = 'proteinstab';
    static rpromoter = 'rpromoter';
    static rarrow = 'rarrow';
    static larrow = 'larrow';
    static lpromoter = 'lpromoter';
};

function transformName(name) {
    return name.replaceAll("-", "_");
}

function buildStyles(service, styles) {
    if (service.style === undefined)
        return '';

    if (styles === undefined)
        return '';

    if (service.style in styles) {
        let nodeStyles = styles[service.style];
        let styleCsv = '';
        Object.entries(nodeStyles).forEach(([fkey, fval]) => styleCsv += `, ${fkey}=${fval}`);
        return styleCsv;
    }

    return '';
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

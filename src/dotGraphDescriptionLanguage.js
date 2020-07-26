module.exports.GenerateDOT = function (data, serviceShapes, styles, entityOverrides, entityFills, relationshipFills) {
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
    unique.forEach(e => output += `${transformName(e.name)} [shape=${serviceShapes[e.type]}${buildStyles(e, styles, entityOverrides)}]\r\n`)
    if (entityFills !== undefined)
        entityFills.forEach(e => output += `${transformName(e.name)} [shape=${serviceShapes[e.type]}${buildStyles(e, styles, entityOverrides)}]\r\n`)
    output += '}\r\n';

    let grouped = data.filter(f => f.from !== undefined)
        .reduce((accumulator, item) => {
            let group = findGroup(item.from, entityOverrides);
            if (!(group in accumulator))
                accumulator[group] = { name: group, items: [] };
            accumulator[group].items.push(item);
            return accumulator;
        }, {});


    if (relationshipFills !== undefined)
        relationshipFills.forEach(fill => {
            let group = findFillGroup(fill, entityOverrides);
            if (!(group in grouped))
                grouped[group] = { name: group, items: [] };
            grouped[group].items.push({ to: { name: fill.to }, from: { name: fill.from } });
        });

    Object.values(grouped).forEach(g => output += outputGroup(g, relationshipFills));

    output += '}\r\n';
    return output;
}

function outputGroup(group) {
    let output = '';

    if (group.name !== 'default')
        output = `subgraph cluster${group.name}{\r\n`;

    output += outputGroupItems(group.items);

    if (group.name != 'default')
        output += '}\r\n';
    return output;
}

function outputGroupItems(items) {
    let output = '';
    items.filter(f => f.node === undefined).forEach(relationship => output += `${transformName(relationship.from.name)} -> ${transformName(relationship.to.name)}\r\n`)
    return output;
}

function findGroup(item, entityOverrides) {
    let group = 'default';

    if (item !== undefined && item.relationshipGroup !== undefined)
        group = item.relationshipGroup;

    if (entityOverrides !== undefined) {
        let match = entityOverrides.find(f => f.name === item.name);
        if (match !== undefined && match.relationshipGroup !== undefined)
            group = match.relationshipGroup;
    }

    return group;
}

function findFillGroup(item, entityOverrides) {
    let group = 'default';

    if (item !== undefined && item.relationshipGroup !== undefined)
        group = item.relationshipGroup;

    if (entityOverrides !== undefined) {
        let match = entityOverrides.find(f => f.name === item.from);
        if (match !== undefined && match.relationshipGroup !== undefined)
            group = match.relationshipGroup;
    }

    return group;
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

function buildStyles(service, styles, entityOverrides) {

    let style = service.style;

    if (entityOverrides !== undefined) {
        let match = entityOverrides.find(f => f.name === service.name);
        if (match !== undefined)
            style = match.style;
    }

    if (styles === undefined)
        return '';

    if (style === undefined)
        return '';


    if (style in styles) {
        let nodeStyles = styles[style];
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

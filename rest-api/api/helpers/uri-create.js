const config = require('../../config.json')

module.exports = (projectNumber, discipline, type, id) => {
    var ns = config.dataNamespace;

    return `${ns}/${projectNumber}/${discipline}/${type}/${id}`;
}
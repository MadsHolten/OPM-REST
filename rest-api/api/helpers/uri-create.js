const config = require('../../config.json')

module.exports = (projectNumber, discipline, type, id) => {
    var ns = process.env.DATA_NAMESPACE;

    return `${ns}/${projectNumber}/${discipline}/${type}/${id}`;
}
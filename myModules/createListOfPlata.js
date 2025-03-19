//  Из списка Плат БД формируем сокращенный список, содеожащий только название Платы и id Платы, для отправки клиенту
const objectId = require('mongodb').ObjectId;

const createListOfPlata = (list) => {

    const res = list.map((elem) => {
        return { name: elem.name, _id: objectId(elem._id) }
    });
    return res;
};

module.exports = createListOfPlata;

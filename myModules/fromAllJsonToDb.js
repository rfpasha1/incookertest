//  Читаем все файлы json (components.json, products.json, plans.json) и записываем прочитанные данные в Базу Данных

// const fromComponentsJsonToDb = require('./fromComponentsJsonToDb');
// const fromProductsJsonToDb = require('./fromProductsJsonToDb');
// const fromPlansJsonToDb = require('./fromPlansJsonToDb');
const fromJsonToDb = require('./fromJsonToDb');

const arrayFilesJson = ['components', 'products', 'plans'];

let fullRes = 1;

const fromAllJsonToDb = async (req) => {

    console.log('Работа fromAllJsonToDb');
    try {
        arrayFilesJson.forEach(async (elem) => {

            let res = await fromJsonToDb(req, elem); // res=1 - успешное завершение, res=0 - ошибка
            fullRes *= res;
        });
    } catch (err) {
        console.log(err);
        fullRes = 0;
    };

    return fullRes;
}

module.exports = fromAllJsonToDb;
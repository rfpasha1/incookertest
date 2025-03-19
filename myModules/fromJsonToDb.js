//  Читаем файл json и записываем прочитаные данные в коллекцию Базу Данных 

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const getDirName = (lib) => {

    let res = __dirname;  // __dirname = С:\mern_InCooker\myModules
    return res.substring(0, res.indexOf(lib) - 1);  // Удаляем имя lib и слэш перед ним (удаляем \myModules) получаем С:\mern_InCooker
};

const fromJsonToDb = async (req, collection) => {

    const myDb = req.app.locals.MyDb;
    // Читаем файл collection.json и сохраняем прочитаные данные в Базу Данных коллекцию collection
    const flName = path.join(getDirName('myModules'), collection + '.json');
    console.log('___FLNAME: ', flName);
    fs.readFile(flName, async (err, data) => {  // Читаем файл 'collection.json
        if (err) {
            console.log(err);
        } else {
            console.log(`Файл ${flName} прочитан`);
            const jsonData = JSON.parse(data);  // Преобразуем данные из json файла в объект
            // Преобразуем свойтво _id из String в ObjectId
            for (x of jsonData) {
                x['_id'] = mongoose.Types.ObjectId.createFromHexString(x['_id']);
            };
            await myDb.changeCollection(collection);
            const info = await myDb.saveFullCollection(jsonData); // Сохраняем прочитаные данные в коллекцию БД
            if (info) {
                console.log(`Коллекция ${collection} записана в Базу Данных`);
                return 1;
            } else {
                console.log(`Коллекция ${collection} НЕ записана в Базу Данных или записана с ошибкой`);
                return 0;
            }
        };
    });
};

module.exports = fromJsonToDb;
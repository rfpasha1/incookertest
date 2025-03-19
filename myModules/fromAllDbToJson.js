//  Записываем данные из Базы Данных в файлы json (коллекции: components, products, plans)

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Component = require('./schemes/componentSchema');  // Модель для коллекции components в Базе Данных incooker
const Product = require('./schemes/productSchema');  // Модель для коллекции products в Базе Данных incooker
const Plan = require('./schemes/planSchema');  // Модель для коллекции plans в Базе Данных incooker

const getDirName = (lib) => {

    let res = __dirname;  // __dirname = С:\mern_InCooker\myModules
    return res.substring(0, res.indexOf(lib) - 1);  // Удаляем имя lib и слэш перед ним (удаляем \myModules) получаем С:\mern_InCooker
};

const fromAllDbToJson = async () => {

    await mongoose.connect("mongodb://localhost:27017/incooker");

    //  Записываем данные коллекции components в файл components.json
    const dataComponents = await Component.find();
    const jsonComponents = JSON.stringify(dataComponents, null, 2);
    const url1 = path.join(getDirName('myModules'), 'components.json');
    fs.writeFile(url1, jsonComponents, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Файл components.json создан, данные записаны');
        }
    });

    //  Записываем данные коллекции products в файл products.json
    const dataProducts = await Product.find();
    const jsonProducts = JSON.stringify(dataProducts, null, 2);
    const url2 = path.join(getDirName('myModules'), 'products.json');
    fs.writeFile(url2, jsonProducts, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Файл products.json создан, данные записаны');
        }
    });

    //  Записываем данные коллекции plans в файл plans.json
    const dataPlans = await Plan.find();
    const jsonPlans = JSON.stringify(dataPlans, null, 2);
    const url3 = path.join(getDirName('myModules'), 'plans.json');
    fs.writeFile(url3, jsonPlans, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Файл plans.json создан, данные записаны');
        }
    });

    await mongoose.disconnect();
};

module.exports = fromAllDbToJson;
//  Перед выходом из приложения сохраняем файлы components.json, products.json, plans.json в архивную папку (jsonArhive)

const fs = require('fs');
const path = require('path');

// Создаем путь к файлу
const getDirName = (lib) => {

    let res = __dirname;  // __dirname = С:\mern_InCooker\myModules
    return res.substring(0, res.indexOf(lib) - 1);  // Удаляем имя lib и слэш перед ним (удаляем \myModules) получаем С:\mern_InCooker
};

// Копируем файл fileName в архив (папка jsonArhive)
const copyOneFile = async (fileName) => {

    let flag = 1;
    // Проверяем, существует ли необходимая нам папка (jsonArhive), если нет, то создаем ее
    if (!fs.existsSync(path.join(getDirName('myModules'), 'jsonArhive'))) {
        fs.mkdirSync((path.join(getDirName('myModules'), 'jsonArhive')), { recursive: true });
    };
    const oldFilePath = path.join(getDirName('myModules'), fileName + '.json');
    const newFilePath = path.join(getDirName('myModules'), 'jsonArhive', fileName + '.json');
    fs.copyFile(oldFilePath, newFilePath, (err) => {
        if (err) {
            console.log(err);
            console.log(`Файл ${fileName}.json НЕ скопирован в архив или скопирован с ошибкой`);
            flag = 0;
        };
        console.log(`Файл ${fileName}.json успешно скопирован в архив jsonArhive!`);
        flag = 1;
    });
    return flag;
};

// Копируем файлы components.json, products.json, plans.json в архивную папку (jsonArhive)
const saveAndExit = async () => {

    console.log('Работа saveAndExit');
    let fullRes = 1;
    const arrayFilesJson = ['components', 'products', 'plans'];
    try {
        arrayFilesJson.forEach(async (elem) => {

            let res = await copyOneFile(elem); // res=1 - успешное завершение, res=0 - ошибка
            fullRes *= res;
        });
    } catch (err) {
        console.log(err);
        fullRes = 0;
    };
    console.log('Результат копирования файлов: ', fullRes);
    // return fullRes;
};

module.exports = saveAndExit;
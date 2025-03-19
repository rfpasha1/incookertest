// Модель Component коллекции (components) Базы Данных incooker

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Установка схемы
const componentSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,  //Тип свойства
        required: true // Свойство обязательное
    },
    quantity: {
        type: Number,
        required: true // Свойство обязательное
    },
    reserve: {
        type: Number
    }
},
    { versionKey: false } // Отключаем поле __v (version), если оно не нужно
);

// Присоеденяем схему к модели (Коллекция components будет создана или найдена в БД)
const Component = mongoose.model('component', componentSchema);

module.exports = Component;
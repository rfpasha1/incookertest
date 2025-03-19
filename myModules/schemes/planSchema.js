// Модель Plan коллекции (plans) Базы Данных incooker

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Установка схемы
const planSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,  //Тип свойства
        required: true // Свойство обязательное
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()  // Ззначение свойства по умолчанию
    },
    plats: {
        type: Array,
        required: true
    }
},
    { versionKey: false } // Отключаем поле __v (version), если оно не нужно
);

// Присоеденяем схему к модели (Коллекция components будет создана или найдена в БД)
const Plan = mongoose.model('plan', planSchema);

module.exports = Plan;
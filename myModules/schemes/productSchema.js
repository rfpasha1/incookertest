// Модель Product коллекции (products) Базы Данных incooker

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Установка схемы
const productSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,  //Тип свойства
        required: true // Свойство обязательное
    },
    components: {
        type: Array,
        required: true
    }
},
    { versionKey: false } // Отключаем поле __v (version), если оно не нужно
);

// Присоеденяем схему к модели (Коллекция products будет создана или найдена в БД)
const Product = mongoose.model('product', productSchema);

module.exports = Product;
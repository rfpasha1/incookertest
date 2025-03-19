const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const Plans = require('../model/plans');

//  Для работы с базой создаем КЛАСС
const MyDb = class {
    constructor(url, dBase, dCollection) {  //В конструкторе определяем параметры необходимые для работы с БД
        this.mongoClient = new MongoClient(url);
        this.collectionName = dCollection;
        this.dbName = dBase;
    }

    //Методы работы с БД работают в асихронном режиме, поэтому для монторования БД создаем асихронную ф-цию

    //Метод монтрует Базу Данных
    async create() {

        try {
            await this.mongoClient.connect();
            this.dB = this.mongoClient.db(this.dbName);
            console.log('Подключение с БД установлено');
            // this.collection = this.dB.collection(this.collectionName);
        } catch (error) {
            console.log(error);
        } finally {
            console.log('База Данных смонтирована');
        }
    }

    //Метод меняет коллекцию в БД, newCollection - название коллекции на которую меняем
    async changeCollection(newCollection) {

        this.collectionName = newCollection;
        try {
            this.collection = await this.dB.collection(this.collectionName);
            console.log('Новая коллекция смонтирована: ', newCollection);
            // Прочитать все содержимое коллекции
            // Сохранить это содержимое в файл, имя файла это имя Коллекции.json
        } catch (error) {
            console.log(error);
        }
    }

    //Метод демонтирует (закрывает) Базу Данных
    async dbClose() {

        try {
            await this.mongoClient.close();
        } catch (error) {
            console.log(error);
        }
    }

    //Метод читает и извлекает все документы коллекции и возращает массив
    async getDataFromFullCollection() {

        let info = null;
        try {
            // info = await this.collection.find().toArray();
            info = await Plans.find({})  // Запрос на все элементы коллекции
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }

    //Метод находит один документ по ключу dataKey и возвращает его
    async getOneDocument(dataKey) {

        let info = null;
        try {
            info = await this.collection.findOne(dataKey);
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }

    //Метод находит все документы по ключам dataKey (массив ключей) в ДБ и возвращает массив из этих документов
    async getManyDocuments(dataKey) {

        let info = [];
        try {
            for (let i = 0; i < dataKey.length; i++) {
                const tmp = await this.collection.findOne(dataKey[i]);
                info.push(tmp._id);
            }
            // console.log('myDb getManyDocuments: ', info);
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }

    //Метод, читает заданое количество документов (limitValue), пропускает определенное количество документов (skipElement)
    async getPartOfDataFromFullCollection(skipElement, limitValue) {

        let info = null;
        try {
            //Определим количество документов this.collection.stats();
            const allDocuments = await this.collection.countDocuments();
            console.log('allDocuments:', allDocuments);
            skipElement = (skipElement <= allDocuments - 5) ? skipElement : allDocuments - 5;
            info = await this.collection.find().skip(skipElement).limit(limitValue).toArray();
        } catch (error) {
            console.log(error);
        } finally {
            return info; //{info: info, fullColection: XXX(this.collection.stats())}
        }
    }

    //Метод записывает новый документ и возвращает изменненый массив документов коллекции
    async saveDataToCollection(data) {

        let info = null;
        try {
            await this.collection.insertOne(data);
            info = await this.collection.find().toArray();
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }

    //Метод, который записывает документ в БД и возвращает только записаный документ!!!!!!
    async saveOneDataToCollection(data) {

        let info = null;
        try {
            await this.collection.insertOne(data);
            info = await this.collection.find(data).toArray();
            // console.log('myDb: ', info);
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }

    //Метод изменяет выбраный документ и возвращает 1 изменненый документ коллекции
    async updateDataOne(dataKey, data) {  //dataKey-ключ по которому ищем нужный документ, data-новое значение для документа

        let info = null;
        try {
            // console.log('dataKey: ', dataKey);
            // console.log('data: ', data);
            await this.collection.findOneAndUpdate(dataKey, { $set: data });
            info = await this.collection.find(dataKey).toArray();

        } catch (error) {
            console.log(error);
        } finally {
            // console.log('myDb2: ', info);
            return info;
        }
    }

    //Метод находит документ по ключю dataKey и изменяет массив frends (С ОДНИМ ЭЛЕМЕНТОМ-ДРУГОМ) 
    async getOneDataFromCollection(dataKey) {

        let info = null;
        try {
            info = await this.collection.findOne(dataKey);
            let infoRef = await this.collection.findOne({
                _id: new objectId(info.frends[0])
            });
            info.frends[0] = infoRef;
            console.log('info in getOneDataFromCollection(dataKey): ', info);
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }

    //Метод находит документ по ключу dataKey и изменяет поле ref (массив друзей)
    async getDataWithReferens(dataKey, ref) {  //ref - массив ссылок на данные из коллекции (друзья)

        let info = null;
        try {
            info = await this.collection.findOne(dataKey);
            // console.log('info[ref]: ', info[ref]);
            let frends = [];
            if (info[ref]) {
                for (let i = 0; i < info[ref].length; i++) {
                    let tmp = await this.collection.findOne({ _id: new objectId(info[ref][i]) });
                    frends.push(tmp);
                }
            }
            console.log('FRENDS: ', frends);
            info.frends = frends;
            console.log('INFO in getDataWithReferens(dataKey, ref): ', info);
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }

    //Метод удаляет из БД выбраный документ по ключю dataKey и возвращает удаленный документ
    async deleteOneDocument(dataKey) {

        let info = null;
        try {
            info = await this.collection.find(dataKey).toArray();
            await this.collection.findOneAndDelete(dataKey);
        } catch (error) {
            console.log(error);
        } finally {
            return info;
        }
    }
}

module.exports = MyDb;
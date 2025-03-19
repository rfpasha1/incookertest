//***************************_____ require _____*************************\\
const express = require('express');
const config = require('config');
const MyDb = require('./myModules/myDb');
const router = require('./myModules/data.router');
const validRouter = require('./myModules/valid.router');
const path = require('path');
const process = require('process');

//***************************_____ require _____*************************\\

//***************************_____ define const _____*************************\\
const PORT = config.get('port') || 5000;
const URLDB = config.get('urldb') || 'mongodb://127.0.0.1:27017/';
const DB = config.get('db') || 'incooker';
const COLLECTION = config.get('collection') || 'products';
const CLIENTSERVER = config.get('client') || 'http://localhost:3000';
//***************************_____ define const _____*************************\\

const app = express();
const mongoClient = new MyDb(URLDB, DB, COLLECTION);

//***************************_____ middleware _____*************************\\
app.use((req, res, next) => {
    // console.log('Server req= ', req.url);
    res.append('Access-Control-Allow-Origin', CLIENTSERVER);
    next();
});
app.use((req, res, next) => {
    app.locals.MyDb = mongoClient;
    next();
});
app.use(express.json({ extended: true }));
app.use('/api', router); //Подключаем маршруты
app.use('/validator', validRouter); //Подключаем валидатор
//***************************_____ middleware _____*************************\\

// Добавляем загрузку клиентских файлов
if (process.env.NODE_ENV === "production") {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

//***************************_____ conect DB _____*************************\\
(async () => {

    try {
        await mongoClient.create();  //Получем доступ к БД и Коллекциям
        app.locals.MyDb = mongoClient;  //Сохраняем экземпляр класса MyDb в app.locals
        app.listen(PORT, () => {
            console.log(`Server has started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    } finally {
        console.log('RUN Завершилось');
    }
})();  //Вызываем функцию на месте
//***************************_____ conect DB _____*************************\\

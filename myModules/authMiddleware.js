//Промежуточное ПО, которое дает доступ для получения полного списка коллекции определенным пользователям

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //Стандартный специальный запрос, который проверяет доступность сервера
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        let token = req.headers.authorization;
        console.log('TOKEN: ', token);
        if (!token) {
            return res.status(403).json({ message: 'Пользователь не авторизован' });
        }
        //Раскодируем токен
        token = token.split(' ')[1];
        const SECRETKEY = config.get('tokenKey');
        const tmpToken = jwt.verify(token, SECRETKEY);
        req.user = tmpToken;
        next();
    } catch (err) {
        console.log('err in authMiddleware: ', err);
        return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
}

import React from 'react';
import Button from '../ul/button';
import { useHttp } from '../myHooks/useHttp';

export default function Validator() {
    const { request, error } = useHttp();
    return (
        <div>

            <h1>Express validator</h1>
            <p>
                Позваляет проветрять все компоненты http запроса:
                query, param, body, headers
            </p>

            <Button value={'Query'} onClick={async () => {
                try {
                    const data = await request('/validator/query?login=        Ann   gdhdwbn  nkjkl         ');
                    console.log('DATA_VALIDATOR: ', data);
                } catch (err) {
                    console.log(err);
                    console.log(error);
                }
            }} />

            <Button type="button" value={'Body'} onClick={async () => {
                try {
                    const data = await request('/validator/body',
                        'POST',
                        {
                            email: 'aaa@gmail.com',
                            password: ''
                        });
                    console.log('BODY_VALIDATOR: ', data);
                } catch (err) {
                    console.log(err);
                    console.log(error);
                }
            }} />

        </div>
    )
}

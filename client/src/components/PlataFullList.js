import React, { useState } from 'react';
import Inputs from '../ul/inputs';

export default function PlataFullList({ list }) {

    const defindQuantity = list.map((elem) => elem.quantity);
    const [quantityOfPlats, setQuantityOfPlats] = useState(defindQuantity);

    const setQuantity = (e) => {
        let index = e.target.id;
        let newQuantity = quantityOfPlats.map((elem) => elem);
        newQuantity[index] = e.target.value;
        setQuantityOfPlats(newQuantity);
    };

    let myList = <p>Получили пустой список Плат</p>;

    if (list) {
        myList = list.map((elem, index) => {
            return (
                <li key={"list" + index}>
                    {elem.name} <Inputs id={index} value={elem.quantity} onChange={setQuantity} />
                </li>
            )
        });
        myList = <ul>{myList}</ul>;
    };

    return (
        <div>
            {myList}
        </div>
    )
};
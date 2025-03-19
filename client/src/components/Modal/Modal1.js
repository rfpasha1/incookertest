import React from 'react';
import s from './modal.css';
// import Button from '../../ul/button';

export default function Modal({ active, setActive, children, myRes }) {


    return (
        <div className={active ? s['modal'] + ' ' + s['active'] : s['modal']} onClick={() => {
            setActive(false);
            myRes(false);
        }}>
            <div className={active ? 'modal__content active' : 'modal__content'} onClick={e => e.stopPropagation()}>
                <div className='modal__content_text'>
                    {children}
                </div>

            </div>
        </div>
    )
}

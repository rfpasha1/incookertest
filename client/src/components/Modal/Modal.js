import React from 'react';
import './modal.css';
// import Button from '../../ul/button';

export default function Modal({ active, setActive, children, myRes }) {

    return (
        <div className={active ? 'modal active' : 'modal'} onClick={() => {
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

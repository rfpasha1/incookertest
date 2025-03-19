import React from 'react';

export default function Button(props) {  //Любые props = { value, onClick и т.д.} 

    return (
        <input type='button' className='myButton' {...props} />  //Варианты props: value={value} onClick={onClick} */
    )
}

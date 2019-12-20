import React, { useContext } from 'react';
import cn from 'classnames';
import ConfigContext from './../context/config';
import "./Dropdown.less";

function Dropdown(props) {
    const cls = cn({
        'sm-dropdown': true
    });
    const config = useContext(ConfigContext);
    
    return (
        <div 
            className={cls}
            style={{
                width: config.width || null
            }}
        >
            { props.children }
        </div>
    );
}
export default Dropdown;
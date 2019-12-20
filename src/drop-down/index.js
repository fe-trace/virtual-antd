import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import Selector from './Selector.js';
import "./Index.less";

function Dropdown(props) {
    const [ visible, setVisible ] = useState(props.visible || false);
    const cls = cn({
        "sm-dropdown-cont": true,
        [props.wrapCls || ""]: true
    });
    const onToggle = function(e) {
        setVisible(!visible);
    };
    const closeDropPanel = useCallback(function() {
        setVisible(false);
    }, []);

    useEffect(function() {
        document.addEventListener("click", closeDropPanel);
        return function() {
            document.removeEventListener(closeDropPanel);
        };
    }, []);
    
    return (
        <div className="sm-dropdown" onClick={e => e.nativeEvent.stopImmediatePropagation()}>
            <div onClick={onToggle}>
                <Selector
                    visible={visible}
                />
            </div>
            {
                visible && (
                    <div 
                        className={cls}
                        style={{
                            width: props.width || null
                        }}
                    >
                        { props.children }
                    </div>
                )
            }
        </div>
    );
}
export default Dropdown;
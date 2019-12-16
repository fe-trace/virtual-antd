import React, { useContext } from 'react';
import cn from 'classnames';
import { Tag, Icon } from 'antd';
import ConfigContext from './../context/config';
import "./Selector.less";

function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Clicked! But prevent default.');
}

function Selector(props) {
    const config = useContext(ConfigContext);
    const cls = cn({
        'sm-selector': true,
        'active': config.visible
    });
    const onToggle = function(e) {
        props.onToggle && props.onToggle();
    };
    return (
        <div 
            className={cls}
            style={{
                width: config.width || null
            }}
            onClick={onToggle}
        >
            <span>{ props.placeholder || "请选择" }</span>
            {/* <Tag closable>Tag 1</Tag> */}
            {
                config.showExpander && (
                    <span className="sm-selector-closer">
                        <Icon type="down" rotate={ config.visible ? 180 : 0} />
                    </span>
                )
            }
            {
                config.allowClear && (
                    <span className="sm-selector-closer">
                        <Icon type="close-circle" theme="filled" />
                    </span>
                )
            }
        </div>
    );
}
export default Selector;
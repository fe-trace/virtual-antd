import React from 'react';
import cn from 'classnames';
import { Tag, Icon } from 'antd';
import "./Selector.less";

function Selector(props) {
    const cls = cn({
        'sm-selector': true,
        [props.wrapClassName]: !!props.wrapClassName
    });
    return (
        <div 
            className={cls}
            style={{
                width: props.width || null
            }}
        >
            <Tag closable>Tag 1</Tag>
            <Icon type="close-circle" />
        </div>
    );
}
export default Selector;
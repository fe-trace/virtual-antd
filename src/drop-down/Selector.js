import React from 'react';
import cn from 'classnames';
import { Tag, Icon } from 'antd';
import "./Selector.less";

function Selector(props) {
    const cls = cn({
        'sm-selector': true,
        'active': props.visible
    });
    const iconCls = cn({
        'sm-selector-icon': true,
        'rotate': props.visible
    });
    return (
        <div 
            className={cls}
        >
            <span>{ props.placeholder || "请选择" }</span>
            <span className="sm-selector-closer">
                <span className={iconCls}>
                    <Icon type="down" />
                </span>
            </span>
            {/* <Tag closable>Tag 1</Tag> */}
            {
                props.allowClear && (
                    <span className="sm-selector-closer" onClick={e => e.stopPropagation()}>
                        <Icon type="close-circle" theme="filled" />
                    </span>
                )
            }
        </div>
    );
}
export default Selector;
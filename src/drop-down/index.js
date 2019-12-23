import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { Icon, Tag } from 'antd';
import "./Index.less";

function labelView(props, handleRemove) {
    const { labels, maxTagCount } = props;
    const { list, keys } = labels;
    const handleClose = function(e, payload) {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();

        if(payload.type === 'all') {
            handleRemove(keys.splice(maxTagCount));
        } else {
            handleRemove([payload.data.key]);
        }
    };
    const leftCount = keys.length - maxTagCount;
    let viewComp = null;

    if(list && list.length) {
        if(props.single) {
            const item = list[0];
            viewComp = (
                <span 
                    className="sm-label"
                >
                    { item.label }
                </span>
            );
        } else {
            const tempList = [...list];
            const viewList = tempList.splice(0, maxTagCount);
            viewComp = (
                <span>
                    { 
                        viewList.map(item => (
                            <Tag 
                                closable
                                key={item.key}
                                onClose={(e) => handleClose(e, {
                                    type: "item",
                                    data: item
                                })}
                            >
                                {item.label}
                            </Tag>
                        ))
                    }
                    { 
                        leftCount && (
                            <span>
                                <Tag 
                                    closable
                                    onClose={(e) => handleClose(e, {
                                        type: "all"
                                    })}
                                >
                                    {`+${leftCount}...`}
                                </Tag>
                            </span>
                        ) || false 
                    }
                </span>
            );
        }
    } else {
        viewComp = (<span>{ props.placeholder || "请选择" }</span>);
    }
    return viewComp;
}

function Dropdown(props) {
    const [ visible, setVisible ] = useState(props.visible || false);
    const cls = cn({
        "sm-dropdown-cont": true,
        "hidden": !visible,
        [props.wrapCls || ""]: true
    });
    const selectCls = cn({
        'sm-selector': true,
        'active': visible
    });
    const iconCls = cn({
        'sm-selector-icon': true,
        'rotate': visible
    });
    const onToggle = function(e) {
        setVisible(!visible);
    };
    const closeDropPanel = useCallback(function() {
        setVisible(false);
    }, []);
    const handleClear = function(e) {
        e.stopPropagation();
    };
    const handleRemove = function(payload) {
        console.log("data: ", payload);
    };
    const viewComp = labelView(props, handleRemove);
    

    useEffect(function() {
        document.addEventListener("click", closeDropPanel);
        return function() {
            document.removeEventListener(closeDropPanel);
        };
    }, []);
    
    return (
        <div className="sm-dropdown" onClick={e => e.nativeEvent.stopImmediatePropagation()}>
            <div onClick={onToggle}>
                <div 
                    className={selectCls}
                >
                    { viewComp }
                    <span className="sm-selector-closer">
                        <span className={iconCls}>
                            <Icon type="down" />
                        </span>
                    </span>
                    {
                        props.allowClear && (
                            <span className="sm-selector-closer" onClick={handleClear}>
                                <Icon type="close-circle" theme="filled" />
                            </span>
                        )
                    }
                </div>
            </div>
            <div 
                className={cls}
                style={{
                    width: props.width || null
                }}
            >
                { 
                    React.cloneElement(props.children, {
                        closeDropPanel: closeDropPanel
                    }) 
                }
            </div>
        </div>
    );
}
export default Dropdown;
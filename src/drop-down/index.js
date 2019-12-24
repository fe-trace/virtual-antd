import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { Icon, Tag } from 'antd';
import "./Index.less";

function preventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
}

function LabelView(props) {
    const { labels, maxTagCount } = props;
    const handleClose = function(e, payload) {
        preventDefault(e);
        
        // 剔除删除的节点，剩余的节点重新进行选中
        if(payload.type === 'all') {
            props.handleSetKey(labels.splice(0, maxTagCount));
        } else {
            props.handleSetKey(labels.filter(item => item.key != payload.key));
        }
    };
    let viewComp = null;

    if(labels && labels.length) {
        if(props.single) {
            const item = labels[0];
            viewComp = (
                <span 
                    className="sm-label"
                >
                    { item.label }
                </span>
            );
        } else {
            const tempList = [...labels];
            const viewList = tempList.splice(0, maxTagCount);
            viewComp = (
                <span>
                    { 
                        viewList.map(item => (
                            <Tag 
                                closable
                                key={item.key}
                                onClick={preventDefault}
                                onClose={(e) => handleClose(e, {
                                    type: "item",
                                    key: item.key
                                })}
                            >
                                {item.label}
                            </Tag>
                        ))
                    }
                    { 
                        (tempList && tempList.length) && (
                            <span>
                                <Tag 
                                    closable
                                    onClick={preventDefault}
                                    onClose={(e) => handleClose(e, {
                                        type: "all"
                                    })}
                                >
                                    {`+${tempList.length}...`}
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
    const handleSetKey = function(list) {
        const keys = list.map(item => item.key);
        props.removeLabel && props.removeLabel(keys);
    };

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
                    <LabelView
                        single={props.single}
                        labels={[...props.labels]} 
                        maxTagCount={props.maxTagCount}
                        handleSetKey={handleSetKey}
                    />
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
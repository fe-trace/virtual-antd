import React, { useContext, useCallback } from 'react';
import cn from 'classnames';
import { Checkbox, Icon } from 'antd';
import ConfigContext from './../context/config';
import { nodeStatus, loadStatus } from './constant.js';
import "./SelectItem.less";

function SelectItem(props) {
    const config = useContext(ConfigContext);
    const { data } = props;
    const status = config.expandStatus[data.key];
    const checkStatus = config.checkStatus[data.key] || {};
    const loadedStatus = config.loadedStatus[data.key];
    const cls = cn({
        'sm-select-item': true
    });
    const itemCls = cn({
        'select-item': true,
        'active': checkStatus.checked && !config.checkable,
        'disabled': data.disabled
    });
    const handleFold = function() {
        config.expandNode && config.expandNode(data, nodeStatus.fold);
    };
    const handleUnFold = function() {
        config.expandNode && config.expandNode(data, nodeStatus.unfold);
    };
    const handleChange = function(e) {
        let checked = e.target.checked;
        if(checkStatus.indeterminate) {
            checked = true;
        }
        config.selectNode && config.selectNode(data, checked);
    };
    const handleSelect = function() {
        let checked = checkStatus.checked || false;

        // 节点部分选中 点击时选中节点
        if(checkStatus.indeterminate) {
            checked = false;
        }
        config.selectNode && config.selectNode(data, !checked);
    };

    return (
        <div 
            className={cls}
            style={{ paddingLeft: data.level * 18 }}
        >
            <span className="ic-expand">
                { 
                    (
                        // 异步加载 && 加载中 && 显示加载中
                        config.asyncLoad && loadedStatus === loadStatus.loading && (
                            <Icon type="loading" />
                        )
                    ) || (
                        // ( 有子节点 || (异步加载 && (节点不是加载中状态)) ) 显示节点展开/闭合状态
                        (data.children && data.children.length) || (config.asyncLoad && !loadedStatus)
                    ) && (
                        status === nodeStatus.fold && (
                            // 节点展开
                            <Icon 
                                type="minus-circle" 
                                onClick={ handleUnFold } 
                            />
                        ) || (
                            // 节点闭合
                            <Icon 
                                type="plus-circle" 
                                onClick={ handleFold } 
                            />
                        )
                    )
                }
            </span>
            <span className={itemCls}>
                {
                    config.checkable && (
                        <Checkbox
                            className="ic-checkbox"
                            disabled={ data.disabled }
                            checked={ checkStatus.checked }
                            indeterminate={ checkStatus.indeterminate }
                            onChange={ handleChange } 
                        />
                    )
                }
                <span 
                    className="text"
                    onClick={ handleSelect }
                >{ data.label }</span>
            </span>
        </div>
    );
}
export default React.memo(SelectItem);
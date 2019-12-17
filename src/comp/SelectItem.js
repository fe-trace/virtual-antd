import React, { useContext, useCallback } from 'react';
import cn from 'classnames';
import { Checkbox, Icon } from 'antd';
import ConfigContext from './../context/config';
import { nodeStatus } from './constant.js';
import "./SelectItem.less";

function Dropdown(props) {
    const config = useContext(ConfigContext);
    const { data } = props;
    const status = config.expandStatus[data.key];
    const checkStatus = config.checkStatus[data.key] || {};
    const cls = cn({
        'sm-select-item': true
    });
    const itemCls = cn({
        'select-item': true,
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

    return (
        <div 
            className={cls}
            style={{ paddingLeft: data.level * 18 }}
        >
            <span className="ic-expand">
                { (data.children && data.children.length) && (
                    status === nodeStatus.fold && (
                        <Icon 
                            type="minus-circle" 
                            onClick={ handleUnFold } 
                        />
                    ) || (
                        <Icon 
                            type="plus-circle" 
                            onClick={ handleFold } 
                        />
                    )
                ) }
            </span>
            <span className={itemCls}>
                {
                    config.checkable && (
                        <span>
                            <Checkbox
                                disabled={ data.disabled }
                                checked={ checkStatus.checked }
                                indeterminate={ checkStatus.indeterminate }
                                onChange={ handleChange } 
                            />
                        </span>
                    )
                }
                <span className="text">{ data.label }</span>
            </span>
        </div>
    );
}
export default Dropdown;
import React, { useContext } from 'react';
import cn from 'classnames';
import { Checkbox, Icon } from 'antd';
import ConfigContext from './../context/config';
import "./SelectItem.less";

function Dropdown(props) {
    const config = useContext(ConfigContext);
    const cls = cn({
        'sm-select-item': true
    });

    return (
        <div 
            className={cls}
        >
            <span className="ic-expand">
                {/* <Icon type="minus-circle" /> */}
                <Icon type="plus-square" />
                {/* <Icon type="loading" /> */}
            </span>
            <span className="select-item">
                {
                    config.checkable && (
                        <span className="ic-checkbox">
                            <Checkbox />
                        </span>
                    )
                }
                <span className="text">内容</span>
            </span>
        </div>
    );
}
export default Dropdown;
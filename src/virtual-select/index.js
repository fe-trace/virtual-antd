import React, { memo } from 'react';
import DropDown from './../drop-down/index.js';
import VirtualTree from './../virtual-tree/index.js'

function VirtaulSelect(props) {
    const { onChange, closeDropPanel } = props;
    const newProps = { ...props };

    newProps.onChange = function(data) {
        props.single && closeDropPanel && closeDropPanel();
        onChange && onChange(data);
    };
    delete newProps.closeDropPanel;
    return (
        <VirtualTree 
            { ...newProps }
        />
    );
}

export default memo(function(props) {
    return (
        <div className="sm-vselect">
            <DropDown>
                <VirtaulSelect {...props} />
            </DropDown>
        </div>
    );
});
import React, { memo, useState } from 'react';
import DropDown from './../drop-down/index.js';
import VirtualTree from './../virtual-tree/index.js'

function VirtaulSelect(props) {
    const { onChange, closeDropPanel } = props;
    const newProps = { ...props };

    newProps.onChange = function(data) {
        props.single && closeDropPanel && closeDropPanel();
        props.handleSetLabel(data);
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
    const [ labels, setLabels ] = useState(function() {
        return {
            list: [],
            keys: []
        };
    });
    const [ removeKeys, setRemoveKeys ] = useState(function() {
        return []
    });
    const handleSetLabel = function(labelData) {
        setLabels(labelData);
    };
    const removeLabel = function(keyList) {
        setRemoveKeys(keyList);
    };

    return (
        <div className="sm-vselect">
            <DropDown
                labels={labels}
                single={props.single}
                allowClear={props.allowClear}
                placeholder={props.placeholder}
                maxTagCount={props.maxTagCount || 1}
                removeLabel={removeLabel}
            >
                <VirtaulSelect 
                    {...props}
                    _checkKeys={removeKeys}
                    handleSetLabel={handleSetLabel}
                />
            </DropDown>
        </div>
    );
});
import React, { memo, useState } from 'react';
import DropDown from './../drop-down/index.js';
import VirtualTree from './../virtual-tree/index.js'

function VirtaulSelect(props) {
    const { onChange, closeDropPanel } = props;
    const newProps = { ...props };

    newProps.onChange = function(keys, list) {
        props.single && closeDropPanel && closeDropPanel();
        props.handleSetLabel(list);
        onChange && onChange(keys);
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
        return [];
    });
    const [ value, setValue ] = useState(function() {
        return props.value || [];
    });
    const handleSetLabel = function(labelData) {
        setLabels(labelData);
    };
    const removeLabel = function(keyList) {
        for(let len=labels.length,i=len-1; i>=0; i--) {
            const label = labels[i];

            if(!keyList.includes(label.key)) {
                labels.splice(i, 1);
            }
        }
        setLabels([...labels]);
        setValue(keyList);
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
                    value={value}
                    handleSetLabel={handleSetLabel}
                />
            </DropDown>
        </div>
    );
});
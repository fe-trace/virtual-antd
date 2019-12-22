import React from 'react';
import DropDown from './../drop-down/index.js';
import VirtualTree from './../virtual-tree/index.js'

function VirtaulSelect(props) {
    return (
        <VirtualTree 
            { ...props }
        />
    );
}

export default function(props) {
    return (
        <div className="sm-vselect">
            <DropDown>
                <VirtaulSelect {...props} />
            </DropDown>
        </div>
    );
}
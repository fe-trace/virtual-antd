import React, { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';
import Selector from './comp/Selector.js';
import Dropdown from './comp/Dropdown.js';
import VirtualList from './comp/VirtualList.js';
import ConfigContext from './context/config';

const data = new Array(100).fill(0).map(function(item, index) {
    return {
        key: `p-${index}`,
        label: `parent-${index}`
    }
});
data.map(function(item, index) {
    item.children = new Array(1000).fill(0).map(function(item, index) {
        return {
            key: `c-${index}`,
            label: `children-${index}`
        }
    });
});
function treeToList(data) {
    const list = [];
    const source = data.map(item => ({
        ...item,
        level: 0
    }));

    while(source.length) {
        const node = source.shift();

        list.push(node);
        if(node.children && node.children.length) {
            const children = node.children.map(item => ({
                ...item,
                level: node.level + 1
            }));
            source.splice(0, 0, ...children);
        }
    }
    return list;
};
function treeToListLoop(data, list=[], level=0) {
    for(let i=0,len=data.length; i<len; i++) {
        const item = data[i];

        list.push({
            ...item,
            level: level
        });
        if(item.children && item.children.length) {
            treeToListLoop(item.children, list, level+1);
        }
    }
    return list;
}


console.time("start")
console.log(treeToListLoop(data));
console.timeEnd("start");
// console.time("start")
// console.log(treeToList(data));
// console.timeEnd("start");
function Layout(props) {
    const [ list, setList] = useState(function() {
        return data;
    });
    const [ checkList, setCheckList ] = useState([]);
    const [ expandList, setExpandList ] = useState([]);
    const [ visible, setVisible ] = useState(false);
    const config = {
        width: "200px",
        allowClear: false,
        showExpander: true,
        checkable: true,
        visible: visible
    };
    const onToggle = function(state) {
        setVisible(state != void 0 ? state : !visible);
    };
    const closeDropPanel = useCallback(function() {
        setVisible(false);
    }, []);
    
    useEffect(function() {
        document.addEventListener("click", closeDropPanel);
        return function() {
            document.removeEventListener(closeDropPanel);
        };
    }, []);

    return (
        <div onClick={(e) => {e.nativeEvent.stopImmediatePropagation()}}>
            <ConfigContext.Provider value={config}>
                <Selector 
                    onToggle={onToggle}
                />
                { 
                    visible && (
                        <Dropdown>
                            <VirtualList
                                list={list}
                            />
                        </Dropdown>
                    )
                }
            </ConfigContext.Provider>
        </div>
    );
}
render(<Layout />, document.body);
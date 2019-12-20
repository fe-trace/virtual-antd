import React, { useState } from 'react';
import { render } from 'react-dom';
import VirtualSelect from './virtual-tree/index.js';
import DropDown from './drop-down/index.js';

const data = new Array(10).fill(0).map(function(item, index) {
    return {
        key: `g-${index}`,
        label: `grande-${index}`
    }
});
data.map(function(item, gIndex) {
    // item.children = new Array(10).fill(0).map(function(item, index) {
    //     return {
    //         key: `p-${gIndex}-${index}`,
    //         label: `parent-${index}`
    //     }
    // });
    // item.children.map(function(item, pIndex) {
    //     item.children = new Array(10).fill(0).map(function(item, index) {
    //         return {
    //             key: `c-${gIndex}-${pIndex}-${index}`,
    //             label: `children-${index}`
    //         }
    //     });
    // });
});
function Layout(props) {
    const [ list, setData ] = useState(data);
    function loadData(node) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                if(/^p/.test(node.key) && false) {

                } else {
                    node.dataRef.children = new Array(10).fill(0).map(function(item, index) {
                        return {
                            key: `p-${node.key}-${index}`,
                            label: `parent-${index}`
                        }
                    });
                }
                setData([...list]);
                resolve();
            }, 1000);
        });
    }
    return (
        // <VirtualSelect 
        //     data={list} 
        //     checkable={true}
        //     loadData={loadData} 
        // />
        <div style={{ margin: '20px', width: '200px' }}>
            <DropDown>
                <div>abc</div>
            </DropDown>
        </div>
    );
}

render(<Layout />, document.body);
import React, { useState } from 'react';
import { render } from 'react-dom';
import { Input } from 'antd';
import VirtualTree from './virtual-tree/index.js';
import DropDown from './drop-down/index.js';
import VirtualSelect from './virtual-select/index.js';

const data = new Array(100).fill(0).map(function(item, index) {
    return {
        key: `g-${index}`,
        label: `grande-${index}`,
        // selectable: false
        // disabled: true
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
    const [ text, setText ] = useState("");
    const handleInput = function(e) {
        setText(e.target.value);
    };
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
            }, 500);
        });
    }
    
    return (
        <div style={{ margin: '20px', width: '300px', height: '400px', border: '1px solid #f1f1f1' }}>
            {/* <Input onChange={handleInput} /> */}
            {/* <VirtualTree 
                data={list} 
                // single={true}
                cascade={true}
                checkable={true}
                loadData={loadData} 
                onChange={(data) => console.log(data)}
            /> */}
            {/* <DropDown>
                <div>abc</div>
            </DropDown> */}
            <VirtualSelect 
                data={list}
                // single={true}
                cascade={true}
                checkable={true}
                loadData={loadData}
                onChange={(data) => console.log(data)}
            />
        </div>
    );
}

render(<Layout />, document.body);
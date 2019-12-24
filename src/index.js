// import React, { useState } from 'react';
// import { render } from 'react-dom';
// import { Input } from 'antd';
// import VirtualTree from './virtual-tree/index.js';
// import DropDown from './drop-down/index.js';
// import VirtualSelect from './virtual-select/index.js';

// const data = new Array(100).fill(0).map(function(item, index) {
//     return {
//         key: `g-${index}`,
//         label: `grande-${index}`,
//         // selectable: false
//         // disabled: true
//     }
// });
// data.map(function(item, gIndex) {
//     // item.children = new Array(10).fill(0).map(function(item, index) {
//     //     return {
//     //         key: `p-${gIndex}-${index}`,
//     //         label: `parent-${index}`
//     //     }
//     // });
//     // item.children.map(function(item, pIndex) {
//     //     item.children = new Array(10).fill(0).map(function(item, index) {
//     //         return {
//     //             key: `c-${gIndex}-${pIndex}-${index}`,
//     //             label: `children-${index}`
//     //         }
//     //     });
//     // });
// });
// function Layout(props) {
//     const [ list, setData ] = useState(data);
//     const [ text, setText ] = useState("");
//     const handleInput = function(e) {
//         setText(e.target.value);
//     };
//     function loadData(node) {
//         return new Promise(function(resolve, reject) {
//             setTimeout(function() {
//                 if(/^p/.test(node.key) && false) {

//                 } else {
//                     node.dataRef.children = new Array(10).fill(0).map(function(item, index) {
//                         return {
//                             key: `p-${node.key}-${index}`,
//                             label: `parent-${index}`
//                         }
//                     });
//                 }
//                 setData([...list]);
//                 resolve();
//             }, 500);
//         });
//     }
    
//     return (
//         <div style={{ margin: '20px', width: '300px', height: '400px', border: '1px solid #f1f1f1' }}>
//             {/* <Input onChange={handleInput} /> */}
//             {/* <VirtualTree 
//                 data={list} 
//                 single={true}
//                 cascade={true}
//                 // checkable={true}
//                 loadData={loadData} 
//                 onChange={(data) => console.log(data)}
//             /> */}
//             {/* <DropDown>
//                 <div>abc</div>
//             </DropDown> */}
//             <VirtualSelect 
//                 data={list}
//                 // single={true}
//                 cascade={true}
//                 checkable={true}
//                 loadData={loadData}
//                 onChange={(data) => console.log(data)}
//             />
//         </div>
//     );
// }

// render(<Layout />, document.body);

import React, { useState } from 'react';
import { render } from 'react-dom';
import { TreeSelect } from 'antd';

class Demo extends React.Component {
  state = {
    value: undefined,
    treeData: [
        { 
            id: 1, pId: 0, value: '1', title: 'Expand to load', 
            children: [{
                id: 11, pId: 1, value: '11', title: '11 to load',
            }] 
        },
        { id: 2, pId: 0, value: '2', title: 'Expand to load' },
        { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
    ],
  };

  genTreeNode = (parentId, isLeaf = false) => {
    const random = Math.random()
      .toString(36)
      .substring(2, 6);
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
    };
  };

  onLoadData = treeNode =>
    new Promise(resolve => {
      const { id } = treeNode.props;
      setTimeout(() => {
        this.setState({
          treeData: this.state.treeData.concat([
            this.genTreeNode(id, false),
            this.genTreeNode(id, true),
          ]),
        });
        resolve();
      }, 300);
    });

  onChange = value => {
    console.log(value);
    this.setState({ value });
  };

  render() {
    const { treeData } = this.state;
    return (
      <TreeSelect
        treeDataSimpleMode
        style={{ width: '100%' }}
        value={['11']}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select"
        onChange={this.onChange}
        loadData={this.onLoadData}
        treeData={treeData}
      />
    );
  }
}

render(<Demo />, document.body);
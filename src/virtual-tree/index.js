import React, { PureComponent } from 'react';
import VirtualList from './comp/VirtualList.js';
import ConfigContext from './context/config';
import { nodeStatus, loadStatus } from './comp/constant.js';
import './Index.less';

function treeToList(data, expandStatus) {
    const flatMap = {};
    const list = [];
    const source = data.map(item => ({
        ...item,
        level: 0,
        parent: null,
        dataRef: item
    }));
    flatMap[0] = [...source];
    
    while(source.length) {
        const node = source.shift();

        list.push(node);
        // 节点有子节点 && 节点展开，子节点需要展示
        if(node.children && node.children.length && expandStatus[node.key] === nodeStatus.fold) {
            const level = node.level + 1;
            const children = node.children.map(item => ({
                ...item,
                level: level,
                parent: node.key,
                dataRef: item
            }));

            flatMap[level] = flatMap[level] || [];
            flatMap[level].push(...children);
            source.splice(0, 0, ...children);
        }
    }
    return [ list, flatMap ];
}
function flatTree(data) {
    const allList = [];
    const source = data.map(item => ({
        ...item,
        level: 0,
        parent: null
    }));
    const list = [...source];

    while(list.length) {
        const node = list.shift();

        allList.push(node);
        // 节点有子节点 && 节点展开，子节点需要展示
        if(node.children && node.children.length) {
            const children = node.children.map(item => ({
                ...item,
                level: node.level + 1,
                parent: node.key,
            }));

            list.splice(0, 0, ...children);
        }
    }
    return allList;
}
function loopChildNode(node, checkStatus, checked) {
    // 递归子节点设置状态
    const list = [node];

    while(list.length) {
        const item = list.pop();
        
        if(checked) {
            checkStatus[item.key] = {
                checked: checked
            };
        } else {
            delete checkStatus[item.key];
        }
        if(item.children && item.children.length) {
            list.push(...item.children);
        }
    }
}
function loopParentNode(node, checkStatus, checked, flatMap) {
    // 递归父节点设置状态
    const pId = node.parent;
    if(!pId) {
        // 没有父节点
        return ;
    }
    // 拿到父节点的层级
    const level = node.level - 1;
    const nodes = flatMap[level];
    let pNode = null;
    // 查找父节点
    for(let i=0,len=nodes.length; i<len; i++) {
        if(nodes[i].key === pId) {
            pNode = nodes[i];
            break; 
        }
    }
    if(!pNode) {
        return;
    }
    const bNodes = pNode.children;
    let checkAll = true, hasCheck = false;
    // 判断所有子节点是否全选或者存在半选
    for(let i=0,len=bNodes.length; i<len; i++) {
        const bNode = bNodes[i];
        const state = checkStatus[bNode.key];

        // 节点未选中
        if(!state) {
            checkAll = false;
        // 节点部分选中
        } else if(state.indeterminate) {
            checkAll = false;
            hasCheck = true;
        } else if(state.checked) {
            hasCheck = true;
        }
    }
    if(checked) {
        if(checkAll) {
            checkStatus[pNode.key] = {
                checked: true
            };
        } else {
            checkStatus[pNode.key] = {
                indeterminate: true
            };
        }
    } else {
        if(hasCheck) {
            checkStatus[pNode.key] = {
                indeterminate: true
            };
        } else {
            delete checkStatus[pNode.key];
        }
    }
    // 设置父节点的父节点选中效果
    loopParentNode(pNode, checkStatus, checked, flatMap);
}
function handleNodeStatus(node, checkStatus, checked, cascade, flatMap) {
    /**
     * 处理节点的选中状态
     * 选中节点：
     * 1.节点有父节点：
     *  a.递归节点的父节点设置节点选中或半选状态
     *  b.递归节点的子节点设置节点选中状态
     * 2.节点无父节点：
     *  a.递归节点的子节点设置节点选中状态
     * 取消选中节点：
     * 1.节点有父节点：
     *  a.递归节点的父节点设置节点不选中或则半选状态
     *  b.递归节点的子节点设置节点不选中状态
     * 2.节点无父节点：
     *  a.递归节点的子节点设置节点不选中状态
    */
    if(cascade) {
        loopChildNode(node, checkStatus, checked);
        loopParentNode(node, checkStatus, checked, flatMap);
    } else {
        if(checked) {
            checkStatus[node.key] = {
                checked: checked
            };
        } else {
            delete checkStatus[node.key];
        }
    }
    return checkStatus;
}
function handleSelectData(checkStatus, list) {
    const data = {
        // 选中节点展示项列表
        list: [],
        // 选中节点取值列表
        keys: [],
    };
    
    for(let i=0,len=list.length; i<len; i++) {
        const item = list[i];
        const status = checkStatus[item.key];
        const pState = checkStatus[item.parent];

        if(status && status.checked) {
            // 没有父节点 || 父节不是全选
            (!pState || (pState && !pState.checked)) && data.list.push({
                label: item.label,
                key: item.key
            });
            data.keys.push(item.key);
        }
    }
    return data;
}
function findNode(allList, key) {
    let target = null;

    for(let i=0,len=allList.length; i<len; i++) {
        const node = allList[i];

        if(node.key === key) {
            target = node;
            break;
        }
    }
    return target;
}
function setCheckStatus(keys, checked, cascade, flatMap, allList) {
    const checkStatus = {};

    if(!keys || keys.length === 0) {
        return checkStatus;
    }
    for(let i=0,len=keys.length; i<len; i++) {
        const key = keys[i];
        const node = findNode(allList, key);

        if(node) {
            handleNodeStatus(node, checkStatus, checked, cascade, flatMap);
        }
    }
    return checkStatus;
}
class VirtualTree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 展示数据列表
            list: [],
            // 扁平数据列表
            allList: [],
            // 数据扁平集合（按层级分类）
            flatData: {},
            // 节点选中状态
            checkStatus: {},
            // 内部属性，用于移除节点选中状态
            _checkKeys: [],
            // 节点加载状态
            loadedStatus: {},
            // 节点展开状态
            expandStatus: {},
            // 异步加载
            asyncLoad: !!props.loadData,
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.value != prevState.value) {
            return {
                checkStatus: setCheckStatus(nextProps.value, true, nextProps.cascade, prevState.flatData, prevState.allList),
                value: nextProps.value
            }
        }
        return null;
    }
    toggleLoadingState = (node, state) => {
        const { loadedStatus: status } = this.state;
        
        if(state) {
            status[node.key] = state;
        } else {
            delete status[node.key];
        }
        this.setState({
            loadedStatus: {...status}
        });
    };
    asyncLoadNode = (node) => {
        const { loadData } = this.props;
        this.toggleLoadingState(node, loadStatus.loading);
        loadData && loadData(node).then(() => {
            this.toggleLoadingState(node, loadStatus.loaded);
            this.handleSelectNode(node.dataRef);
        }).catch(e => {
            this.toggleLoadingState(node, false);
        });
    };
    expandNode = (node, status) => {
        // 同步加载
        // 展开节点：设置节点展开样式，添加展开节点对应的子节点到显示列表中
        // 闭合节点：设置节点闭合样式，在显示列表中移除闭合几点对应的子节点
        // 异步加载
        // 展开加点：加载节点下子节点，设置节点展开样式，添加展开节点对应的子节点到显示列表中
        // 闭合节点：设置节点闭合样式，在显示列表中移除闭合几点对应的子节点
        const { expandStatus, loadedStatus, asyncLoad } = this.state;

        if(status === nodeStatus.unfold) {
            delete expandStatus[node.key];
        } else {
            expandStatus[node.key] = status;
        }
        this.setState({
            expandStatus: {...expandStatus}
        });
        // 异步加载节点 && 节点未加载成功
        if(asyncLoad && loadedStatus[node.key] != loadStatus.loaded) {
            this.asyncLoadNode(node);
        } else {
            this.handleSelectNode(node);
        }
    };
    handleSelectNode = (node) => {
        const { checkStatus } = this.state;
        const { single } = this.props;
        const state = checkStatus[node.key];

        this.initList();
        // 单选时不需要级联操作节点
        if(single) {
            return;
        }
        // 当前展开的节点选中，递归选中其子节点
        if(state && state.checked) {
            this.selectNode(node, true, true);
        }
    };
    selectNode = (node, checked, isHandle) => {
        // isHandle 手动触发
        const { allList, checkStatus, expandStatus, flatData } = this.state;
        const { cascade, single, onChange } = this.props;
        let newCheckStatus = {};
        if(single) {
            if(checked) {
                newCheckStatus[node.key] = {
                    checked: checked
                };
            }
        } else {
            newCheckStatus = handleNodeStatus(node, checkStatus, checked, cascade, flatData);
        }
        this.setState({
            checkStatus: {...newCheckStatus}
        });
        
        // 手动触发 && 节点闭合 => 不触发 onChange 事件
        if(isHandle && !expandStatus[node.key]) {
            return
        }
        const data = handleSelectData(newCheckStatus, allList);
        onChange && onChange(data.keys, data.list);
    };
    initList = () => {
        const { data } = this.props;
        const { expandStatus } = this.state;
        const [ list, flatData ] = treeToList(data, expandStatus);
        const allList = flatTree(data);
        
        this.setState({
            list: list,
            allList: allList,
            flatData: flatData
        });
    }
    componentDidMount() {
        this.initList();
    }
    render() {
        const { list, asyncLoad, checkStatus, expandStatus, loadedStatus } = this.state;
        const { checkable, cascade } = this.props;
        const config = {
            cascade: cascade,
            checkable: checkable,
            checkStatus: checkStatus,
            expandStatus: expandStatus,
            loadedStatus: loadedStatus,
            expandNode: this.expandNode,
            selectNode: this.selectNode,
            asyncLoad: asyncLoad
        };
    
        return (
            <div className="sm-vtree">
                <ConfigContext.Provider value={config}>
                    <VirtualList
                        list={list}
                    />
                </ConfigContext.Provider>
            </div>
        );
    }
}

export default VirtualTree;
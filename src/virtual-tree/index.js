import React, { useState, useEffect, useCallback } from 'react';
import { Input } from 'antd';
import Selector from './comp/Selector.js';
import Dropdown from './comp/Dropdown.js';
import VirtualList from './comp/VirtualList.js';
import ConfigContext from './context/config';
import { nodeStatus, loadStatus } from './comp/constant.js';
import './Index.less';

// 数据扁平集合，根据节点等级保存数据
let flatMap = {};
function treeToList(data, expandStatus) {
    flatMap = {};
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
        if(node.children && node.children.length && expandStatus[node.key] === nodeStatus.fold) {
            const level = node.level + 1;
            const children = node.children.map(item => ({
                ...item,
                level: level,
                parent: node.key,
                dataRef: item
            }));
            flatMap[level] = flatMap[level] || [];
            flatMap[level].push(...Object.assign(children));
            source.splice(0, 0, ...children);
        }
    }
    return list;
}
function loopChildNode(node, checkStatus, checked, checkStrictly) {
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
function loopParentNode(node, checkStatus, checked, checkStrictly) {
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
                checked: true,
                indeterminate: true
            };
        }
    } else {
        if(hasCheck) {
            checkStatus[pNode.key] = {
                checked: true,
                indeterminate: true
            };
        } else {
            delete checkStatus[pNode.key];
        }
    }
    // 设置父节点的父节点选中效果
    loopParentNode(pNode, checkStatus, checked);
}
function handleNodeStatus(node, checkStatus, checked, checkStrictly) {
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
    loopChildNode(node, checkStatus, checked, checkStrictly);
    loopParentNode(node, checkStatus, checked, checkStrictly)
    return checkStatus;
}
export default function VirtualSelect(props) {
    const [ checkStatus, setCheckStatus ] = useState({});
    const [ expandStatus, setExpandStatus ] = useState({});
    const [ loadedStatus, setLoadedStatus ] = useState({});
    const [ list, setList] = useState([]);
    const [ visible, setVisible ] = useState(false);
    const { data, loadData, checkable=false } = props;
    const asyncLoad = !!loadData;
    const onToggle = function(state) {
        setVisible(state != void 0 ? state : !visible);
    };
    const closeDropPanel = useCallback(function() {
        setVisible(false);
    }, []);
    const toggleLoadingState = function(node, state) {
        if(state) {
            loadedStatus[node.key] = state;
        } else {
            delete loadedStatus[node.key];
        }
        setLoadedStatus({...loadedStatus});
    };
    const asyncLoadNode = function(node) {
        toggleLoadingState(node, loadStatus.loading);
        loadData && loadData(node).then(() => {
            toggleLoadingState(node, loadStatus.loaded);
            handleSelectNode(node.dataRef);
        }).catch(e => {
            toggleLoadingState(node, false);
        });
    };
    const expandNode = function(node, status) {
        // 同步加载
        // 展开节点：设置节点展开样式，添加展开节点对应的子节点到显示列表中
        // 闭合节点：设置节点闭合样式，在显示列表中移除闭合几点对应的子节点
        // 异步加载
        // 展开加点：加载节点下子节点，设置节点展开样式，添加展开节点对应的子节点到显示列表中
        // 闭合节点：设置节点闭合样式，在显示列表中移除闭合几点对应的子节点
        if(status === nodeStatus.unfold) {
            delete expandStatus[node.key];
        } else {
            expandStatus[node.key] = status;
        }
        setExpandStatus({...expandStatus});
        if(asyncLoad) {
            const status = loadedStatus[node.key];
            if(status === nodeStatus.unfold || status === loadStatus.loaded) {
                return;
            }
            asyncLoadNode(node);
        } else {
            handleSelectNode(node);
        }
    };
    const handleSelectNode = function(node) {
        // 非 checkbox 模式不递归记录选中状态
        if(!checkable) {
            return
        }
        const state = checkStatus[node.key];

        if(!state) {
            selectNode(node, false);
        } else if(state.checked && !state.indeterminate) {
            selectNode(node, true);
        }
    };
    const selectNode = function(node, checked) {
        const newCheckStatus = handleNodeStatus(node, checkStatus, checked);

        setCheckStatus({...newCheckStatus});
    };
    const config = {
        width: "400px",
        allowClear: false,
        showExpander: true,
        checkable: checkable,
        visible: visible,
        checkStatus: checkStatus,
        expandStatus: expandStatus,
        loadedStatus: loadedStatus,
        expandNode: expandNode,
        selectNode: selectNode,
        asyncLoad: asyncLoad
    };

    useEffect(function() {
        // 从展示列表中添加或移除对应节点的子节点
        setList(treeToList(data, expandStatus));
    }, [expandStatus, data]);
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
                            <div className="search-area">
                                <Input.Search />
                            </div>
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
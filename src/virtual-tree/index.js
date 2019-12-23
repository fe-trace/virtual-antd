import React, { memo, useState, useEffect, useRef } from 'react';
import VirtualList from './comp/VirtualList.js';
import ConfigContext from './context/config';
import { nodeStatus, loadStatus } from './comp/constant.js';
import './Index.less';

function treeToList(data, expandStatus, flatData) {
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
    flatData.current = flatMap;
    return list;
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
    console.log("checkStatus: ", checkStatus);
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
    const keys = Object.keys(checkStatus);
    const data = {
        // 选中节点展示项列表
        list: [],
        // 选中节点取值列表
        keys: [],
    };
    for(let i=0,len=keys.length; i<len; i++) {
        const key = keys[i];
        const item = checkStatus[key];

        // if(item.checked) {
        //     data.total = data.total + 1;
        // }
    }
    for(let i=0,len=list.length; i<len; i++) {
        const item = list[i];
        const status = checkStatus[item.key];
        const pState = checkStatus[item.parent];

        if(status && status.checked) {
            // 没有父节点 || 父节不是全选
            (!pState || !pState.checked) && data.list.push({
                key: item.key,
                label: item.label
            });
        }
    }
    return data;
}
function VirtualTree(props) {
    const flatData = useRef({}); 
    const loadedStatus = useRef({});
    const [ checkStatus, setCheckStatus ] = useState({});
    const [ expandStatus, setExpandStatus ] = useState({});
    const [ list, setList ] = useState([]);
    const { data, loadData, checkable, cascade, single, onChange } = props;
    const asyncLoad = !!loadData;
    const toggleLoadingState = function(node, state) {
        const status = loadedStatus.current;
        if(state) {
            status[node.key] = state;
        } else {
            delete status[node.key];
        }
        loadedStatus.current = {...status};
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
        // 异步加载节点 && 节点未加载成功
        if(asyncLoad && loadedStatus.current[node.key] != loadStatus.loaded) {
            asyncLoadNode(node);
        } else {
            handleSelectNode(node);
        }
    };
    const handleSelectNode = function(node) {
        const state = checkStatus[node.key];

        // 单选时不需要级联操作节点
        if(single) {
            return;
        }

        // 当前展开的节点选中，递归选中其子节点
        if(state && state.checked) {
            selectNode(node, true, true);
        }
    };
    const selectNode = function(node, checked, isHandle) {
        // isHandle：手动触发选择事件 
        let newCheckStatus = {};
        if(single) {
            if(checked) {
                newCheckStatus[node.key] = {
                    checked: checked
                };
            }
            setCheckStatus({...newCheckStatus});
        } else {
            newCheckStatus = handleNodeStatus(node, checkStatus, checked, cascade, flatData.current);

            setCheckStatus({...newCheckStatus});
        }
        // 选中时才触发，懒加载回调时不触发
        !isHandle && onChange && onChange(handleSelectData(newCheckStatus, list));
    };
    const config = {
        cascade: cascade,
        checkable: checkable,
        checkStatus: checkStatus,
        expandStatus: expandStatus,
        loadedStatus: loadedStatus.current,
        expandNode: expandNode,
        selectNode: selectNode,
        asyncLoad: asyncLoad
    };

    useEffect(function() {
        // 从展示列表中添加或移除对应节点的子节点
        console.time("start");
        const list = treeToList(data, expandStatus, flatData);
        console.timeEnd("start");
        setList(list);
    }, [expandStatus, data]);

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

export default memo(VirtualTree);
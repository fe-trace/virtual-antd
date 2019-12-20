import React, { useCallback } from 'react';
import cn from 'classnames';
import { AutoSizer, List as VList } from 'react-virtualized';
import SelectItem from './SelectItem.js';
import 'react-virtualized/styles.css';
import "./VirtualList.less";

function VirtualList(props) {
    const cls = cn({
        'sm-virtual-list': true
    });
    const { list } = props;
    const _rowRenderer = useCallback(function({ index, key, style }) {
        return (
            <div style={style} key={key} className="list-item">
                <SelectItem 
                    index={index} 
                    data={list[index]} 
                />
            </div>
        );
    }, [list]);

    return (
        <div 
            className={cls}
            style={{ height: "200px" }}
        >
            <AutoSizer>
                {({height, width}) => (
                    <VList
                        height={height}
                        width={width}
                        rowHeight={28}
                        rowCount={list.length}
                        rowRenderer={_rowRenderer}
                    />
                )}
            </AutoSizer>
        </div>
    );
}
export default VirtualList;
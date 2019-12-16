import React from 'react';
import cn from 'classnames';
import { AutoSizer, List as VList } from 'react-virtualized';
import SelectItem from './SelectItem.js';
import 'react-virtualized/styles.css';
import "./VirtualList.less";

const list = new Array(10000).fill("0").map(function(item, index) {
    return `row-${index}`;
});
function _rowRenderer({ index, key, style }) {
    return (
        <div style={style} key={key}>
            <SelectItem index={index} />
        </div>
    );
}
function VirtualList(props) {
    const cls = cn({
        'sm-virtual-list': true
    });
    return (
        <div 
            className={cls}
            style={{ height: "200px" }}
        >
            <AutoSizer>
                {({height, width}) => (
                    <VList
                        height={height}
                        rowCount={10000}
                        rowHeight={26}
                        rowRenderer={_rowRenderer}
                        width={width}
                    />
                )}
            </AutoSizer>
        </div>
    );
}
export default VirtualList;
import React from 'react';
import { render } from 'react-dom';
import Selector from './comp/Selector.js';

function Layout(props) {
    return (
        <Selector 
            width="200px"
            wrapClassName={"abc"}
        />
    );
}
render(<Layout />, document.body);
import React from 'react';
import Square from "../Square";

import Row from 'react-bootstrap/Row';

const styles = {
    row: {
        flex: 1,
        display: "flex",
        width: "100%",
        margin: "0"
    },
};


function GridRow(props) {
    const squares = Array.from({ length: props.size }, (_, i) => i).map((_, i) => (
        <Square key={i} content={props.content[i]} results={props.results[i]}/>
    ));
  
    return <Row style={styles.row}>{squares}</Row>;
}

export default GridRow



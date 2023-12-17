// Square.js
import React, { useState, useRef, useEffect } from 'react';

const styles = {
  square: {
    flex: 1,
    border: "2px solid rgb(58, 58, 60)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: "1/1",
    margin: "0.5%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  good: {
    backgroundColor: "#538D4E",
    color: "white",
    border: "2px solid #538D4E"
  },
  okay: {
    backgroundColor: "#B59F3B",
    color: "white",
    border: "2px solid #B59F3B"
  },
  bad: {
    backgroundColor: "#3A3A3C",
    color: "white",
    border: "2px solid #3A3A3C"
  },
  empty: {
    backgroundColor: "transparent" 
  }
};

function Square(props) {
  const squareRef = useRef(null);
  const [fontSize, setFontSize] = useState('16px'); // Initial value

  useEffect(() => {
    if (squareRef.current) {
      // Set font size to be 10% of the square's width
      setFontSize(`${squareRef.current.offsetWidth * 0.25}px`);
    }
  }, [squareRef.current]);

  // Determine the specific style based on results
  let resultStyle = {};
  switch (props.results) {
    case "good":
      resultStyle = styles.good;
      break;
    case "okay":
      resultStyle = styles.okay;
      break;
    case "bad":
      resultStyle = styles.bad;
      break;
    case "":
      resultStyle = styles.empty;
      break;
    default:
      break;
  }

  return (
    <div ref={squareRef} style={{ ...styles.square, ...resultStyle, fontSize: fontSize }}>
      {props.content}
    </div>
  );
}

export default Square;
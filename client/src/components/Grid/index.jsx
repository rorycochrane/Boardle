import React, { useState, useContext, useEffect } from 'react';

import GridRow from '../GridRow';
import { MovesContext, GameContext } from '../../Context/index.tsx';

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        aspectRatio: "1x1",
        position: "relative",
        overflow: "hidden"
    },
};

function Grid({ puzzle, gameID }) {
    const size = puzzle.moves.length;
    const [content, setContent] = useState(Array(size*size).fill(""));
    const [results, setResults] = useState(Array(size*size).fill(""));
    
    const { moves, dispatch } = useContext(MovesContext);
    const { easy, medium, hard, expert, other } = useContext(GameContext);
    

    useEffect(() => {
        dispatch({ type: 'SET_SIZE', size: size }); 
        setContent(eval(gameID).guesses);
        setResults(eval(gameID).results);
      }, []); 
    
    useEffect(() => {
        const emptyIndex = eval(gameID).guesses.indexOf("");
        if (emptyIndex !== -1) {
          setContent(eval(gameID).guesses.slice(0, emptyIndex).concat(moves));
        } else {
          setContent(eval(gameID).guesses);
        }
        setResults(eval(gameID).results);
    }, [eval(gameID), moves]);
  
    return (
      <div style={styles.container}>
        {Array.from({ length: size }, (_, i) => i).map((_, i) => (
          <GridRow key={i} size={size} content={content.slice(i*size, (i+1)*size)} results={results.slice(i*size, (i+1)*size)}/>
        ))}
      </div>
    );
  }
  
  export default Grid;
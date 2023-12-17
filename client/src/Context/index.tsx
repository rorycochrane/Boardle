import { createContext, useReducer, Dispatch, ReactNode, useEffect, useState, useContext } from "react";

// Puzzle state interface
interface PuzzleState {
  guesses: string[];
  results: string[];
  solved: boolean;
  ID: number;
  streak: number;
  totalGames: number;
  wins: number;
  prevSolvedPuzzle: number;
}

// Game state interface
interface GameState {
  easy: PuzzleState;
  medium: PuzzleState;
  hard: PuzzleState;
  expert: PuzzleState;
  other: PuzzleState;
}

// Moves state interface
interface MovesState {
  moves: string[];
}

// Game and Moves action interface
type GameStateAction = 
    |{
        type: 'UPDATE_PUZZLE';
        difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'other';
        newState: Partial<PuzzleState>;
    }
    | {
        type: 'SUBMIT_MOVES';
        difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'other';
        moves: Array<string>;
        solution: Array<string>;
};

type MovesAction =
    | {
        type: 'ADD_MOVE';
        move: string;
    }
    | {
        type: 'UNDO_MOVE';
    }
    | {
        type: 'SET_SIZE';
        size: number;
};

// Initial game state
const initialGameState: GameState = {
  easy: { guesses: Array(3*3).fill(""), results: Array(3*3).fill(""), solved: false, ID: -1, streak: 0, totalGames: 0, wins: 0, prevSolvedPuzzle: -1 },
  medium: { guesses: Array(5*5).fill(""), results: Array(5*5).fill(""), solved: false, ID: -1, streak: 0, totalGames: 0, wins: 0, prevSolvedPuzzle: -1 },
  hard: { guesses: Array(7*7).fill(""), results: Array(7*7).fill(""), solved: false, ID: -1, streak: 0, totalGames: 0, wins: 0, prevSolvedPuzzle: -1 },
  expert: { guesses: Array(9*9).fill(""), results: Array(9*9).fill(""), solved: false, ID: -1, streak: 0, totalGames: 0, wins: 0, prevSolvedPuzzle: -1 },
  other: { guesses: [], results: [], solved: false, ID: -1, streak: 0, totalGames: 0, wins: 0, prevSolvedPuzzle: -1 },
};

// Initial moves state
const initialMovesState: MovesState = {
  moves: [],
};

// Game context interface
interface GameContext extends GameState {
  dispatch: Dispatch<GameStateAction>;
}

// Moves context interface
interface MovesContext extends MovesState {
  dispatch: Dispatch<MovesAction>;
}


// Create contexts
const GameContext = createContext<GameContext>(initialGameState as GameContext);
const MovesContext = createContext<MovesContext>(initialMovesState as MovesContext);


function getResult(guesses: string[], solution: string[]) {
  const size = guesses.length;
  const result = Array(size).fill("bad")

  let guessFrequency = {};
  let targetFrequency = {};

  for (let i=0; i<guesses.length; i++) {
    if (guesses[i] === solution[i]){
      result[i] = "good";
    } else {
      guessFrequency[guesses[i]] = (guessFrequency[guesses[i]] || 0) + 1;
      targetFrequency[solution[i]] = (targetFrequency[solution[i]] || 0) + 1;
    }
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] === 'bad' && guessFrequency[guesses[i]] > 0 && targetFrequency[guesses[i]] > 0) {
      result[i] = 'okay';
      guessFrequency[guesses[i]] -= 1;
      targetFrequency[guesses[i]] -= 1;
    }
  }
  return result
}

// Reducer functions
const gameReducer = (state: GameState, action: GameStateAction): GameState => {
  switch (action.type) {
    case 'SUBMIT_MOVES':
      const emptyIndex = state[action.difficulty].guesses.indexOf('');
      if (emptyIndex !== -1) {
        const result = getResult(action.moves, action.solution)
        var solved = false;
        var streak = state[action.difficulty].streak;
        var totalGames = state[action.difficulty].totalGames;
        var wins = state[action.difficulty].wins;
        var prevSolvedPuzzle = state[action.difficulty].prevSolvedPuzzle;
        prevSolvedPuzzle = prevSolvedPuzzle === -1 ? state[action.difficulty].ID-1 : prevSolvedPuzzle;
        
        if (result.every( (i) => {return i==="good"})) {
          solved = true;
          streak = prevSolvedPuzzle === state[action.difficulty].ID-1 ? streak + 1 : 1;
          totalGames = totalGames + 1;
          wins = wins + 1;
          prevSolvedPuzzle = state[action.difficulty].ID;
        }

        var guesses = state[action.difficulty].guesses.slice();
        var results = state[action.difficulty].results.slice();
        guesses.splice(emptyIndex, action.moves.length, ...action.moves);
        results.splice(emptyIndex, action.moves.length, ...result);

        if (guesses.indexOf('') === -1 && solved === false) { 
          solved = true;
          streak = 0;
          totalGames = totalGames + 1;
        }

        return {
          ...state,
          [action.difficulty]: { ...state[action.difficulty], ...{solved: solved, guesses: guesses, results: results, streak: streak, totalGames: totalGames, wins: wins}}
        }
      }
      return { ...state }
    case 'UPDATE_PUZZLE':
      return {
        ...state,
        [action.difficulty]: { ...state[action.difficulty], ...action.newState },
      };
    default:
      return { ...state };
  }
};

const movesReducer = (state: MovesState, action: MovesAction): MovesState => {
    const emptyIndex = state.moves.indexOf('');
    const moves = [ ...state.moves];
    switch (action.type) {
        case 'ADD_MOVE':
            if (emptyIndex !== -1) {
                moves[emptyIndex] = action.move;
            }
            return { ...state, moves: moves };
        case 'UNDO_MOVE':
            if (emptyIndex !== 0) {
                if (emptyIndex === -1) {
                    moves[moves.length-1] = ''
                } else {
                    moves[emptyIndex-1] = '';
                }
            } 
            return { ...state, moves: moves };
        case 'SET_SIZE':
            return { ...state, moves: Array.from({ length: action.size }, () => '') };
        default:
            return { ...state };
    }
};

// Game and Moves providers
const { Provider: GameProvider } = GameContext;
export const GameStateProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const loadStateFromLocalStorage = (): GameState | undefined => {
    const serializedState = localStorage.getItem('gameState');
    
    if (serializedState) {
      try {
        return JSON.parse(serializedState);
      } catch (error) {
        console.error('Error parsing state from localStorage:', error);
      }
    } else {
      // Try to get the old format data from localStorage
      const prevSolvedPuzzle = localStorage.getItem('prevSolvedPuzzle');
      const totalGames = localStorage.getItem('totalGames');
      const wins = localStorage.getItem('wins');
      const streak = localStorage.getItem('streak');
      
      if (prevSolvedPuzzle && totalGames && wins && streak) {
        // Convert older data format to new format
        const convertedState = {
          ...initialGameState,
          normal: {
            ...initialGameState.medium,
            prevSolvedPuzzle: parseInt(prevSolvedPuzzle, 10),
            totalGames: parseInt(totalGames, 10),
            wins: parseInt(wins, 10),
            streak: parseInt(streak, 10)
          }
        };
  
        return convertedState;
      }
    }
  
    return undefined;
  };
  

  const [state, dispatch] = useReducer(gameReducer, loadStateFromLocalStorage() || initialGameState);
  // const [state, dispatch] = useReducer(gameReducer, initialGameState);


  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

  return <GameProvider value={{ ...state, dispatch }}>{props.children}</GameProvider>;
};

const { Provider: MovesProvider } = MovesContext;
export const MovesStateProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const [state, dispatch] = useReducer(movesReducer, initialMovesState);

  return <MovesProvider value={{ ...state, dispatch }}>{props.children}</MovesProvider>;
};


export { GameContext, MovesContext };
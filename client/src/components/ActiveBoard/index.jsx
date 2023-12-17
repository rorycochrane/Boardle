import React, { useState, useContext, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { MovesContext, GameContext } from '../../Context/index.tsx';


function ActiveBoard({ puzzle, gameID }) {
    const size = puzzle.moves.length;
    const orientation = puzzle.fen.split(" ")[1] === 'w' ? 'white' : 'black';
    const [game, setGame] = useState(new Chess(puzzle.fen));
    const [moveFrom, setMoveFrom] = useState("");
    const [moveTo, setMoveTo] = useState(null);
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [moveSquares, setMoveSquares] = useState({});
    const [optionSquares, setOptionSquares] = useState({});

    const { moves, dispatch } = useContext(MovesContext);
    const { easy, medium, hard, expert, other, dispatch: gameDispatch } = useContext(GameContext);
    


    function makeAMove(moveFrom, square, promotion) {
        console.log('Make A Move');
        const gameCopy = new Chess();
        gameCopy.loadPgn(game.pgn());
        const move = gameCopy.move({
            from: moveFrom,
            to: square,
            promotion: promotion,
        });

        if (move === null) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        } else {
            dispatch({ type: 'ADD_MOVE', move: move.san});
        }

        setGame(gameCopy);
        setMoveFrom("");
        setMoveTo(null);
        setShowPromotionDialog(false);
        setOptionSquares({});
        return;
    }


    function getMoveOptions(square) {
        console.log('Get Move Options');
        const moveOptions = game.moves({
          square,
          verbose: true,
        });
        if (moveOptions.length === 0) {
          setOptionSquares({});
          return false;
        }
    
        const newSquares = {};
        moveOptions.map((move) => {
          newSquares[move.to] = {
            background:
              game.get(move.to) &&
              game.get(move.to).color !== game.get(square).color
                ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
            borderRadius: "50%",
          };
          return move;
        });
        newSquares[square] = {
          background: "rgba(255, 255, 0, 0.4)",
        };
        setOptionSquares(newSquares);
        return true;
    }


    function onSquareClick(square) {
        if (moves.indexOf("") === -1) {
          return
        }
        console.log('On Square Click');
        // from square
        if (!moveFrom) {
          const hasMoveOptions = getMoveOptions(square);
          if (hasMoveOptions) setMoveFrom(square);
          return;
        }
    
        // to square
        if (!moveTo) {
          // check if valid move before showing dialog
          const moveOptions = game.moves({
            moveFrom,
            verbose: true,
          });
          const foundMove = moveOptions.find(
            (m) => m.from === moveFrom && m.to === square
          );
          // not a valid move
          if (!foundMove) {
            // check if clicked on new piece
            const hasMoveOptions = getMoveOptions(square);
            // if new piece, setMoveFrom, otherwise clear moveFrom
            setMoveFrom(hasMoveOptions ? square : "");
            return;
          }
    
          // valid move
          setMoveTo(square);
    
          // if promotion move
          if (isPromotion(foundMove)) {
            setShowPromotionDialog(true);
            return;
          }

          makeAMove(moveFrom, square, 'q');
          return;
        }
    }


    function onPromotionPieceSelect(piece) {
        console.log('On Promotion Piece Select');
        // if no piece passed then user has cancelled dialog, don't make move and reset
        if (piece) {
            const promotion = piece[1].toLowerCase() ?? "q"
            makeAMove(moveFrom, moveTo, promotion);
        }
    
        setMoveFrom("");
        setMoveTo(null);
        setShowPromotionDialog(false);
        setOptionSquares({});
        return true;
    }

    function isPromotion(foundMove) {
        console.log('Is Promotion');
        if (
            (foundMove.color === "w" &&
              foundMove.piece === "p" &&
              foundMove.to[1] === "8") ||
            (foundMove.color === "b" &&
              foundMove.piece === "p" &&
              foundMove.to[1] === "1")
          ) {
            return true;
          }
    }


    function onDrop(sourceSquare, targetSquare) {
        if (moves.indexOf("") === -1) {
          return
        }
        console.log('On Drop');
        const moveOptions = game.moves({
            sourceSquare,
            verbose: true,
        });
        const foundMove = moveOptions.find(
            (m) => m.from === sourceSquare && m.to === targetSquare
        );
        if (foundMove) {
            if (isPromotion(foundMove)){
                return
            } else {
                makeAMove(sourceSquare, targetSquare, 'q');
            }
        }
        return;
    }


    function onPromotionDialogOpen(sourceSquare, targetSquare) {
        console.log('On Promotion Dialog Open');
        setMoveFrom(sourceSquare);
        setMoveTo(targetSquare);
        setShowPromotionDialog(true);
    }


    function submitMoves() {
      gameDispatch({
        type: 'SUBMIT_MOVES',
        difficulty: gameID,
        moves: moves,
        solution: puzzle.moves,
    });
    }


    // if game is updated, clear moves and check if game is over
    useEffect(() => {
      dispatch({ type: 'SET_SIZE', size: size }); 
    }, [eval(gameID)]);


    return (
        <div className='text-center'>
          <Chessboard
            id="ClickToMove"
            animationDuration={200}
            arePiecesDraggable={true}
            boardOrientation={orientation}
            position={game.fen()}
            onSquareClick={onSquareClick}
            onPromotionDialogOpen={onPromotionDialogOpen}
            onPromotionPieceSelect={onPromotionPieceSelect}
            customBoardStyle={{
              borderRadius: "4px"
            }}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
            }}
            promotionToSquare={moveTo}
            showPromotionDialog={showPromotionDialog}
            onPieceDrop={onDrop}
          />
          <Row>
            <Col className='p-2'>
                <Button className='w-100 btn-secondary'
                    onClick={() => {
                        game.undo();
                        setGame(game);
                        dispatch({ type: 'UNDO_MOVE'});
                        setMoveSquares({});
                        setOptionSquares({});
                    }}
                >
                    &#8635; undo
                </Button>
            </Col>
            <Col className='p-2'>
                <Button className='w-100 btn-secondary'
                    onClick={() => {
                      if (moves.indexOf("") === -1) {
                          const copyGame = new Chess(puzzle.fen);
                          setGame(copyGame);
                          setMoveSquares({});
                          setOptionSquares({});
                          submitMoves();
                        }
                    }}
                >
                    submit
                </Button>
            </Col>
          </Row>
        </div>
      );
}

export default ActiveBoard;
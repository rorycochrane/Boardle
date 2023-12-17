import React, { useState, useContext } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



function InactiveBoard({puzzle, gameID}) {
    const [game, setGame] = useState(new Chess(puzzle.fen));
    const [currMove, setCurrMove] = useState(0);
    const moves = puzzle.moves;
    const orientation = puzzle.fen.split(" ")[1] === 'w' ? 'white' : 'black';


    function prevMove() {
        if (currMove>0){
            game.undo();
            setGame(game);
            setCurrMove(currMove-1);
        }
    }

    function nextMove() {
        if (currMove < moves.length){
            game.move(moves[currMove]);
            setGame(game);
            setCurrMove(currMove+1);
        }
    }

    return (
        <div className='text-center'>
            <Chessboard
                id="ClickToMove"
                animationDuration={200}
                arePiecesDraggable={false}
                boardOrientation={orientation}
                position={game.fen()}
                customBoardStyle={{
                    borderRadius: "4px"
                }}
            />
            <Row>
                <Col className='p-2'>
                    <Button className='w-100 btn-secondary'
                        onClick={() => {
                            prevMove();
                        }}
                    >
                        &#8678;
                    </Button>
                </Col>
                <Col className='p-2'>
                    <Button className='w-100 btn-secondary'
                        onClick={() => {
                            nextMove();
                        }}
                    >
                        &#8680;
                    </Button>
                </Col>
            </Row>
        </div>
    );
}


export default InactiveBoard;
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function InstructionsModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Puzzle Solved!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
            Boardle is a free daily chess puzzle in the style of a wordle game. You get five attempts 
            to solve the puzzle by choosing the best series of moves for both players. As you play, 
            your guesses will fill in the tiles below the chessboard using standard algebraic notation (SAN),
            similar to chessle, and other chess wordle variants. 
        </p>
        <p>
            Once you've filled out all of the tiles, press the submit button. The tiles will change color 
            to show how close your guess was to the solution.
        </p>
        <p class="mb-0">Example:</p>
        <div id="instructions-board">
            <div class="instructions-square good">Rxh2+</div>
            <div class="instructions-square bad">Kf1</div>
            <div class="instructions-square bad">Rdh8</div>
            <div class="instructions-square ok">Nb1</div>
            <div class="instructions-square bad">Qf2+</div>
        </div>
        <p>
            The move Rxh2+ is in the solution, and in the correct spot. The move Nb1 is in the solution but in the wrong spot. The other moves are not in the solution.
        </p>
        <p>
            Note that a move only counts as correct if it has the exact right SAN. For example, Qxa8# is 
            not the same as Qxa8. If you're confused about SAN, you can find out more by reading this 
        <a href="https://odinchess.com/blog/how-to-read-and-write-chess-notation">
            chess notation tutorial
        </a>.
        </p>
        <p>
            Puzzles are courtesy of <a href="https://lichess.org/">lichess</a>.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InstructionsModal;
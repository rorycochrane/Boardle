import React , { useState, useContext, useEffect, useRef } from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal'; 
import Button from 'react-bootstrap/Button'; 

import GridRow from '../components/GridRow';
import { ReactComponent as ChartSvg } from '../img/fontawesome/chart-column.svg';
import { ReactComponent as QuestionSvg } from '../img/fontawesome/circle-question-solid.svg';
import { ReactComponent as HouseSvg } from '../img/fontawesome/house-solid.svg';
import { ReactComponent as FolderSvg } from '../img/fontawesome/folder-solid.svg';
import { GameContext } from '../Context/index.tsx';

const svgStyle = { 
  width: '100%', 
  height: '100%',
  filter: 'invert(82%) sepia(10%) saturate(5%) hue-rotate(326deg) brightness(107%) contrast(90%)'
};


const statsBoardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridGap: '5px',
    padding: '10px',
    boxSizing: 'border-box'
};

 const statsSquareStyle = {
  minWidth: '70px',
  minHeight: '38px',
  fontSize: '1rem',
  fontWeight: 'bold',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '19px',
  textAlign: 'center',
  marginBottom: '15px'
}

const statsSquareNumberStyle = {
  minWidth: '70px',
  minHeight: '38px',
  fontSize: '2rem',
  fontWeight: 'bold',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '19px',
  textAlign: 'center'
}

const modalStyle = {
  color: 'black'
}



function Header({ size, gameID, puzzleID }) {
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const handleInstructionsClose = () => setShowInstructionsModal(false);
  const handleInstructionsOpen = () => setShowInstructionsModal(true);
  const handleSettingsClose = () => setShowSettingsModal(false);
  const handleSettingsOpen = () => setShowSettingsModal(true);
  const handleStatsClose = () => setShowStatsModal(false);
  const handleStatsOpen = () => setShowStatsModal(true);

  const { easy, medium, hard, expert, other, dispatch: gameDispatch } = useContext(GameContext);

  const prevSolvedStatesRef = useRef({
    easy: easy.solved,
    medium: medium.solved,
    hard: hard.solved,
    expert: expert.solved,
  });

  function titleFromLevel() {
    if (gameID === 'easy') {
      return 'Mini '
    } else if (gameID === 'hard') {
      return 'Mega '
    } else if (gameID === 'expert') {
      return 'Maxi '
    }
    return ' '
  }

  function getShareText() {
    const currentStreak = eval(gameID).streak;
    const guesses = eval(gameID).guesses;
    const emptyIndex = guesses.indexOf("");
    const rows = emptyIndex === -1 ? size : Math.round(emptyIndex/size);
    // if (currentStreak === 0) {
    //     guesses = 'X'
    // }
    let shareText = 'Boardle '
        + titleFromLevel(gameID)
        + puzzleID
        + ' '
        + rows
        + '/'
        + size
        + '\n\n'
        + getEmojis()
        + '\n'
        + 'https://playboardle.com'
    
    let shareData = {
        text: shareText
    };

    // From detectmobilebrowsers.com
    let isMobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if (isMobile && (navigator.userAgent.toLowerCase().indexOf('firefox') === -1)
            && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(shareText);
        // document.getElementById("gameOverModalText").innerHTML = "Copied to Clipboard"
        createAlert('shareAlert', 'copyAlert', 'Copied to clipboard!', 'primary');
    }
}

function getEmojis() {
  const emptyIndex = eval(gameID).results.indexOf("") === -1 ? size*size : eval(gameID).results.indexOf("");
  var emojis = ''
  for (let r = 0; r < emptyIndex/size; r++) {
      for (let c = 0; c < size; c++) {
          if (eval(gameID).results[size*r+c] === "good") {
              emojis += '🟩'
          } else if (eval(gameID).results[size*r+c] === "okay") {
              emojis += '🟨'
          } else {
              emojis += '⬜'
          }
      }
      emojis += '\n'
  }
  return emojis
}

function createAlert(id, parent, text, style) {
  if (!document.getElementById(id)) {
      let newAlert = document.createElement('div');
      newAlert.id = id;
      newAlert.className = 'alert alert-' + style + ' text-center';
      newAlert.appendChild(document.createTextNode(text));
      let alertArea = document.getElementById(parent);
      alertArea.insertBefore(newAlert, alertArea.childNodes[0]);
      setTimeout(function() {
          newAlert.remove();
      }, 2500);
  }
}

  useEffect(() => {
    if (easy.totalGames+medium.totalGames+hard.totalGames+expert.totalGames === 0) {
      setShowInstructionsModal(true);
    }
  }, []);

  useEffect(() => {
    // Check if any of the games has just become solved
    const hasNewlySolvedGame = (
      !prevSolvedStatesRef.current.easy && easy.solved ||
      !prevSolvedStatesRef.current.medium && medium.solved ||
      !prevSolvedStatesRef.current.hard && hard.solved ||
      !prevSolvedStatesRef.current.expert && expert.solved
    );

    // If there's a newly solved game, show the stats modal
    if (hasNewlySolvedGame) {
      setShowStatsModal(true);
    }

    // Update the previous solved states
    prevSolvedStatesRef.current = {
      easy: easy.solved,
      medium: medium.solved,
      hard: hard.solved,
      expert: expert.solved,
    };
  }, [easy.solved, medium.solved, hard.solved, expert.solved]);

  return (
    <Navbar className="bg-black px-md-5">
        <Nav className="mr-auto">
            <Nav.Link onClick={handleStatsOpen} style={{ width: '45px', height: '45px' }}><ChartSvg style={svgStyle}/></Nav.Link>
            <Nav.Link href="home" style={{ width: '45px', height: '45px' }}><HouseSvg style={svgStyle}/></Nav.Link>
        </Nav>
        <Navbar.Brand className="mx-auto" style={{color: "gainsboro"}}><h1>Boardle</h1></Navbar.Brand>
        <Nav className="ml-auto">
            <Nav.Link onClick={handleInstructionsOpen} href="#" style={{ width: '45px', height: '45px' }}><QuestionSvg style={svgStyle}/></Nav.Link>
            <Nav.Link onClick={handleSettingsOpen} href="#" style={{ width: '45px', height: '45px' }}><FolderSvg style={svgStyle}/></Nav.Link>
        </Nav>

        {/* STATS MODAL */}
        <Modal show={showStatsModal} onHide={handleStatsClose} style={modalStyle}>
          <Modal.Header closeButton>
            <Modal.Title>Stats</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={statsBoardStyle}>
            <div style={statsSquareStyle}>Boardle Version</div>
              <div style={statsSquareStyle}>Total Games</div>
              <div style={statsSquareStyle}>Win %</div>
              <div style={statsSquareStyle}>Current Streak</div>

              <div style={statsSquareStyle}>Mini</div>
              <div style={statsSquareNumberStyle}>{easy.totalGames}</div>
              <div style={statsSquareNumberStyle}>{easy.totalGames > 0 ? Math.round(easy.wins/easy.totalGames*100) : 0}</div>
              <div style={statsSquareNumberStyle}>{easy.streak}</div>

              <div style={statsSquareStyle}>Main</div>
              <div style={statsSquareNumberStyle}>{medium.totalGames}</div>
              <div style={statsSquareNumberStyle}>{medium.totalGames > 0 ? Math.round(medium.wins/medium.totalGames*100) : 0}</div>
              <div style={statsSquareNumberStyle}>{medium.streak}</div>

              <div style={statsSquareStyle}>Mega</div>
              <div style={statsSquareNumberStyle}>{hard.totalGames}</div>
              <div style={statsSquareNumberStyle}>{hard.totalGames > 0 ? Math.round(hard.wins/hard.totalGames*100) : 0}</div>
              <div style={statsSquareNumberStyle}>{hard.streak}</div>

              <div style={statsSquareStyle}>Maxi</div>
              <div style={statsSquareNumberStyle}>{expert.totalGames}</div>
              <div style={statsSquareNumberStyle}>{expert.totalGames > 0 ? Math.round(expert.wins/expert.totalGames*100) : 0}</div>
              <div style={statsSquareNumberStyle}>{expert.streak}</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {gameID !== 'none' && eval(gameID).solved &&
              (<Button onClick={getShareText}>Share</Button>)
            }
            <Button variant="secondary" onClick={handleStatsClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ARCHIVE MODAL */}
        <Modal show={showSettingsModal} onHide={handleSettingsClose} style={modalStyle}>
          <Modal.Header closeButton>
            <Modal.Title>Archive</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Coming Soon
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleSettingsClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* INSTRUCTIONS MODAL */}
        <Modal show={showInstructionsModal} onHide={handleInstructionsClose} style={modalStyle}>
            <Modal.Header closeButton>
                <Modal.Title>Instructions</Modal.Title>
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
              <div class="m-2">
                <GridRow size={5} content={["Rxh2+", "Kf1", "Rdh8", "Nb1", "Qf2+"]} results={["good", "bad", "bad", "okay", "bad"]}/>
              </div>
              <p>
                  The move Rxh2+ is in the solution, and in the correct spot. The move Nb1 is in the solution but in the wrong spot. The other moves are not in the solution.
              </p>
              <p>
                  Note that a move only counts as correct if it has the exact right SAN. For example, Qxa8# is 
                  not the same as Qxa8. If you're confused about SAN, you can find out more by reading this <a href="https://www.chess.com/terms/chess-notation">
                  chess notation tutorial</a>.
              </p>
              <p>
                  Puzzles are courtesy of <a href="https://lichess.org/">lichess</a>.
              </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleInstructionsClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        
    </Navbar>
  )
}

export default Header;
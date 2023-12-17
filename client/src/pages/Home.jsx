import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ActiveBoard from '../components/ActiveBoard';
import InactiveBoard from '../components/InactiveBoard';
import Grid from '../components/Grid';
import GridRow from '../components/GridRow';
import Header from './Header';
import { MovesStateProvider, GameContext } from '../Context/index.tsx';

function Home({ size, gameID }) {

    const [puzzle, setPuzzle] = useState(null);
    const [solved, setSolved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { easy, medium, hard, expert, other, dispatch: gameDispatch } = useContext(GameContext);

    function renderLink(label, path, pathSize, currentSize) {
        if (pathSize === currentSize) {
            return <span className="mx-2">{label}</span>; 
        }
        return <Link to={path} className="mx-2 text-decoration-none">{label}</Link>;
    }


    useEffect(() => {
        setIsLoading(true);
        fetch('/api/puzzles' + size)
            .then(response => response.json())
            .then(data => {
                setPuzzle(data);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false); // set to false on error
            });
    }, [size]);

    useEffect(() => {
        if (eval(gameID).solved) {
            setSolved(true);
        } else {
            setSolved(false);
        }
    }, [eval(gameID)]);

    useEffect(() => {
        if (puzzle) {
            if (eval(gameID).ID !== puzzle.ID | gameID === 'other'){
                gameDispatch({
                    type: 'UPDATE_PUZZLE',
                    difficulty: gameID,
                    newState: {
                    guesses: Array(size*size).fill(""),
                    results: Array(size*size).fill(""),
                    solved: false,
                    ID: puzzle.ID
                    },
                });
            }
        }
    }, [puzzle]);

    if (!puzzle) {
        return <div>Loading...</div>;
    } 

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <MovesStateProvider>
            <div class="row h-100 w-100 m-0">
                <Header size={size} gameID={gameID} puzzleID={puzzle.ID}/>
            </div>
            <div className="section w-100 h-100">
                <Container className="h-100">
                    {/* Navigation Header */}
                    <Row className="mb-4 d-block d-md-none">
                        <Col xs={12} md={6} className="d-flex justify-content-center">
                            <nav>
                                {renderLink("Boardle Mini", "/mini", 3, size)}
                                {renderLink("Boardle", "/", 5, size)}
                            </nav>
                        </Col>
                        <Col xs={12} md={6} className="d-flex justify-content-center">
                            <nav>
                                {renderLink("Boardle Mega", "/mega", 7, size)}
                                {renderLink("Boardle Maxi", "/maxi", 9, size)}
                            </nav>
                        </Col>
                    </Row>
                    <Row className="mb-4 d-none d-md-block">
                        <Col className="d-flex justify-content-center">
                            <nav>
                                {renderLink("Boardle Mini", "/mini", 3, size)}
                                {renderLink("Boardle", "/", 5, size)}
                                {renderLink("Boardle Mega", "/mega", 7, size)}
                                {renderLink("Boardle Maxi", "/maxi", 9, size)}
                            </nav>
                        </Col>
                    </Row>
                    <Row className="h-100">

                        <Col md={6}>
                            <div className="ratio ratio-1x1 mb-4 mb-md-0">
                                {solved ? (
                                    <InactiveBoard puzzle={puzzle} gameID={gameID}/>
                                ) : (
                                    <ActiveBoard puzzle={puzzle} gameID={gameID}/>
                                )}
                            </div>
                        </Col>
                        <Col md={6} className="mt-5 mt-md-0">
                            {solved &&
                            <div class="mb-3">
                                <GridRow size={size} content={puzzle.moves} results={Array(size).fill("good")}/>
                            </div>
                            }
                            <div className="ratio ratio-1x1">
                                <div>
                                    <Grid puzzle={puzzle} gameID={gameID}></Grid>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </MovesStateProvider>
    );
}

export default Home;

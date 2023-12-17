import React from 'react';
// import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const cardStyle = {
    background: "black",
    border: "black"
}

function About() {
    return (
        <div className="section w-100 h-100">
            <Container className="h-100 mt-4">
                <Row className="h-100">
                    <Col md={8} className="font-weight-bold">
                        <h2>About</h2>
                        <p class="font-weight-bold">
                            Boardle is a chess wordle game that offers a new chess puzzle for you to 
                            solve each day. The puzzles come from <a href="https://lichess.org/">lichess</a>,
                            and are modified to be playable from both sides. This means you need to 
                            choose the best moves for both white and black.
                        </p>
                        <p class="font-weight-bold">
                            The main version of Boardle involves a chess puzzle consisting of 5 moves, and you get 5 
                            tries to figure them all out. The other versions have puzzles consiting of 3, 7, and 9 
                            moves each.
                        </p>
                    </Col>
                    <Col md={4}>
                        <div class="card mb-4" style={cardStyle}>
                            <div class="card-header fw-bold text-center" style={cardStyle}>Boardle Games</div>
                            <div class="card-body text-center"><a href="mini">Boardle Mini</a></div>
                            <div class="card-body text-center"><a href="/">Boardle</a></div>
                            <div class="card-body text-center"><a href="mega">Boardle Mega</a></div>
                            <div class="card-body text-center"><a href="maxi">Boardle Maxi</a></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default About;
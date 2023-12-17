import chess
import os
import psycopg2
import pytz

from datetime import date, datetime
from flask import Flask, request, redirect, send_from_directory, jsonify
from flask_sslify import SSLify
from urllib.parse import urlparse, urlunparse

app = Flask(__name__, static_folder='../client/build')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
if 'PRODUCTION' in os.environ:
    sslify = SSLify(app)


def get_db_connection():
    DATABASE_URL = os.environ['DATABASE_URL']
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    return conn

def get_puzzles(sql_query, main_puzzle=False):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(sql_query)
    puzzles = cur.fetchall()
    cur.close()
    conn.close()

    la_tz = pytz.timezone("America/Los_Angeles")
    today = datetime.now(la_tz).date()
    day_0 = date(2023, 8, 11)
    if main_puzzle:
        day_0 = date(2022, 7, 21)
    delta_days = today - day_0
    todays_puzzle = puzzles[delta_days.days]

    id = todays_puzzle[0]
    fen = todays_puzzle[2]
    elo = todays_puzzle[4]
    url = todays_puzzle[9]
    uci_moves = todays_puzzle[3].split(' ')
    uci_moves = [chess.Move.from_uci(uci_move) for uci_move in uci_moves]

    board = chess.Board(fen)
    san_moves = []
    for uci_move in uci_moves:
        san_move = board.san(uci_move)
        board.push_san(san_move)
        san_moves.append(san_move)

    board = chess.Board(fen)
    board.push_san(san_moves[0])

    data = {
        'fen': board.fen(),
        'ID': id,
        'moves': san_moves[1:],
        'elo': elo,
        'url': url
    }

    return jsonify(data)


@app.before_request
def redirect_www():
    """Redirect non-www requests to www."""
    urlparts = urlparse(request.url)
    if urlparts.netloc[:3] == 'www':
        urlparts_list = list(urlparts)
        urlparts_list[1] = 'playboardle.com'
        return redirect(urlunparse(urlparts_list), code=301)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    abs_path = os.path.abspath(os.path.join(app.static_folder, path))
    if path != "" and os.path.exists(abs_path):
        # print(f"File found for path: {path} at absolute path: {abs_path}")
        return send_from_directory(app.static_folder, path)
    else:
        # print(f"No file found for path: {path}, at absolute path: {abs_path}, serving index.html")
        return send_from_directory(app.static_folder, 'index.html')



@app.route('/api/puzzles3', methods=['GET'])
def get_puzzles3():
    sql_query = 'SELECT * FROM puzzles3;'
    return get_puzzles(sql_query)


@app.route('/api/puzzles5', methods=['GET'])
def get_puzzles5():
    sql_query = 'SELECT * FROM puzzles;'
    return get_puzzles(sql_query, main_puzzle=True)


@app.route('/api/puzzles7', methods=['GET'])
def get_puzzles7():
    sql_query = 'SELECT * FROM puzzles7;'
    return get_puzzles(sql_query)


@app.route('/api/puzzles9', methods=['GET'])
def get_puzzles9():
    sql_query = 'SELECT * FROM puzzles9;'
    return get_puzzles(sql_query)


@app.route('/robots.txt')
@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])



if __name__ == "__main__":
    app.run(debug=True)
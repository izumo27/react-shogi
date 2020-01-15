import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Setting} from "./setting";
import {Game, make_board, set_kifu, set_pieces} from './game';
// import { Piece } from './pieces/piece';

ReactDOM.render(
  <Game
    start_pos={make_board()}
    start_black_piece={set_pieces()}
    start_white_piece={set_pieces()}
    current_pos={make_board()}
    current_black_piece={set_pieces()}
    current_white_piece={set_pieces()}
    kifu={set_kifu()}
    turn={true}
    moves={0}
    clicked_piece={Setting.UNCLICKED}
    final_piece={Setting.UNCLICKED}
    black_name={""}
    white_name={""}
    is_black={true}
  />,
  document.getElementById('root')
);

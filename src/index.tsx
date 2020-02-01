import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Setting} from "./setting";
import {Game, make_board, set_kifu, set_pieces, set_control_piece} from './game';

ReactDOM.render(
  <Game
    start_pos={make_board()}
    start_black_piece={set_pieces()}
    start_white_piece={set_pieces()}
    current_pos={make_board()}
    current_black_piece={set_pieces()}
    current_white_piece={set_pieces()}
    control_piece={set_control_piece()}
    kifu={set_kifu()}
    turn={true}
    moves={0}
    moves_sub={0}
    clicked_piece={Setting.UNCLICKED}
    final_piece={Setting.UNCLICKED}
    black_name={"先手"}
    white_name={"後手"}
    is_black={true}
    moved_piece={Setting.UNCLICKED}
    promotion={false}
    resign={false}
    result={false}
  />,
  document.getElementById('root')
);

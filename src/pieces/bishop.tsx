import {Setting} from '../setting';
import {Piece} from './piece';

export class Bishop extends Piece{
  constructor(_turn: boolean, _piece_num: number=1){
    super(Setting.PIECES[_piece_num], _turn, _piece_num);
  }
}

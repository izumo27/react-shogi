import {Piece} from './piece';

export class Mt extends Piece{
  constructor(_turn: boolean=true, _piece_num: number=16){
    super(' ', _turn, _piece_num);
  }
}

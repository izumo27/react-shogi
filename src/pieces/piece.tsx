import { Setting } from "../setting";

export abstract class Piece{
  // 出力する文字
  private _out: string;
  // 先手の駒か
  private _turn: boolean;
  // 駒番号
  private _piece_num: number;

  constructor(_out: string, _turn: boolean, _piece_num: number){
    this._out = _out;
    this._turn = _turn;
    this._piece_num = _piece_num;
  }

  public out(): string{
    return this._out;
  }
  public turn(): boolean{
    return this._turn;
  }
  public piece_num(): number{
    return this._piece_num;
  }
  public promote(): void{
    this._piece_num += Setting.MT / 2;
    this._out = Setting.PIECES[this._piece_num];
  }

}

import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import {Setting} from "./setting";
import {Piece} from './pieces/piece';
import { Pawn } from "./pieces/pawn";
import { Lance } from "./pieces/lance";
import { Knight } from "./pieces/knight";
import { Silver } from "./pieces/silver";
import { Gold } from "./pieces/gold";
import { Bishop } from "./pieces/bishop";
import { Rook } from "./pieces/rook";
import { King } from "./pieces/king";
import { Mt } from "./pieces/mt";
import {Board, Captured} from './board';
import _ from 'lodash';

export function make_board(sfen="lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1", language='Ja'): Piece[][]{
  var squares: Piece[][] = [];
  for(let i = 0; i < Setting.LENGTH; ++i){
    squares[i] = [];
    for(let j = 0; j < Setting.LENGTH; ++j){
      squares[i].push(new Mt());
    }
  }
  if(sfen === "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1"){
    for(let i = 0; i < Setting.LENGTH; ++i){
      squares[i][2] = new Pawn(false);
      squares[i][6] = new Pawn(true);
    }
    squares[0][0] = new Lance(false);
    squares[8][0] = new Lance(false);
    squares[0][8] = new Lance(true);
    squares[8][8] = new Lance(true);

    squares[1][0] = new Knight(false);
    squares[7][0] = new Knight(false);
    squares[1][8] = new Knight(true);
    squares[7][8] = new Knight(true);

    squares[2][0] = new Silver(false);
    squares[6][0] = new Silver(false);
    squares[2][8] = new Silver(true);
    squares[6][8] = new Silver(true);

    squares[3][0] = new Gold(false);
    squares[5][0] = new Gold(false);
    squares[3][8] = new Gold(true);
    squares[5][8] = new Gold(true);

    squares[1][1] = new Bishop(false);
    squares[7][7] = new Bishop(true);

    squares[7][1] = new Rook(false);
    squares[1][7] = new Rook(true);

    squares[4][0] = new King(false);
    squares[4][8] = new King(true);
  }
  else{

  }
  return squares;
}

export function set_piece(n: number, is_black: boolean): Piece{
  var piece: Piece = new Mt();
  if(n === 0) piece = new Rook(is_black);
  if(n === 1) piece = new Bishop(is_black);
  if(n === 2) piece = new Gold(is_black);
  if(n === 3) piece = new Silver(is_black);
  if(n === 4) piece = new Knight(is_black);
  if(n === 5) piece = new Lance(is_black);
  if(n === 6) piece = new Pawn(is_black);
  return piece;
}

export function set_pieces(): number[]{
  var numbers: number[] = new Array<number>(Setting.WHITE).fill(0);
  return numbers;
}

export function set_kifu(): Array<string>{
  var kifu: Array<string> = [];
  return kifu;
}

// ある駒の利きを列挙
// 手番の駒のマスは移動するときにはじいているため、ここではそのマスも利きに入れてしまう
// ただし飛び道具はすり抜けしないために正しい効きを列挙する
function control_pos_sub(control_pos: number[][], pos: Piece[][], turn: boolean, x: number, y: number, kingx: number = -1, kingy: number = -1, check_king: boolean = true): void{
  let num: number = pos[x][y].piece_num();
  // 歩
  if(num === 6){
    if(turn ? y !== 0 : y !== Setting.LENGTH - 1){
      let yy = (turn ? y - 1 : y + 1);
      ++control_pos[x][yy];
      // 王手をしているか
      if(x === kingx && yy === kingy){
        control_pos[Setting.LENGTH][0] = x * Setting.LENGTH + y;
        control_pos[Setting.LENGTH][1] = num;
      }
    }
    return;
  }
  if(num === 2 || num === 3 || num === 4 || num === 7 || (11 <= num && num <= 14)){
    let dx: number[];
    let dy: number[];
    // 桂
    if(num === 4){
      dx = new Array<number>(-1, 1);
      dy = new Array<number>(-2, -2);
    }
    // 銀
    else if(num === 3){
      dx = new Array<number>(-1, 0, 1, 1, -1);
      dy = new Array<number>(-1, -1, -1, 1, 1);
    }
    // 金、と、杏、圭、全
    else if(num === 2 || (11 <= num && num <= 14)){
      dx = new Array<number>(-1, 0, 1, 1, 0, -1);
      dy = new Array<number>(-1, -1, -1, 0, 1, 0);
    }
    // 玉
    else{
      if(check_king){
        dx = new Array<number>(-1, 0, 1, 1, 1, 0, -1, -1);
        dy = new Array<number>(-1, -1, -1, 0, 1, 1, 1, 0);
      }
      else{
        dx = new Array<number>(0);
        dy = new Array<number>(0);
      }
    }
    for(let i = 0; i< dx.length; ++i){
      let xx = (turn ? x + dx[i] : x - dx[i]);
      let yy = (turn ? y + dy[i] : y - dy[i]);
      if(0 <= xx && xx < Setting.LENGTH && 0 <= yy && yy < Setting.LENGTH){
        ++control_pos[xx][yy];
        // 王手をしているか
        if(xx === kingx && yy === kingy){
          control_pos[Setting.LENGTH][0] = x * Setting.LENGTH + y;
          control_pos[Setting.LENGTH][1] = num;
        }
      }
    }
    return;
  }
  // 香
  if(num === 5){
    let dy: number = -1;
    let yy = (turn ? y + dy : y - dy);
    while(0 <= yy && yy < Setting.LENGTH){
      ++control_pos[x][yy];
      // 王手をしているか
      if(x === kingx && yy === kingy){
        control_pos[Setting.LENGTH][0] = x * Setting.LENGTH + y;
        control_pos[Setting.LENGTH][1] = num;
      }
      // 空きマスでなければ終わり
      // ただし相手玉なら終わらない
      if(pos[x][yy].piece_num() !== Setting.MT && !(pos[x][yy].piece_num() === 7 && pos[x][yy].turn() !== turn)){
        break;
      }
      yy = (turn ? yy + dy : yy - dy);
    }
    return;
  }
  // 飛と角は手番で動きが変わらない！（対称）
  // 角
  if(num === 1 || num === 9){
    let dx: number[] = new Array<number>(-1, 1, 1, -1);
    let dy: number[] = new Array<number>(-1, -1, 1, 1);
    for(let i = 0; i < dx.length; ++i){
      let xx = x + dx[i];
      let yy = y + dy[i];
      while(0 <= xx && xx < Setting.LENGTH && 0 <= yy && yy < Setting.LENGTH){
        ++control_pos[xx][yy];
        // 王手をしているか
        if(xx === kingx && yy === kingy){
          control_pos[Setting.LENGTH][0] = x * Setting.LENGTH + y;
          control_pos[Setting.LENGTH][1] = num;
        }
        // 空きマスでなければ終わり
        // ただし相手玉なら終わらない
        if(pos[xx][yy].piece_num() !== Setting.MT && !(pos[xx][yy].piece_num() === 7 && pos[xx][yy].turn() !== turn)){
          break;
        }
        xx += dx[i];
        yy += dy[i];
      }
    }
    // 馬の場合は上下左右も
    if(num === 9){
      dx = new Array<number>(0, 1, 0, -1);
      dy = new Array<number>(-1, 0, 1, 0);
      for(let i = 0; i< dx.length; ++i){
        let xx = x + dx[i];
        let yy = y + dy[i];
        if(0 <= xx && xx < Setting.LENGTH && 0 <= yy && yy < Setting.LENGTH){
          ++control_pos[xx][yy];
          // 王手をしているか
          if(xx === kingx && yy === kingy){
            control_pos[Setting.LENGTH][0] = x * Setting.LENGTH + y;
            control_pos[Setting.LENGTH][1] = num;
          }
        }
      }
    }
    return;
  }
  // 飛
  if(num === 0 || num === 8){
    let dx: number[] = new Array<number>(0, 1, 0, -1);
    let dy: number[] = new Array<number>(-1, 0, 1, 0);
    for(let i = 0; i < dx.length; ++i){
      let xx = x + dx[i];
      let yy = y + dy[i];
      while(0 <= xx && xx < Setting.LENGTH && 0 <= yy && yy < Setting.LENGTH){
        ++control_pos[xx][yy];
        // 王手をしているか
        if(xx === kingx && yy === kingy){
          control_pos[Setting.LENGTH][0] = x * Setting.LENGTH + y;
          control_pos[Setting.LENGTH][1] = num;
        }
        // 空きマスでなければ終わり
        // ただし相手玉なら終わらない
        if(pos[xx][yy].piece_num() !== Setting.MT && !(pos[xx][yy].piece_num() === 7 && pos[xx][yy].turn() !== turn)){
          break;
        }
        xx += dx[i];
        yy += dy[i];
      }
    }
    // 竜の場合は斜めも
    if(num === 8){
      dx = new Array<number>(-1, 1, 1, -1);
      dy = new Array<number>(-1, -1, 1, 1);
      for(let i = 0; i< dx.length; ++i){
        let xx = x + dx[i];
        let yy = y + dy[i];
        if(0 <= xx && xx < Setting.LENGTH && 0 <= yy && yy < Setting.LENGTH){
          ++control_pos[xx][yy];
          // 王手をしているか
          if(xx === kingx && yy === kingy){
            control_pos[Setting.LENGTH][0] = x * Setting.LENGTH + y;
            control_pos[Setting.LENGTH][1] = num;
          }
        }
      }
    }
    return;
  }
}

// 駒の利きを列挙
// 一つの駒を指定することもできる
// ついでに王手をかけている駒の位置も返す
function control_pos(pos: Piece[][], turn: boolean, x: number = -1, y: number = -1, kingx: number = -1, kingy: number = -1, check_king: boolean = true): number[][]{
  let control_pos: number[][] = [];
  for(let i = 0; i < Setting.LENGTH + 1; ++i){
    control_pos[i] = new Array<number>(Setting.LENGTH).fill(0);
  }
  if(x !== -1){
    control_pos_sub(control_pos, pos, turn, x, y);
    return control_pos;
  }
  for(let i = 0; i < Setting.LENGTH; ++i){
    for(let j = 0; j < Setting.LENGTH; ++j){
      if(pos[i][j].piece_num() !== Setting.MT && pos[i][j].turn() === turn){
        control_pos_sub(control_pos, pos, turn, i, j, kingx, kingy, check_king);
      }
    }
  }
  return control_pos;
}

// 王手がかかっているか
// 返り値：（1桁目：王手をかけている駒の数、2桁目：そのうち防げる駒の数）
function check(pos: Piece[][], captured: number[], turn: boolean, x: number = -1, y : number = -1): number{
  // 玉の位置
  if(x === -1){
    for(let i = 0; i < Setting.LENGTH; ++i){
      for(let j = 0; j < Setting.LENGTH; ++j){
        if(pos[i][j].piece_num() === 7 && pos[i][j].turn() === turn){
          x = i;
          y = j;
          i = Setting.LENGTH;
          j = Setting.LENGTH;
          break;
        }
      }
    }
  }
  // 効いているマスをあらかじめ求めておく
  let def_controls: number[][] = control_pos(pos, turn, -1, -1, -1, -1, false);
  let atc_controls: number[][] = control_pos(pos, !turn, -1, -1, x, y);
  // 王手をかけている駒の数
  let cnt: number = atc_controls[x][y];
  if(cnt === 0){
    return 0;
  }
  // 2つ以上の駒が王手をかけているなら逃げるしかないのでreturn
  if(cnt > 1){
    return cnt * 10;
  }
  // 王手をかけている駒を（玉以外で）取れるか
  // 玉で取れる場合はここではチェックしなくてよい
  let atc: number = atc_controls[Setting.LENGTH][0];
  let atcx: number = Math.floor(atc / Setting.LENGTH);
  let atcy: number = atc % Setting.LENGTH;
  // 桂馬以外の飛び道具で王手されているとき合い駒できるか
  let num: number = atc_controls[Setting.LENGTH][1];
  if(num === 0 || num === 1 || num === 5 || num === 8 || num === 9){
    let dx: number = atcx - x;
    let dy: number = atcy - y;
    if(dx !== 0){
      dx /= Math.abs(dx);
    }
    if(dy !== 0){
      dy /= Math.abs(dy);
    }
    let xx: number = x + dx;
    let yy: number = y + dy;
    while(xx !== atcx || yy !== atcy){
      // 移動合いできるか
      if(def_controls[xx][yy] > 0){
        return 11;
      }
      // 持ち駒で合い駒できるか
      for(let i = 0; i < Setting.WHITE; ++i){
        if(captured[i] === 0){
          continue;
        }
        let cur_pos: Piece[][] = _.cloneDeep(pos);
        cur_pos[xx][yy] = set_piece(i, turn);
        if(can_move(pos, cur_pos, captured, -1, -1, x, yy, !turn)){
          // 二歩かどうかはチェックする必要がある
          if(i === 6 && nifu(cur_pos, xx, turn)){
            continue;
          }
          return 11;
        }
      }
      xx += dx;
      yy += dy;
    }
  }

  return 10;
}

// 詰んでいるか
function mate(pos: Piece[][], captured: number[], turn: boolean): boolean{
  // 玉の位置
  let x: number = -1;
  let y: number = -1;
  for(let i = 0; i < Setting.LENGTH; ++i){
    for(let j = 0; j < Setting.LENGTH; ++j){
      if(pos[i][j].piece_num() === 7 && pos[i][j].turn() === turn){
        x = i;
        y = j;
        i = Setting.LENGTH;
        j = Setting.LENGTH;
        break;
      }
    }
  }
  // 王手をかけている駒の数
  let cnt: number = check(pos, captured, turn, x, y);
  // 王手されていなければ明らかに詰んでいない
  if(cnt === 0){
    return false;
  }
  // 今いるマス及び周りのマスで王手がかかるか
  let atc_controls: number[][] = control_pos(pos, !turn);
  let dx: number[] = new Array<number>(1, 1, 0, -1, -1, -1, 0, 1);
  let dy: number[] = new Array<number>(0, 1, 1, 1, 0, -1, -1, -1);
  for(let i = 0; i < dx.length; ++i){
    let xx = x + dx[i];
    let yy = y + dy[i];
    if(xx < 0 || Setting.LENGTH <= xx || yy < 0 || Setting.LENGTH <= yy){
      continue;
    }
    // 自分の駒があるとダメ
    if(pos[xx][yy].piece_num() !== Setting.MT && pos[xx][yy].turn() === turn){
      continue;
    }
    // 逃げられるマスがあれば詰んでいない
    if(atc_controls[xx][yy] === 0){
      return false;
    }
  }
  // 2つ以上の駒から王手されている場合は明らかにダメ
  if(Math.floor(cnt / 10) > 1){
    return true;
  }
  // 防げる王手か
  return cnt % 10 < 1;
}

// 動けるマスか
// 動かす前の盤面、動かした後の盤面、移動前の位置、移動後の位置、手番
function can_move(bfr_pos: Piece[][], cur_pos: Piece[][], captured: number[], xx: number, yy: number, x: number, y: number, turn: boolean): boolean{
  let num: number = cur_pos[x][y].piece_num();
  // 駒を打つときは行き所がないかと、打ち歩詰めのみをチェックすればよい
  // 二歩のチェックはここではせずに反則負けにする
  if(xx === -1){
    if(num === 4){
      return (turn ? y > 1 : y < Setting.LENGTH - 1 - 1);
    }
    if(num === 5){
      return (turn ? y !== 0 : y !== Setting.LENGTH - 1);
    }
    if(num === 6){
      if((turn ? y === 0 : y === Setting.LENGTH - 1)){
        return false;
      }
      // 打ち歩詰めかどうか
      return !mate(cur_pos, captured, !turn);
    }
    return true;
  }
  // ルール通りの動きか調べる
  // 香、角、飛は駒をすり抜けに注意
  let controls: number[][] = control_pos(bfr_pos, turn, xx, yy);
  return controls[x][y] > 0;
}

// 二歩かどうか
// 打った筋だけ見ればよい
function nifu(pos: Piece[][], x: number, turn: boolean): boolean{
  let cnt = 0;
  for(let i = 0; i < Setting.LENGTH; ++i){
    if(pos[x][i].piece_num() === 6 && pos[x][i].turn() === turn){
      ++cnt;
    }
  }
  return cnt >= 2;
}

interface IGameProps {
  start_pos: Piece[][];
  start_black_piece: number[];
  start_white_piece: number[];
  current_pos: Piece[][];
  current_black_piece: number[];
  current_white_piece: number[];
  kifu: Array<string>;
  turn: boolean;
  moves: number;
  clicked_piece: number;
  final_piece: number;
}

interface IGameState {
  // 開始局面
  start_pos: Piece[][];
  start_black_piece: number[];
  start_white_piece: number[];
  // 現局面
  current_pos: Piece[][];
  current_black_piece: number[];
  current_white_piece: number[];
  // 棋譜
  kifu: Array<string>;
  // 先手番かどうか
  turn: boolean;
  // 手数
  moves: number;
  // 掴んでいる駒
  clicked_piece: number;
  // 最後に動かした駒
  final_piece: number;
}

export class Game extends React.Component<IGameProps, IGameState> {
  constructor(props: IGameProps){
    super(props);
    this.state = {
      start_pos: make_board(),
      start_black_piece: set_pieces(),
      start_white_piece: set_pieces(),
      current_pos: make_board(),
      current_black_piece: set_pieces(),
      current_white_piece: set_pieces(),
      kifu: set_kifu(),
      turn: true,
      moves: 0,
      clicked_piece: Setting.UNCLICKED,
      final_piece: Setting.UNCLICKED,
    };
  }

  handleClick(i: number){
    var clicked_piece: number = this.state.clicked_piece;
    const turn = this.state.turn;
    // 持ち駒をクリックしたとき
    if(i < Setting.WHITE * 2){
      if(clicked_piece === Setting.UNCLICKED){
        if((turn ? i < Setting.WHITE : i>=Setting.WHITE)){
          this.setState({
            clicked_piece: i,
          });
        }
        return;
      }
      this.setState({
        clicked_piece: Setting.UNCLICKED,
      });
      return;
    }

    // 持ち駒の分を引く
    let x: number = Math.floor((i - Setting.WHITE * 2) / Setting.LENGTH);
    let y: number = (i - Setting.WHITE * 2) % Setting.LENGTH;
    const current_pos = this.state.current_pos.concat();
    // 駒を掴んでないとき
    if(this.state.clicked_piece === Setting.UNCLICKED){
      // 手番の駒以外はダメ
      if(current_pos[x][y].piece_num() === Setting.MT || current_pos[x][y].turn() !== turn){
        return;
      }
      this.setState({
        clicked_piece: i,
      });
      return;
    }

    // 手番の駒はダメ
    // ここでは必ず盤面をクリックしている
    if(current_pos[x][y].piece_num() !== Setting.MT && current_pos[x][y].turn() === turn){
      this.setState({
        clicked_piece: Setting.UNCLICKED,
      });
      return;
    }

    // 以下では敵の駒か空きマスをクリックしている
    const current_black_piece = _.cloneDeep(this.state.current_black_piece);
    const current_white_piece = _.cloneDeep(this.state.current_white_piece);
    const moves = this.state.moves;
    var tmp_pos = _.cloneDeep(current_pos);  // 動かした後の盤面
    var tmp_black_piece = _.cloneDeep(current_black_piece);
    var tmp_white_piece = _.cloneDeep(current_white_piece);
    var xx: number = -1;
    var yy: number = -1;
    // 持ち駒を掴んでいるとき
    if(clicked_piece < Setting.WHITE * 2){
      // 空きマスでないとダメ
      if(current_pos[x][y].piece_num() !== Setting.MT){
        this.setState({
          clicked_piece: Setting.UNCLICKED,
        });
        return;
      }
      // 先手の駒を掴んでいる場合
      // 掴むときに手番かチェックしているので、ここではチェックしなくてよい
      if(turn){
        // 持ち駒の更新
        --tmp_black_piece[clicked_piece];
         // 盤面の更新
        tmp_pos[x][y] = set_piece(clicked_piece, turn);
      }
      else{
        // 持ち駒の更新
        --tmp_white_piece[clicked_piece - Setting.WHITE];
         // 盤面の更新
        tmp_pos[x][y] = set_piece(clicked_piece - Setting.WHITE, turn);
      }
    }
    else{
      // 持ち駒の分を引く
      xx = Math.floor((clicked_piece - Setting.WHITE * 2) / Setting.LENGTH);
      yy = (clicked_piece- Setting.WHITE * 2) % Setting.LENGTH;
      var piece = tmp_pos[x][y];
      // 盤面の更新
      tmp_pos[x][y] = tmp_pos[xx][yy];
      tmp_pos[xx][yy] = new Mt();
      // 持ち駒の更新
      let num: number = piece.piece_num();
      if(num !== Setting.MT){
        // 成っている駒を生に戻す
        if(num > Setting.WHITE){
          num -= Setting.MT / 2;
        }
        turn ? ++tmp_black_piece[num] : ++tmp_white_piece[num];
      }
    }

    // 合法手か（動けるところか、王手がかからないか）
    // 移動した駒は成っていないので行き所がないこともあるが、行き所がないか駒を打つときのみチェックする
    // これは適切な移動ならば行き所のない駒はできないため
    if(!can_move(current_pos, tmp_pos, (turn ? tmp_white_piece : tmp_black_piece), xx, yy, x, y, turn) || check(tmp_pos, (turn ? tmp_black_piece : tmp_white_piece), turn) !== 0){
      this.setState({
        clicked_piece: Setting.UNCLICKED,
      });
      return;
    }
    // 成れるときは聞く
    // 条件：盤面から3段目に移動または3段目から移動するときで、金と玉以外の成っていない駒のとき
    let num: number = tmp_pos[x][y].piece_num();
    if(xx !== -1 && (turn ? (y < 3 || yy < 3) : (y > Setting.LENGTH - 1 - 3 || yy > Setting.LENGTH - 1 - 3)) && num < Setting.WHITE && Setting.PIECES[num + Setting.MT / 2] !== ""){
      let is_promoted: Boolean = false;
      // 必ず成るときは聞かずに成る
      // 歩、香の1段目、桂の1,2段目
      if(5 <= num && num <= 6){
        if((turn ? y === 0 : y === Setting.LENGTH - 1)){
          tmp_pos[x][y].promote();
          is_promoted = true;
        }
      }
      else if(num === 4){
        if((turn ? y < 2 : y > Setting.LENGTH -1 - 2)){
          tmp_pos[x][y].promote();
          is_promoted = true;
        }
      }
      if(!is_promoted){
        if(window.confirm("成りますか？")) {
          tmp_pos[x][y].promote();
        }
      }
    }
    this.setState({
      current_pos: tmp_pos,
      current_black_piece: tmp_black_piece,
      current_white_piece: tmp_white_piece,
      turn: !turn,
      moves: moves + 1,
      clicked_piece: Setting.UNCLICKED,
      final_piece: i,
    });
    // 二歩は負け
    if(xx === -1 && tmp_pos[x][y].piece_num() === 6){
      if(nifu(tmp_pos, x, turn)){
        setTimeout(() => {
          alert("反則（二歩）により" + moves + "手にて" + (turn ? "後手" : "先手") + "の勝ちです！")
        }, 200);
        return;
      }
    }
    // 詰んでいたら対局終了
    if(mate(tmp_pos, (turn ? tmp_white_piece : tmp_black_piece), !turn)){
      setTimeout(() => {
        alert("まで" + (moves + 1) + "手にて" + (turn ? "先手": "後手") + "の勝ちです！")
      }, 200);
      return;
    }
  }

  render() {
    const current_pos = this.state.current_pos;
    return (
      <div className="game">
        <div className="game-info-white white">
          <div>{"△"}</div>
          <Captured
            squares={this.state.current_white_piece}
            clicked_piece={this.state.clicked_piece}
            is_black={false}
            turn={this.state.turn}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-board">
          <Board
            squares={current_pos}
            onClick={i => this.handleClick(i)}
            clicked_piece={this.state.clicked_piece}
            final_piece={this.state.final_piece}
          />
        </div>
        <div className="game-info-black">
          <div>{"▲"}</div>
          <Captured
            squares={this.state.current_black_piece}
            clicked_piece={this.state.clicked_piece}
            is_black={true}
            turn={this.state.turn}
            onClick={i => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}

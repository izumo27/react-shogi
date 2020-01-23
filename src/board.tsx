import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import {Setting} from "./setting";
import {Piece} from './pieces/piece';
// import { Pawn } from "./pieces/pawn";
// import { Mt } from "./pieces/mt";
// import {Game} from './game';

interface ISquareProps{
  is_final: boolean;
  is_clicked: boolean;
  value: string;
  is_black: boolean;
  is_captured: boolean;
  onClick: () => void;
}

interface ISquareState{
  is_final: boolean;
  is_clicked: boolean;
  value: string;
  is_black: boolean;
  is_captured: boolean;
}

function Square(props: ISquareProps){
  let class_string: string = "";
  if(props.is_captured){
    class_string = "captured";
  }
  else{
    class_string = "square piece";
    if(!props.is_black){
      class_string = class_string + " white";
    }
  }
  if(props.is_final){
    class_string = class_string + " final";
  }
  if(props.is_clicked){
    class_string = class_string + " attack";
  }
  return (
    <button
      className={class_string}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

interface IBoardProps {
  squares: Piece[][];
  onClick: (i: number) => void;
  clicked_piece: number;
  final_piece: number;
}

interface IBoardState {
  squares: Piece[][];
  onClick: (i: number) => void;
  clicked_piece: number;
  final_piece: number;
}

export class Board extends React.Component<IBoardProps, IBoardState> {

  renderSquare(is_final: boolean, is_clicked: boolean, i: number) {
    let j = i - Setting.WHITE * 2;
    let x: number = Math.floor(j / Setting.LENGTH);
    let y: number = j % Setting.LENGTH;
    return (
      <Square
        key={i}
        is_final={is_final}
        is_clicked={is_clicked}
        value={this.props.squares[x][y].out()}
        is_black={this.props.squares[x][y].turn()}
        is_captured={false}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  content(y: number){
    let content = [];
    for(let x = Setting.LENGTH - 1; x >= 0; --x){
      if(x * Setting.LENGTH + y === this.props.final_piece - Setting.WHITE * 2){
        content.push(this.renderSquare(true, false, x * Setting.LENGTH + y + Setting.WHITE * 2));
      }
      else if(x * Setting.LENGTH + y === this.props.clicked_piece - Setting.WHITE * 2){
        content.push(this.renderSquare(false, true, x * Setting.LENGTH + y + Setting.WHITE * 2));
      }
      else{
        content.push(this.renderSquare(false, false, x * Setting.LENGTH + y + Setting.WHITE * 2));
      }
    }
    return content;
  }

  render() {
    let items = new Array<JSX.Element>();
    for(let y = 0; y < Setting.LENGTH; ++y){
      items = items.concat(<div className="board-row ley" key={y}>{this.content(y)}</div>);
    }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        {items}
      </div>
    );
  }
}

interface ICapturedProps {
  squares: number[];
  clicked_piece: number;
  is_black: boolean;
  turn: boolean;
  onClick: (i: number) => void;
}

interface ICapturedState {
  squares: number[];
  clicked_piece: number;
  is_black: boolean;
  turn: boolean;
  onClick: (i: number) => void;
}

export class Captured extends React.Component<ICapturedProps, ICapturedState> {

  renderSquare(is_clicked: boolean, i: number) {
    if(this.props.is_black){
      return (
        <Square
          key={i}
          is_final={false}
          is_clicked={is_clicked}
          value={Setting.PIECES[i]}
          is_black={true}
          is_captured={true}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
    else{
      return (
        <Square
          key={i}
          is_final={false}
          is_clicked={is_clicked}
          value={Setting.PIECES[i]}
          is_black={false}
          is_captured={true}
          onClick={() => this.props.onClick(i + Setting.WHITE)}
        />
      );
    }
  }

  render() {
    let items = new Array<JSX.Element>();
    const clicked_piece: number = (this.props.turn ? this.props.clicked_piece : this.props.clicked_piece - Setting.WHITE);
    const is_black: boolean = this.props.is_black;
    const turn: boolean = this.props.turn;
    for(let i = 0; i < Setting.WHITE; ++i){
      let num = this.props.squares[i];
      if(num > 0){
        if(i === clicked_piece && is_black === turn){
          items = items.concat(<div className="board-row ley" key={i}>{this.renderSquare(true, i)}</div>);
        }
        else{
          items = items.concat(<div className="board-row ley" key={i}>{this.renderSquare(false, i)}</div>);
        }
        if(num > 1){
          items = items.concat(<div className="board-row ley" key={"num"+i}>{
            <button
              className={"number"}
            >
            {Setting.NUM[num]}
            </button>
          }</div>);
        }
      }
    }

    return (
      <div>
        {items}
      </div>
    );
  }
}

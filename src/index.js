//LICENSE : MIT
"use strict";

import * as lodash from 'lodash';

export default class SudokuSolver {
    constructor(questionBoard, addGroupSet = [], customGroupSet = null){
        if(!this.checkBoardFormat(questionBoard)){
            new Error("questionBoard format is invalid");
        }

        this.board = questionBoard;
        this.width = questionBoard.length;
        if(customGroupSet === null) {
            //デフォルトのグループセットを作成する
            this.groupSet = this.createDefaultGroup(this.width)
            if(addGroupSet !== null){
                this.groupSet = lodash.concat(this.groupSet, addGroupSet);
            }
        }else {
            this.groupSet = customGroupSet;
        }
        this.skip = true;
        this.resultBoard = [];
    }

    /**
     *
     * @param {Array.<Array<number>>} board チェックするボードの情報
     * @returns {boolean} ボードのフォーマットチェック
     */
    checkBoardFormat(board){
        //2次元配列かのチェック
        if(!lodash.isArray(board)) {
            return false;
        }
        //正方形かチェック
        let width = board.length;
        for(let yPoint in board) {
            //縦の長さと一致しないものがある
            if(width !== board[yPoint]) {
                return false;
            }
        }

        return true;
    }

    /**
     * 単純な正方形のgroupを作成
     * @param {number} width ボードの長さ
     * @returns {boolean}
     */
    createDefaultGroup(width) {
        let groupSet = [];
        let sqrt = Math.sqrt(width);
        for(let ySet=0; ySet < width; ySet+=sqrt) {
            for(let xSet=0; xSet < width; xSet+=sqrt) {
                let group = [];
                for(let y=0; y < sqrt; y++) {
                    for(let x=0; x < sqrt; x++) {
                        group.push([y+ySet,x+xSet]);
                    }
                }
                groupSet.push(group);
            }
        }
        return groupSet;
    }

    /**
     * 数独を解く
     * @param skip 回答が見つかってもすべての候補を試す
     * @returns {boolean}
     */
    solve(skip = true){
        console.log("Sudoku.solve");

        this.skip = skip;
        this.runBoard = lodash.cloneDeep(this.board);
        console.log("solve start");
        this.backTrackSolver();
        console.log("solve end");
        return true;
    }

    backTrackSolver(step = 0){
        //skip設定が有効な状態で結果を取得済みなら即終了
        if(this.skip && this.resultBoard.length > 0) {
            return true;
        }

        //stepを全部試し終えたので、結果配列へ追加
        if(step === (this.width ** 2)) {
            console.log('--------------set resultBoard');
            this.resultBoard.push(lodash.cloneDeep(this.runBoard))
            return true;
        }

        //座標計算
        let yPoint = Math.floor(step / this.width);
        let xPoint = step % this.width;

        //値が入っているなら次のステップへ
        if(this.runBoard[yPoint][xPoint] !== 0) {
            this.backTrackSolver(step+1);
        }
        else {
            //各数字をチェックする
            for(let num=1; num <= this.width; num++){
                //配置できるかをチェックして、可能なら配置を試みて再起呼び出し
                if(this.check(num, yPoint, xPoint)){
                    this.runBoard[yPoint][xPoint] = num;
                    /*
                     console.log('backTrackSolver',{
                     xPoint : xPoint,
                     yPoint : yPoint,
                     step   : step,
                     num    : num
                     });
                     */
                    this.backTrackSolver(step+1);

                    //空に戻す
                    this.runBoard[yPoint][xPoint] = 0;

                }
            }
        }
    }

    /**
     * 数値おけるかの各チェックを行う
     * @param {number} num チェックしたい数字
     * @param {number} yPoint チェック対象の行
     * @param {number} xPoint チェック対象の列
     * @returns {boolean} 配置可能の場合はtrue
     */
    check(num, yPoint, xPoint) {
        return this.checkLine(num, yPoint) && this.checkColumn(num, xPoint) && this.checkGroup(num, yPoint, xPoint);
    }

    /**
     * 数字をその行に配置できるかのチェック
     * @param {number} num チェックしたい数字
     * @param {number} yPoint チェック対象の行
     * @returns {boolean} 配置可能の場合はtrue
     */
    checkLine(num, yPoint) {
        for(let xPoint=0; xPoint < this.width; xPoint++) {
            if(this.runBoard[yPoint][xPoint] === num) {
                return false;
            }
        }
        return true;
    }
    /**
     * 数字をその列に配置できるかのチェック
     * @param {number} num チェックしたい数字
     * @param {number} xPoint チェック対象の列
     * @returns {boolean} 配置可能の場合はtrue
     */
    checkColumn(num, xPoint) {
        for(let yPoint=0; yPoint < this.width; yPoint++) {
            if(this.runBoard[yPoint][xPoint] === num) {
                return false;
            }
        }
        return true;
    }
    /**
     * 数字をそのグループに配置できるかのチェック
     * @param {number} num チェックしたい数字
     * @param {number} yPoint チェック対象の行
     * @param {number} xPoint チェック対象の列
     * @returns {boolean} 配置可能の場合はtrue
     */
    checkGroup(num, yPoint, xPoint) {
        //その座標が属しているグループを取得する
        let targetGroups = lodash.filter(this.groupSet, (groupSet) => {
            return lodash.find(groupSet, (group) => {
                return lodash.isEqual(group, [yPoint,  xPoint])
            })
        })

        //グループごとにチェック
        for(let grpIdx=0; grpIdx < targetGroups.length; grpIdx++) {
            for(let setIdx=0; setIdx < targetGroups[grpIdx].length; setIdx++){
                let targetPoint = targetGroups[grpIdx][setIdx];
                let targetNumber = lodash.get(this.runBoard, targetPoint);
                if(targetNumber === num) {
                    return false;
                }
            }
        }

        return true;
    }
}

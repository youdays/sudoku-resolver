# sudoku-resolver

数独を解く

## USAGE

サンプル実行
```bash
$ npm start

> sudoku-resolver@1.0.0 start /Users/yuematsu/WebstormProjects/sudoku-resolver
> babel-node index.js --presets es2015,stage-2

Sudoku.solve
solve start
--------------set resultBoard
solve end
[ [ [ 7, 8, 1, 5, 2, 6, 4, 3, 9 ],
    [ 3, 2, 4, 8, 9, 1, 7, 6, 5 ],
    [ 6, 5, 9, 3, 7, 4, 8, 1, 2 ],
    [ 9, 4, 8, 2, 5, 3, 6, 7, 1 ],
    [ 1, 3, 7, 9, 6, 8, 2, 5, 4 ],
    [ 5, 6, 2, 4, 1, 7, 9, 8, 3 ],
    [ 2, 1, 5, 6, 8, 9, 3, 4, 7 ],
    [ 8, 7, 3, 1, 4, 2, 5, 9, 6 ],
    [ 4, 9, 6, 7, 3, 5, 1, 2, 8 ] ] ]

```

## CODE
```angular2html
let sr = new SudokuSolver(questionBoard);
sr.solve(false);
```

クラスをnewして、`resolve`関数を実行する

* constructor

parameter | 必須 | パラメータ | 概要
----------|------|----------|------
questionBoard | :white_check_mark: | `Array.<Array<number>>` | 問題の二次元配列
addGroupSet |  | `Array.<Array.Array<<number>>>` | 追加のグループ設定
customGroupSet | | `Array.<Array.Array<<number>>>` | 通常のルールを無視してのグループ設定(addGroupSetも無視する)

* resolve

parameter | 必須 | パラメータ | 概要
----------|-----|----------|------
skip      |     | `bookean` | `true` : 回答を1つ取得したら終了する(デフォルト)<br/>`false` : 回答候補をすべて取得するように処理する


`solve`関数実行後は`resultBoard`に回答が配置される

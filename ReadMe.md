# Tic Tac Toe

A browser Tic Tac Toe game in plain HTML, CSS and JavaScript, with an unbeatable minimax AI.

## Features

- **Two modes:** two players on one computer, or single player against the computer.
- **Two AI levels:** Easy plays random moves; Hard uses the minimax algorithm, which searches every
  possible continuation and never loses.
- **Undo** the last move, and a **running score** of wins and draws.
- **Four colour themes:** Dark, Sunset, Ocean and Forest.
- **Export** the current board as a JSON file.

## How the AI works

On Hard, the computer (O) tries every empty square, then recursively plays out the rest of the game
assuming both sides play perfectly. A position scores +1 if O wins, −1 if X wins and 0 for a draw,
and the computer picks the move with the best guaranteed score. The 3×3 board is small enough to
search completely, so no depth limit is needed.

## Run it

Play it at [georgepol1023.github.io/TicTacToe](https://georgepol1023.github.io/TicTacToe/), or
clone the repo and open `index.html` in your browser.

## Built with

HTML, CSS and JavaScript, with no libraries.

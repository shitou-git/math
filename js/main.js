import { showGame, goHome, renderCounter, currentGame, confirmResetCounter } from './utils.js';
import { initSudoku } from './sudoku.js';
import { resetMagicGame, showMagicSolution, checkMagicAnswer } from './magic-square.js';
import { resetPoint24Game, showPoint24Solution, checkPoint24Answer } from './add-sub.js';
import { resetMultdivGame, showMultdivSolution, checkMultdivAnswer } from './mult-div.js';
import { initAoshu, getAoshuHtml } from './aoshu.js';
import { initFormulas, getFormulasHtml } from './formulas.js';

function injectDynamicPages() {
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('beforeend', getAoshuHtml());
    container.insertAdjacentHTML('beforeend', getFormulasHtml());
}

function navigateTo(game) {
    showGame(game);

    switch (game) {
        case 'sudoku':
            initSudoku();
            break;
        case 'magic':
            resetMagicGame();
            break;
        case 'point24':
            resetPoint24Game();
            break;
        case 'multdiv':
            resetMultdivGame();
            break;
        case 'aoshu':
            initAoshu();
            break;
        case 'formulas':
            initFormulas();
            break;
    }
}

function goToHome() {
    goHome();
}

function initHomeCards() {
    document.querySelectorAll('.game-card[data-game]').forEach(card => {
        card.addEventListener('click', () => {
            const game = card.dataset.game;
            navigateTo(game);
        });
    });
}

function registerGlobalFunctions() {
    window.goHome = goToHome;
    window.showGame = navigateTo;
    window.confirmResetCounter = confirmResetCounter;
    window.resetMagicGame = resetMagicGame;
    window.showMagicSolution = showMagicSolution;
    window.checkMagicAnswer = checkMagicAnswer;
    window.resetPoint24Game = resetPoint24Game;
    window.showPoint24Solution = showPoint24Solution;
    window.checkPoint24Answer = checkPoint24Answer;
    window.resetMultdivGame = resetMultdivGame;
    window.showMultdivSolution = showMultdivSolution;
    window.checkMultdivAnswer = checkMultdivAnswer;
}

document.addEventListener('DOMContentLoaded', () => {
    injectDynamicPages();
    initHomeCards();
    registerGlobalFunctions();

    renderCounter('point24');
    renderCounter('multdiv');
});

export { navigateTo, goToHome };

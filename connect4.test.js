describe('create the in-memory game board', () => {
    it('should create the in-memory game board', () => {
        expect(board.length).toEqual(6);
        expect(board[0].length).toEqual(7);
    });

    afterEach(() => {
        board = [];
    })
});

describe('create the html board', () => {
    let gameBoard = document.querySelector('#board');
    
    it('should create a game board in the DOM', () => {
        makeHtmlBoard();
        expect(gameBoard.childElementCount).toBe(14);
        let WIDTH = 10;
        let HEIGHT = 5;
        makeHtmlBoard();
        expect(gameBoard.childElementCount).toBeGreaterThan(14);
    });

    afterEach(() => {
        gameBoard.innerHTML = '';
    });
});

describe('return the name of the appropriate CSS class', () => {
    it('should return a class name based on game piece position', () => {
        expect(addClass(null)).toEqual('zero');
        expect(addClass(3)).toEqual('three');
        expect(addClass(10)).toEqual(undefined);
    });
});

describe('return the lowest available row to place a chip in', () => {
    let gameBoard = document.querySelector('#board');

    afterEach(() => {
        gameBoard.innerHTML = '';
    });

    it('should return a number 0-5 or null', () => {
        makeBoard();
        makeHtmlBoard();
        let allTds = document.querySelectorAll('td')
        for (let td of allTds) {
            let id = td.id
            if (id === '0-1' || id === '0-0') {
                let testDiv = document.createElement('div');
                td.append(testDiv);
            }
        }
        expect(findSpotForCol(0)).toEqual(4);
    });
});

describe('create the in-memory game board', () => {
    it('should create the in-memory game board', () => {
        expect(board.length).toEqual(6);
        expect(board[0].length).toEqual(7);
    });
});

describe('create the html board', () => {
    let gameBoard = document.querySelector('#board');
    
    it('should create a game board in the DOM with 7 child elements', () => {
        expect(gameBoard.childElementCount).toBe(7);
    });
});

describe('return the name of the appropriate CSS class', () => {
    it('should return a class name based on game piece position', () => {
        expect(addClass(null)).toEqual('zero');
        expect(addClass(3)).toEqual('three');
        expect(addClass(10)).toEqual(undefined);
        expect(addClass(4)).toEqual('four');
        expect(addClass(1)).toEqual('one');
        expect(addClass(5)).toEqual('five');
        expect(addClass(2)).toEqual('two');
    });
});

describe('return the lowest available row to place a chip in', () => {
    let gameBoard = document.querySelector('#board');

    it('should return 4', () => {
        let allTds = document.querySelectorAll('td')
        for (let td of allTds) {
            let id = td.id
            if (id === '0-1' || id === '0-0') {
                let testDiv = document.createElement('div');
                td.append(testDiv);
            };
        };
        expect(findSpotForCol(0)).toEqual(4);
    });
});
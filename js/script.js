let balance = 1000;
const bet = 50;
const symbols = [
    "symbol1.png",
    "symbol2.png",
    "symbol3.png",
    "symbol4.png",
    "symbol5.png",
    "symbol6.png",
    "symbol7.png"
];

document.addEventListener("DOMContentLoaded", function() {
    const spinSound = document.getElementById('spin-sound');
    const winSound = document.getElementById('win-sound');

    window.play = function() {
        if (balance < bet) {
            alert('Você não tem créditos suficientes para jogar.');
            return;
        }

        spinSound.play();
        balance -= bet;
        document.getElementById('balance').innerText = `Créditos: R$ ${balance}`;

        const reels = document.querySelectorAll('.reel');

        // Animação de rotação
        let animationFrames = 10;
        let animationInterval = setInterval(() => {
            for (let reel of reels) {
                let symbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.src = `images/${symbol}`;
            }
            if (--animationFrames <= 0) {
                clearInterval(animationInterval);
                displayResult(reels);
            }
        }, 100);
    }

    function displayResult(reels) {
        const result = Array.from({ length: 3 }, () => 
            Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)])
        );

        result.flat().forEach((symbol, index) => {
            reels[index].src = `images/${symbol}`;
        });

        const { winnings, winningPositions } = calculateWinnings(result);
        balance += winnings;

        if (winnings > 0) {
            document.getElementById('result').innerText = `VOCÊ GANHOU R$ ${winnings}!!!`;
            winSound.play();
        } else {
            document.getElementById('result').innerText = "Não ganhou";
        }
        
        document.getElementById('balance').innerText = `Créditos: R$ ${balance}`;

        // Limpar destaques antigos
        reels.forEach(reel => reel.classList.remove('win'));

        // Adicionar destaques às posições vencedoras
        winningPositions.forEach(([row, col]) => {
            const index = row * 3 + col;
            reels[index].classList.add('win');
        });
    }

    function calculateWinnings(result) {
        let winnings = 0;
        const winningPositions = [];

        // Verificar linhas horizontais
        for (let row = 0; row < 3; row++) {
            if (result[row][0] === result[row][1] && result[row][1] === result[row][2]) {
                if (row === 1 && result[row][0] === "symbol7.png") {
                    winnings += 500;
                } else if (row === 1) {
                    winnings += 150;
                } else {
                    winnings += 200;
                }
                winningPositions.push([row, 0], [row, 1], [row, 2]);
            }
        }

        // Verificar linhas verticais
        for (let col = 0; col < 3; col++) {
            if (result[0][col] === result[1][col] && result[1][col] === result[2][col]) {
                if (col === 1) {
                    winnings += 150;
                } else {
                    winnings += 100;
                }
                winningPositions.push([0, col], [1, col], [2, col]);
            }
        }

        // Verificar diagonais
        if (result[0][0] === result[1][1] && result[1][1] === result[2][2]) {
            winnings += 75;
            winningPositions.push([0, 0], [1, 1], [2, 2]);
        }
        if (result[0][2] === result[1][1] && result[1][1] === result[2][0]) {
            winnings += 75;
            winningPositions.push([0, 2], [1, 1], [2, 0]);
        }

        return { winnings, winningPositions };
    }
});
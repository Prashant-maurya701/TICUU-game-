// Game Variables
let turnO = true; //playerX, playerO
let count = 0; //To Track Draw
let player1Name = "Player 1";
let player2Name = "Player 2";
let soundEnabled = true; // Sound toggle state

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
];

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available, show update prompt
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Function to show update notification
function showUpdateNotification() {
    const updateDiv = document.createElement('div');
    updateDiv.id = 'update-notification';
    updateDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00d4ff, #0099cc);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 300px;
        ">
            <p style="margin: 0 0 10px 0; font-weight: bold;">App Update Available!</p>
            <p style="margin: 0 0 15px 0; font-size: 14px;">A new version of Tic Tac Toe is ready. Refresh to get the latest features.</p>
            <button id="update-btn" style="
                background: white;
                color: #0099cc;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-right: 10px;
            ">Update Now</button>
            <button id="dismiss-btn" style="
                background: transparent;
                color: white;
                border: 1px solid white;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Later</button>
        </div>
    `;
    document.body.appendChild(updateDiv);

    document.getElementById('update-btn').addEventListener('click', () => {
        // Tell the service worker to skip waiting
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        // Reload the page
        window.location.reload();
    });

    document.getElementById('dismiss-btn').addEventListener('click', () => {
        updateDiv.remove();
    });
}

// Play welcome audio when the page loads
window.addEventListener('load', () => {
    console.log('Page loaded, attempting to play welcome audio...');
    if (soundEnabled) {
        const welcomeAudio = new Audio('AUDIO/welcome .mp3');
        welcomeAudio.volume = 0.5; // Set volume to ensure it's audible
        welcomeAudio.play().then(() => {
            console.log('Welcome audio played successfully');
        }).catch(error => {
            console.log('Welcome audio play failed:', error);
        });
    }

    // Hide splash screen after 2 seconds and show choose side screen
    setTimeout(() => {
        console.log('Hiding splash screen and showing choose side screen');
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.style.display = 'none'; // Force hide splash screen

        // Show the choose side screen after splash screen hides
        const chooseSideScreen = document.getElementById('choose-side-screen');
        chooseSideScreen.classList.remove('hide');
        chooseSideScreen.style.display = 'flex'; // Ensure it's visible
        console.log('Choose side screen should now be visible');
    }, 2000);
});

// DOM Elements
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-button");
let gameEndBtn = document.querySelector("#game-end-button");
let newGameBtn = document.querySelector("#new-button");
let msgContainer = document.querySelector(".msg-box");
let msg = document.querySelector("#msg");
let preGameScreen = document.querySelector("#pre-game-screen");
let chooseSideScreen = document.querySelector("#choose-side-screen");
let gameScreen = document.querySelector("#game-screen");
let startGameBtn = document.querySelector("#start-game-btn");
let startGameBtn2 = document.querySelector("#start-game-btn-2");
let player1Input = document.querySelector("#player1-name");
let player2Input = document.querySelector("#player2-name");
let player1Display = document.querySelector("#player1-display");
let player2Display = document.querySelector("#player2-display");
let player1Info = document.querySelector(".players-display .player-info:first-child");
let player2Info = document.querySelector(".players-display .player-info:last-child");
let chooseO = document.querySelector("#choose-o");
let chooseX = document.querySelector("#choose-x");
let symbolBtns = document.querySelectorAll(".symbol-btn");
let soundToggleBtn = document.querySelector("#sound-toggle");
let soundToggleGameBtn = document.querySelector("#sound-toggle-game");

// Initialize sound toggle game button
if (soundToggleGameBtn) {
    soundToggleGameBtn.textContent = soundEnabled ? "🔊" : "🔇";
}

// Check if elements exist before adding event listeners
if (!player1Input || !player2Input) {
    console.error("Player input elements not found");
}
if (!symbolBtns || symbolBtns.length === 0) {
    console.error("Symbol buttons not found");
}
if (!startGameBtn2) {
    console.error("Start game button 2 not found");
}

// Input field audio
if (player1Input) {
    player1Input.addEventListener("keydown", (event) => {
        // Only play audio for actual character keys, not control keys
        if (soundEnabled && (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete')) {
            const inputAudio = new Audio('AUDIO/input-filed.mp3');
            inputAudio.volume = 0.3; // Lower volume for typing audio
            inputAudio.play().catch(error => console.log('Input audio play failed:', error));
        }
    });
}

if (player2Input) {
    player2Input.addEventListener("keydown", (event) => {
        // Only play audio for actual character keys, not control keys
        if (soundEnabled && (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete')) {
            const inputAudio = new Audio('AUDIO/input-filed.mp3');
            inputAudio.volume = 0.3; // Lower volume for typing audio
            inputAudio.play().catch(error => console.log('Input audio play failed:', error));
        }
    });
}



// Symbol selection functionality
symbolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Play button press audio
        if (soundEnabled) {
            const buttonAudio = new Audio('AUDIO/button-press-382713.mp3');
            buttonAudio.volume = 0.5;
            buttonAudio.play().catch(error => console.log('Symbol button audio play failed:', error));
        }

        // Remove selected class from all buttons
        symbolBtns.forEach(b => b.classList.remove("selected"));
        // Add selected class to clicked button
        btn.classList.add("selected");
        console.log("Button clicked:", btn.dataset.symbol);
    });
});

// Sound toggle functionality
if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
        if (soundToggleGameBtn) {
            soundToggleGameBtn.textContent = soundEnabled ? "🔊" : "🔇";
        }
    });
}

if (soundToggleGameBtn) {
    soundToggleGameBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundToggleGameBtn.textContent = soundEnabled ? "🔊" : "🔇";
        if (soundToggleBtn) {
            soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
        }
    });
}



if (startGameBtn2) {
    startGameBtn2.addEventListener("click", () => {
        // Play start game audio
        if (soundEnabled) {
            const startAudio = new Audio('AUDIO/start-game388923.mp3');
            startAudio.play().catch(error => console.log('Start game audio play failed:', error));
        }

        // Play welcome audio on button click to ensure it plays
        if (soundEnabled) {
            const welcomeAudio = new Audio('AUDIO/welcome .mp3');
            welcomeAudio.play().catch(error => console.log('Welcome audio play failed:', error));
        }

        // Determine who starts based on selection
        const selectedSymbol = document.querySelector(".symbol-btn.selected");
        if (selectedSymbol) {
            turnO = selectedSymbol.dataset.symbol === "O";
            console.log("Selected symbol:", selectedSymbol.dataset.symbol, "turnO set to:", turnO);

            // Update player display based on choice
            if (selectedSymbol.dataset.symbol === "O") {
                player1Display.textContent = "O";
                player2Display.textContent = "X";
                player1Info.style.color = "#ff1493"; // Pink for O
                player2Info.style.color = "#00d4ff"; // Blue for X
            } else {
                player1Display.textContent = "X";
                player2Display.textContent = "O";
                player1Info.style.color = "#00d4ff"; // Blue for X
                player2Info.style.color = "#ff1493"; // Pink for O
            }
        } else {
            // Default to O if nothing selected
            turnO = true;
            console.log("No symbol selected, defaulting to O, turnO:", turnO);
            player1Display.textContent = "O";
            player2Display.textContent = "X";
            player1Info.style.color = "#ff1493"; // Pink for O
            player2Info.style.color = "#00d4ff"; // Blue for X
        }

        chooseSideScreen.classList.add("hide");
        gameScreen.classList.remove("hide");

        resetGame();
    });
}

// Game functionality
const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        // Play button press audio
        if (soundEnabled) {
            const buttonAudio = new Audio('AUDIO/button-press-382713.mp3');
            buttonAudio.play().catch(error => console.log('Button audio play failed:', error));
        }

        if (turnO) {
            //playerO
            box.innerText = "O";
            box.classList.add("o-symbol");
            turnO = false;
        } else {
            //playerX
            box.innerText = "X";
            box.classList.add("x-symbol");
            turnO = true;
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();

        if (count === 9 && !isWinner) {
            gameDraw();
        }
    });
});

const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();

    // Play draw audio
    if (soundEnabled) {
        const drawAudio = new Audio('AUDIO/game-draw-417465.mp3');
        drawAudio.play().catch(error => console.log('Draw audio play failed:', error));
    }
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("o-symbol", "x-symbol");
    }
};

const showWinner = (winner) => {
    msg.innerText = `Winner!`;

    // Update winner announcement elements
    document.getElementById("congratulations-text").textContent = "Congratulations";
    document.getElementById("winner-name-display").textContent = winner; // Show winner symbol (O or X)

    document.getElementById("trophy").classList.remove("hide");
    let loserSymbol = winner === player1Display.textContent ? player2Display.textContent : player1Display.textContent;
    document.getElementById("sympathy").textContent = "😔 Better luck next time, " + loserSymbol + "!";
    document.getElementById("sympathy").classList.remove("hide");
    msgContainer.classList.remove("hide");
    disableBoxes();

    // Play winning audio
    if (soundEnabled) {
        const winningAudio = new Audio('AUDIO/winning-218995.mp3');
        winningAudio.play().catch(error => console.log('Audio play failed:', error));
    }

    // Create all celebration effects
    createConfetti();
    createFlowers();
    createFirecrackers();
    createStars();
    createSquares();
    createRibbons();

    // Automatically return to choose side screen after 5 seconds
    setTimeout(() => {
        gameScreen.classList.add("hide");
        chooseSideScreen.classList.remove("hide");
        chooseSideScreen.style.display = 'flex'; // Ensure it's visible
        resetGame();

        // Play welcome audio when returning to choose side screen
        console.log('Attempting to play welcome audio after win...');
        if (soundEnabled) {
            const welcomeAudio = new Audio('AUDIO/welcome .mp3');
            welcomeAudio.volume = 0.7; // Increase volume
            welcomeAudio.play().then(() => {
                console.log('Welcome audio played successfully after win');
            }).catch(error => {
                console.log('Welcome audio play failed after win:', error);
            });
        }
    }, 5000);
};

const createConfetti = () => {
    const confettiContainer = document.getElementById("confetti-container");
    confettiContainer.classList.remove("hide");
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.animationDelay = Math.random() * 4 + "s";
        confettiContainer.appendChild(confetti);
    }
    setTimeout(() => {
        confettiContainer.classList.add("hide");
        confettiContainer.innerHTML = "";
    }, 4000);
};

const createFlowers = () => {
    const flowersContainer = document.getElementById("flowers-container");
    flowersContainer.classList.remove("hide");
    for (let i = 0; i < 20; i++) {
        const flower = document.createElement("div");
        flower.classList.add("flower");
        flower.style.left = Math.random() * 100 + "%";
        flower.style.animationDelay = Math.random() * 5 + "s";
        flower.textContent = ["🌸", "🌺", "🌻", "🌹"][Math.floor(Math.random() * 4)];
        flowersContainer.appendChild(flower);
    }
    setTimeout(() => {
        flowersContainer.classList.add("hide");
        flowersContainer.innerHTML = "";
    }, 5000);
};

const createFirecrackers = () => {
    const firecrackerContainer = document.getElementById("firecracker-container");
    firecrackerContainer.classList.remove("hide");
    for (let i = 0; i < 10; i++) {
        const firecracker = document.createElement("div");
        firecracker.classList.add("firecracker");
        firecracker.style.left = Math.random() * 100 + "%";
        firecracker.style.top = Math.random() * 100 + "%";
        firecracker.textContent = "🎆";
        firecrackerContainer.appendChild(firecracker);
    }
    setTimeout(() => {
        firecrackerContainer.classList.add("hide");
        firecrackerContainer.innerHTML = "";
    }, 2000);
};

const createStars = () => {
    const starsContainer = document.getElementById("stars-container");
    starsContainer.classList.remove("hide");
    for (let i = 0; i < 30; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        star.textContent = ["⭐", "✨", "🌟"][Math.floor(Math.random() * 3)];
        starsContainer.appendChild(star);
    }
    setTimeout(() => {
        starsContainer.classList.add("hide");
        starsContainer.innerHTML = "";
    }, 3000);
};

const createSquares = () => {
    const squaresContainer = document.getElementById("squares-container");
    squaresContainer.classList.remove("hide");
    for (let i = 0; i < 25; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.style.left = Math.random() * 100 + "%";
        square.style.animationDelay = Math.random() * 4 + "s";
        squaresContainer.appendChild(square);
    }
    setTimeout(() => {
        squaresContainer.classList.add("hide");
        squaresContainer.innerHTML = "";
    }, 4000);
};

const createRibbons = () => {
    const ribbonsContainer = document.getElementById("ribbons-container");
    ribbonsContainer.classList.remove("hide");
    for (let i = 0; i < 15; i++) {
        const ribbon = document.createElement("div");
        ribbon.classList.add("ribbon");
        ribbon.style.left = Math.random() * 100 + "%";
        ribbon.style.animationDelay = Math.random() * 3.5 + "s";
        ribbon.textContent = ["🎀", "🎗️", "🏵️"][Math.floor(Math.random() * 3)];
        ribbonsContainer.appendChild(ribbon);
    }
    setTimeout(() => {
        ribbonsContainer.classList.add("hide");
        ribbonsContainer.innerHTML = "";
    }, 3500);
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true;
            }
        }
    }
};

newGameBtn.addEventListener("click", () => {
    // Play new game audio
    if (soundEnabled) {
        const newGameAudio = new Audio('AUDIO/new -game-270302.mp3');
        newGameAudio.play().catch(error => console.log('New game audio play failed:', error));
    }

    gameScreen.classList.add("hide");
    chooseSideScreen.classList.remove("hide");

    // Play welcome audio when choose side screen is displayed
    console.log('Attempting to play welcome audio...');
    if (soundEnabled) {
        const welcomeAudio = new Audio('AUDIO/welcome .mp3');
        welcomeAudio.volume = 0.5; // Set volume to ensure it's audible
        welcomeAudio.play().then(() => {
            console.log('Welcome audio played successfully');
        }).catch(error => {
            console.log('Welcome audio play failed:', error);
        });
    }
});

resetBtn.addEventListener("click", () => {
    // Play reset game audio
    if (soundEnabled) {
        const resetAudio = new Audio('AUDIO/reset-game.mp3');
        resetAudio.play().catch(error => console.log('Reset game audio play failed:', error));
    }

    resetGame();
});

if (gameEndBtn) {
    gameEndBtn.addEventListener("click", () => {
        // Play button press audio
        if (soundEnabled) {
            const buttonAudio = new Audio('AUDIO/button-press-382713.mp3');
            buttonAudio.volume = 0.5;
            buttonAudio.play().catch(error => console.log('Game end button audio play failed:', error));
        }

        // Go back to choose side screen
        gameScreen.classList.add("hide");
        chooseSideScreen.classList.remove("hide");

        // Reset game state
        resetGame();
    });
}

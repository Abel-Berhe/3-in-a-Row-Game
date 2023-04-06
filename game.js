//IIFI 
(() => {
    const container = document.querySelector("#theGame");
    let correctStates = [];
    let rowCount = 0;
    let counter = 0;
    let seconds = 0;
    let timer;
    let checkbox = document.createElement("input");
    let showIncorrect = document.createElement("label");
    let displayMsg = document.createElement("label");
    let displayTime = document.createElement("div");
    let text = document.createElement("label");
    let duration = document.createElement("label");
    fetch('https://prog2700.onrender.com/threeinarow/6x6')
        //fetch('https://prog2700.onrender.com/threeinarow/random')
        .then((response) => response.json())
        .then((data) => {
            let table = document.createElement("table");
            let tbody = document.createElement("tbody");
            let check = document.createElement("button");
            let answer = document.createElement("button");
            let reset = document.createElement("button");
            data.rows.map((row) => {
                let r = document.createElement("tr");
                row.map((cell) => {
                    rowCount++;
                    let td = document.createElement("td");
                    td.style.width = "40px";
                    td.style.height = "40px";
                    td.style.border = "1px solid black"
                    td.classList.add("square");
                    td.dataset.toggle = cell.canToggle;
                    td.dataset.currentState = cell.currentState.toString();
                    td.dataset.correctState = cell.correctState.toString();
                    setBackgroundColor(td.dataset.currentState, td);
                    correctStates.push(cell.correctState);
                    //change bg color when a cell clicked based on the current state
                    td.addEventListener("click", () => {
                        counter++;
                        if (td.dataset.toggle === "true") {
                            if (td.dataset.currentState === "0") {
                                td.dataset.currentState = "1";
                            } else if (td.dataset.currentState === "1") {
                                td.dataset.currentState = "2";
                            } else if (td.dataset.currentState === "2") {
                                td.dataset.currentState = "0";
                            }
                            setBackgroundColor(td.dataset.currentState, td);
                            displayMsg.textContent = "";
                            //check whether the puzzle has been solved, and if it has, indicate that the game has ended
                            let result = isPuzzleSolved();
                            if (result == true) {
                                showAnswer();
                                getFormattedTime();
                                stopTimer()
                                displayMsg.textContent = "Yod did it!"
                            }
                            if (counter == 1) {
                                startTimer()
                            }


                            td.textContent = "";
                        }
                    });

                    r.dataset.rowCount = rowCount;
                    r.appendChild(td);
                });
                rowCount = 0;
                tbody.appendChild(r)
            });

            table.style.borderCollapse = "collapse"
            table.appendChild(tbody);

            check.style.width = "80px";
            check.style.height = "30px";
            check.style.border = "1px"
            check.style.borderRadius = "10px"
            check.style.marginTop = "10px";
            check.style.backgroundColor = "#aaaaaa";
            check.textContent = "check";

            reset.style.width = "80px";
            reset.style.height = "30px";
            reset.style.border = "1px"
            reset.style.borderRadius = "10px"
            reset.style.marginTop = "10px";
            reset.style.backgroundColor = "#aaaaaa";
            reset.style.marginLeft = "20px"
            reset.textContent = "reset";


            answer.style.width = "80px";
            answer.style.height = "30px";
            answer.style.border = "1px"
            answer.style.borderRadius = "10px"
            answer.style.marginTop = "10px";
            answer.style.marginLeft = "20px";
            answer.style.backgroundColor = "#45B8AC";
            answer.textContent = "solve";

            showIncorrect.textContent = "show incorrect"
            showIncorrect.style.fontSize = "19px"
            showIncorrect.style.marginLeft = "40px";

            displayMsg.style.fontSize = "15";
            displayMsg.style.fontSize = "100%";
            displayMsg.style.marginTop = "20px";
            displayMsg.style.display = "flex";

            displayTime.style.width = "50px";
            displayTime.style.height = "50px";
            displayTime.style.border = "2px solid blue";
            displayTime.style.borderRadius = "50%";
            displayTime.style.display = "flex";
            displayTime.style.justifyContent = "center";
            displayTime.style.alignItems = "center";
            displayTime.style.marginLeft = "100px";
            displayTime.style.marginBottom = "20px";

            checkbox.type = "checkbox";
            checkbox.addEventListener("change", (event) => {
                if (event.currentTarget.checked) {
                    showMistakes();
                }

            })

            container.appendChild(displayTime);
            container.appendChild(table);
            container.appendChild(check);
            container.appendChild(answer);
            container.appendChild(reset);
            container.appendChild(showIncorrect);
            container.appendChild(checkbox);
            container.appendChild(displayMsg);
            container.appendChild(duration);



            check.addEventListener("click", checkCurrentProgress);
            answer.addEventListener("click", showAnswer);
            reset.addEventListener("click", resetGame);

        });



    //set background color based on the current state of td
    let setBackgroundColor = (currState, element) => {
        if (currState === "0") {
            element.style.backgroundColor = "#aaaaaa";
        } else if (currState === "1") {
            element.style.backgroundColor = "#003399";
        } else if (currState === "2") {
            element.style.backgroundColor = "white";
        }
    }


    //check the current progress of the game
    let checkCurrentProgress = () => {
        let matrix = [];
        let subArr = [];
        let tdsArray = [];
        let count = 0;
        let tds = document.querySelectorAll(".square");
        let tr = document.querySelector("tr");
        rowCount = tr.dataset.rowCount;
        tdsArray = [...tds];
        for (let i = 0; i < tdsArray.length; i++) {
            count++;
            subArr.push(tdsArray[i].dataset.currentState)
            if (count == rowCount) {
                matrix.push(subArr);
                subArr = [];
                count = 0;
            }
        }

        let result = hasThreeInARow(matrix);
        if (result === true) {
            alert("3-in-A-Row");
        }

        let squareState = checkCurrentSquareState();
        let solved = isPuzzleSolved();
        if (solved === true) {
            displayMsg.style.color = "blue";
            displayMsg.textContent = "Yod did it!"
            getFormattedTime();
            stopTimer()
        } else {
            if (squareState === true) {
                displayMsg.textContent = "So far So Good!"
                displayMsg.style.color = "green";
            } else {
                displayMsg.textContent = "Mistake found!"
                displayMsg.style.color = "red";
            }
        }

    }

    //solve the puzzle using the correct state of td
    let showAnswer = () => {
        let squares = document.querySelectorAll(".square");
        let squareArray = [...squares];

        squareArray.map((square) => {
            square.dataset.currentState = square.dataset.correctState;
            if (square.dataset.currentState == "1") {
                square.style.backgroundColor = "green";
            } else if (square.dataset.currentState == "2") {
                square.style.backgroundColor = "white";
            }
        });


    }

    //check for 3-in-a-row 
    hasThreeInARow = (arr) => {
        const numRows = arr.length;
        const numCols = arr[0].length;

        // Check for horizontal and vertical rows
        return arr.some((row, rowIndex) =>
            row.some((_, colIndex) =>
            (
                // Check for horizontal row
                ((colIndex < numCols - 2 && row[colIndex] == '1' && row[colIndex + 1] == '1' && row[colIndex + 2] == '1') || (row[colIndex] == '2' && row[colIndex + 1] == '2' && row[colIndex + 2] == '2')) ||
                // Check for column
                ((rowIndex < numRows - 2 && arr[rowIndex][colIndex] == '1' && arr[rowIndex + 1][colIndex] == '1' && arr[rowIndex + 2][colIndex] == '1') || (rowIndex < numRows - 2 && arr[rowIndex][colIndex] == '2' && arr[rowIndex + 1][colIndex] == '2' && arr[rowIndex + 2][colIndex] == '2'))
            )
            )
        );
    }

    //check for incorrect state for each square
    let checkCurrentSquareState = () => {
        let squares = document.querySelectorAll(".square");
        let squareArray = [...squares];

        for (let i = 0; i < squareArray.length; i++) {
            if (squareArray[i].dataset.currentState !== "0") {
                if (squareArray[i].dataset.currentState !== squareArray[i].dataset.correctState) {
                    return false;
                }
            }
        }
        return true;
    }

    //check if puzzle is solved
    let isPuzzleSolved = () => {
        let squares = document.querySelectorAll(".square");
        let squareArray = [...squares];

        for (let i = 0; i < squareArray.length; i++) {
            if (squareArray[i].dataset.currentState !== squareArray[i].dataset.correctState) {
                return false;
            }
        }
        return true;
    }


    //mark the incorrect spots 
    let showMistakes = () => {
        let squares = document.querySelectorAll(".square");
        let squareArray = [...squares];

        for (let i = 0; i < squareArray.length; i++) {
            if (squareArray[i].dataset.currentState !== "0") {
                if (squareArray[i].dataset.currentState !== squareArray[i].dataset.correctState) {
                    squareArray[i].textContent = "!";
                    squareArray[i].style.color = "red";
                } else {
                    squareArray[i].textContent = "";
                }
            } else {
                squareArray[i].textContent = "";
            }
        }
    }

    //reset game
    let resetGame = () => {
        location.reload();
    }

    function startTimer() {
        timer = setInterval(function () {
            seconds++;
            text.textContent = seconds;
            text.style.color = "blue";
            displayTime.appendChild(text);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        seconds = 0;
    }

    let getFormattedTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        duration.textContent = `Duration ${minutes} : ${remainingSeconds} minutes`
    }

})();   
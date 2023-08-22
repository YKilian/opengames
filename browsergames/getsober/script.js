document.addEventListener("DOMContentLoaded", function () {
    let sendButton = document.getElementById("send");
    sendButton.addEventListener("click", sendMessage);
    let input = document.getElementById("input");

    let allOptions = [];
    let avlOptions = [];
    let sysOptions = [];
    let naratorData;

    let username = "You";
    let position = 0;
    let gameStarted = false;
    let gameOver = false;
    let achievments = [];

    let num_drinks = 5;
    let coin_found = [false, false]; //[collected; having]

    let visited_table = [false, false, false];

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    input.addEventListener("input", function () {
        if (input.value.length > 0) {
            sendButton.classList.add('green');
        } else {
            sendButton.classList.remove('green');
        }
    });

    function sendMessage() {
        var message = input.value;
        input.value = "";
        if (message.length > 0) {
            logic(message.toLowerCase());
        }
    }

    async function addToChat(from, message) {
        return new Promise(function (resolve) {
            var sender;
            var shouldType = false;
            var chatview = document.getElementById("chatview");
            var chatItem = document.createElement("div");
            switch (from) {
                case -3:
                    sender = "Game Over"
                    chatItem.className = "chatItemEnd";
                    break;
                case -2:
                    sender = "Achievment unlocked";
                    chatItem.className = "chatItemAch";
                    break;
                case -1:
                    sender = "System:";
                    chatItem.className = "chatItemSys";
                    break;
                case 0:
                    sender = "Narator:";
                    chatItem.className = "chatItemNar";
                    shouldType = true;
                    break;
                case 1:
                    sender = username + ":";
                    chatItem.className = "chatItemUser";
                    break;
                default:
                    sender = from + ":";
                    chatItem.className = "chatItemNar";
                    shouldType = true;
                    break;
            }

            chatItem.innerHTML = sender + "<br>";
            chatview.appendChild(chatItem);

            if (shouldType && gameStarted) {
                var show = "";
                var previousChatItem;
                for (let count = 0; count <= message.length; count++) {
                    (function (count) {
                        setTimeout(function () {
                            show = message.substring(0, count);
                            chatItem.innerHTML = sender + "<br>" + show;
                            if (previousChatItem === chatItem) {
                                previousChatItem.innerHTML = sender + "<br>" + show;
                            } else {
                                chatItem.innerHTML = sender + "<br>" + show;
                                chatview.appendChild(chatItem);
                                previousChatItem = chatItem;
                            }
                            if (show === message) {
                                resolve();
                            }
                            scrollToBottom();
                        }, 25 * count);
                    })(count);
                }
            } else {
                let pre = "";
                if (from === -2) {
                    pre = "<div><img src='./untitled.png'></div>";
                }
                chatItem.innerHTML = pre + "<div>" + sender + "<br>" + message + "</div>";
                resolve();
            }

            scrollToBottom();
            sendButton.classList.remove('green');
        });
    }

    function scrollToBottom() {
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollTo = scrollHeight - windowHeight;

        window.scroll({
            top: scrollTo,
            behavior: 'smooth'
        });
    }

    async function addAchievment(achievment) {
        achievments.push(achievment);
        addToChat(-2, achievment)
    }

    function logic(message) {
        if (coin_found[1]) {
            optionMaster(true, 5, ["yes"]);
            coin_found[1] = false;
        }

        var firstChar = message.charAt(0);
        switch (firstChar) {
            case "/": command(message);
                break;
            default: handler(message);
        }
    }

    function command(message) {
        if (message.startsWith("/setname")) {
            username = message.substring(9);
        }

        if (message.startsWith("/setposition")) {
            position = message.substring(13);
        }

        addToChat(1, message);
        switch (message) {
            case "/list achievments":
                addToChat(-1, achievments.join("<br>"));
                break;
            case "/help":
                var options = "";
                if (avlOptions.length >= position && position < 1000000) {
                    options = avlOptions[position].join("<br>");
                }
                if (sysOptions.length >= position - 1000000 && position >= 1000000) {
                    options = sysOptions[position - 1000000].join("<br>");
                }
                addToChat(-1, "You can do the following things: <br>" + options);
                break;
            case "/kill":
                reachedEnd();
                break;
        }
    }

    function handler(message) {
        if (!gameOver) {
            addToChat(1, message);
            let options = allOptions[position];
            if (position < 1000000 && !options.includes(message) && !options[options.length - 1].includes("[")) {
                unknownCommand();
                return;
            }

            options = avlOptions[position];
            if (position < 1000000 && !options.includes(message) && !options[options.length - 1].includes("[")) {
                unknownCommand();
                return;
            }

            var functionname = "id";
            if (position < 10) {
                functionname += "00" + position;
            } else if (position < 100) {
                functionname += "0" + position;
            } else {
                functionname += position;
            }

            if (sysOptions.length > 0 && position >= 1000000) {
                window[functionname](message);
                return;
            }

            if (typeof window[functionname] === "function") {
                for (let i = 0; i < allOptions[position].length; i++) {
                    if (message == allOptions[position][i]) {
                        message = i;
                        break;
                    }
                }
                window[functionname](message);
            } else {
                console.log(functionname + " Function does not exist");
            }
        }
    }

    function unknownCommand() {
        addToChat(0, "You find yourself stumbling over your words, struggling to form coherent sentences that could provide clarity in this moment. The words elude you, failing to convey the message that could guide you forward at this time.");
    }

    async function optionMaster(boolean, position, strings) {
        return new Promise(function (resolve) {
            for (let i = 0; i < strings.length; i++) {
                if (boolean) {
                    allOptions[position].push(strings[i]);
                    avlOptions[position].push(strings[i]);
                } else {
                    avlOptions[position].remove(strings[i]);
                }
            }

            allOptions[position] = [...new Set(allOptions[position])];
            avlOptions[position] = [...new Set(avlOptions[position])];

            resolve();
        });
    }

    function id000(message) {
        switch (message) {
            case 0: //start
                position = 1;
                addToChat(0, naratorData[0].narator1);
                break;
        }
    }
    window.id000 = id000;

    async function id001(message) {
        switch (message) {
            case 0: //have a drink
                num_drinks++;
                let retrun_message = naratorData[1].haveADrink;
                if (num_drinks > 10) {
                    retrun_message += naratorData[1].haveADrinkADD;
                    await addAchievment("Die");
                    await addToChat(0, retrun_message);
                    reachedEnd();
                } else {
                    addToChat(0, retrun_message);
                }
                break;
            case 1: // order food
                num_drinks = 5;
                food = ["pizza", "nuts", "chips", "burgers", "chicken wings", "onion rings", "tacos"]
                random_food = food[Math.floor(Math.random() * food.length)];
                addToChat(0, naratorData[1].orderFood.replace("random_food", random_food));
                break;
            case 2: //stand up
                position = 2;
                await addAchievment("It can walk");
                await addToChat(0, naratorData[1].standUp);
                break;
        }
    }
    window.id001 = id001;

    async function id002(message) {
        switch (message) {
            case 0: //sit down
                position = 1;
                addToChat(0, naratorData[2].sitDown);
                break;
            case 1: //look around
                await optionMaster(true, 2, ["go to group 1", "go to group 2", "go to group 3"]);
                addToChat(0, naratorData[2].lookAround);
                optionMaster(false, 2, ["look around"]);
                break;
            case 2: //go to the music box
                if (!coin_found[0]) {
                    coin_found[0] = true;
                    position = 3;
                    addToChat(0, naratorData[2].goToTheMusicBox1);
                } else {
                    addToChat(0, naratorData[2].goToTheMusicBox2)
                }
                break;
            case 3: //go to group 1 -- Needs to be unlocked
                if (!visited_table[0]) {
                    position = 4;
                    visited_table[0] = true;
                    await addToChat(0, naratorData[2].goToGroup1);
                    await addToChat("Man 1", "Veolora?");
                } else {
                    position = 5;
                    addToChat("Man 2", naratorData[4].veolora);
                }
                break;
            case 4: //go to group 2 -- Needs to be unlocked
                Gid404();
                break;
            case 5: //go to group 3 -- Needs to be unlocked
                Gid404();
                break;
        }
    }
    window.id002 = id002;

    async function id003(message) {
        switch (message) {
            case 0:
                await addAchievment("A coin worth a thousand beers");
                await addToChat(0, naratorData[3].keepTheCoin)
                position = 2;
                coin_found[1] = true;
                break;
            case 1:
                sysOptions.push("[Just type in any song you like]");
                addToChat(0, naratorData[3].playTheNextSong);
                position = 1000000;
        }
    }
    window.id003 = id003;

    async function id004(message) {
        switch (message) {
            case "veolora":
                position = 5;
                addToChat("Man 2", naratorData[4].veolora);
                break;
            default:
                await addToChat("Man 1", naratorData[4].notVeolora1);
                addToChat(0, naratorData[4].notVeolora2);
                optionMaster(false, 2, ["go to group 1"]);
                position = 2;
                break;
        }
    }
    window.id004 = id004;

    async function id005(message) {
        switch (message) {
            case 0: //no
                addToChat(0, naratorData[5].no);
                position = 2
                break;
            case 1: //yes
                await addToChat("Man 2", naratorData[5].yes)
                Gid404();
                break;
        }
    }
    window.id005 = id005;

    function id1000000(message) {
        sysOptions.remove("[Just type in any song you like]");
        position = 2;
        var url = "https://open.spotify.com/search/" + message.replace(" ", "%20");
        window.open(url);
        addToChat(0, "The sound of " + message + " is filling the air, creating a pleasant atmosphere that resonates with your personal preferences.");
    }
    window.id1000000 = id1000000;

    async function Gid404() {
        await addAchievment("The unknown path");
        await addToChat(0, "Well...emmm...Yeah. I dont know how it goes on at this point. Let's just say you had a hangover and woke up in the prison.");
        await reachedEnd();
    }

    async function reachedEnd() {
        input.classList.add("blockInput");
        input.addEventListener("keydown", function (event) {
            event.preventDefault();
        });
        addToChat(-3, "You reached an end. To restart the game, refresh the page");
        gameOver = true;
    }

    async function setUpOtions() {
        return new Promise(function (resolve) {
            for (let i = 0; i < naratorData.length; i++) {
                allOptions.push(naratorData[i].options);
                avlOptions.push(naratorData[i].options);
            }
            resolve();
        });
    }

    async function setUpJSON() {
        return new Promise(function (resolve) {
            fetch("./narator.json")
                .then(response => response.json())
                .then(jsonData => {
                    naratorData = jsonData;
                    resolve();
                })
                .catch(error => {
                    console.log('Error: ', error);
                });
        });
    }

    async function run() {
        await setUpJSON();
        await setUpOtions();
        await addToChat(0, naratorData[0].start);
        await addToChat(-1, "Type 'start' to start the game");
        gameStarted = true;
    }

    Array.prototype.remove = function (value) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] === value) {
                this.splice(i, 1);
            }
        }
    };

    run();
});

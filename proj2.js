window.onload = function(){
    // Hide the restart button 
    resets = document.getElementById("reset");
    resets.style.visibility='hidden';

    // 1. Create a board (A 5x5 board that separates every letter)
    container = document.getElementById("game_board");
    for(i = 0; i < 5; i++){
        // Create new div row element
        new_row = document.createElement('div');
        new_row.className = "row_guess";
        for(j = 0; j < 5; j++){
            // Create new inner div element 
            inner_div = document.createElement('div'); 
            inner_div.className = `word pos${j}`;
            // Add the new inner div element to the row
            new_row.appendChild(inner_div);
        }
    container.appendChild(new_row);
    }

    // Variable to hold word array
    words = ["apple", "acorn", "alert", "aloud", "arena", "brain", 
            "arrow", "brave", "bloom", "blink", "clean", "dance", 
            "diary", "dozen", "early", "ebony", "fence", "flour", 
            "girth", "humid", "happy", "house", "knife", "learn", 
            "lemon", "maybe", "novel", "phone", "plant", "pride", 
            "proof", "power", "queer", "quiet", "rainy", "realm", 
            "rigid", "salad", "sauce", "scare", "small", "scorn", 
            "shine", "smart", "sleep", "tense", "tepid", "touch", 
            "think", "twice", "upset", "usual", "video", "waive", 
            "weird", "whoop", "wreck", "write", "zebra", "zones"];
    current_word = "";
    word_row = 0;
    word_length = 5;

    function new_game(){
        // Clear console
        console.clear();

        // Randomly pick a new word from the array at the start of game
        random_word = Math.floor(Math.random() * words.length);
        // Assign randomly picked word to be the current word
        current_word = words[random_word];

        // Reset the row count to the beginning
        word_row = 0;
        console.log("Answer: ",  current_word);
    }

    new_game();

    // Interactive keyboard display
    class Keyboard{
        constructor(letter, keyboard){
            this.letter = letter;
            // Create div to house each row of letters
            this.element = document.createElement('div');
            // Add letter inside the div
            this.element.textContent = letter;
            this.element.className = `key letter-${this.letter}`;

            // Append each letter div to the keyboard div
            keyboard.appendChild(this.element);
        }
    }

    function keyboard_display(){
        keyboard_div = document.getElementById('keyboard');

        // Array of letters to represent qwerty keyboard 
        letters = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 
                    ['z', 'x', 'c', 'v', 'b', 'n', 'm']];
        
        // Loop through the letters array
        letters.forEach((letter_row, row_index) => {
            // Create div for each row
            row_div = document.createElement('div');
            // Create id for each row div
            row_div.id = `row${row_index}`;
            row_div.className = 'keyboard_row';

            // Loop through each row of letters
            letter_row.forEach(letter => {
                // Create a key as a new Keyboard instance
                new_key = new Keyboard(letter, row_div);
            });
            keyboard_div.appendChild(row_div);
        });
    }
    keyboard_display();

    document.getElementById("check_word").onclick = function(){
        // End game if user goes past allotted tries
        if(word_row > 4){
            resets.style.visibility='visible';
            alert("Game Over :(! The word was: " + current_word);
            return;
        }

        // Grab the user inputted word
        input = document.getElementById("user_input").value;
        
        // Validate length of the word to make sure it's not too long
        if(input.length != word_length){
            alert("Please enter a 5 letter word. " + input + " was " + 
                input.length + " letters.");
            // Clear the input box
            document.getElementById("user_input").value = "";
            return;
        }

        // Check if word is a valid word using API
        url = `https://freedictionaryapi.com/api/v1/entries/en/${input}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data.entries.length == 0){
                    throw new Error("Invalid Word");
                }
                // Split the inputted word into individual characters
                word_input = input.split("");
                whole_word = document.querySelectorAll('.row_guess');
                active_row = whole_word[word_row];
                // Variable to cross off duplicate letters
                duplicates = current_word.split("");

                // Place each letter into a div in that row
                for(i = 0; i < word_input.length; i++){
                    target_box = active_row.querySelector(`.pos${i}`);
                    target_box.textContent = word_input[i];

                    // Check if the letters entered matches the correct word
                    if(word_input[i] == current_word[i]){
                        target_box.classList.add('green');
                        // Remove that letter from the word array
                        duplicates[i] = "";

                        match = document.querySelector(`.letter-${word_input[i]}`);

                        // Highlight matching letter in keyboard display
                        if(match){
                            match.classList.remove('yellow', 'grey');
                            match.classList.add('green');
                        }
                    }
                } 

                for(i = 0; i < word_input.length; i++){
                    target_box = active_row.querySelector(`.pos${i}`);
                    // Check if letter box is already green
                    if(target_box.classList.contains('green')){
                        continue;
                    }
                    rem_letters = duplicates.indexOf(word_input[i]);
                    // Check if the letter actually belongs to the word
                    if(rem_letters != -1){
                        target_box.classList.add('yellow');
                        // Remove that letter from the word array
                        duplicates[rem_letters] = "";

                        match = document.querySelector(`.letter-${word_input[i]}`);

                        if(match){
                            match.classList.add('yellow');
                        }
                    } else {
                        target_box.classList.add('grey');
                        match = document.querySelector(`.letter-${word_input[i]}`);

                        if(match){
                            match.classList.add('grey');
                        }
                    }
                }

                // End game if user guessed correctly before reaching the end
                if(input == current_word){
                    alert("Congratulations!! You won the game!");
                    resets.style.visibility='visible';
                    return;
                }

                // End game if user fails last try
                if(word_row == 4){
                    resets.style.visibility='visible';
                    alert("Game Over :(! The word was: " + current_word);
                    return;
                }

                word_row++;
                // Clear the input box
                document.getElementById("user_input").value = ""; 
            })
            .catch(error => {
                alert("Not a valid word!");
                // Clear the input box
                document.getElementById("user_input").value = "";
            })
    }

    // Restart the game
    resets.addEventListener('click', () => {
        resets.style.visibility='hidden';

        all_rows = document.querySelectorAll('.word');
        all_keys = document.querySelectorAll('.key');

        all_rows.forEach(target_box => {
            // Erase contents in the boxes
            target_box.textContent = "";
            // Erase styling from the boxes
            target_box.classList.remove('green', 'yellow', 'grey');
        })

        // Remove styling on keyboard display
        for(i = 0; i < all_keys.length; i++){
            all_keys[i].classList.remove('green', 'yellow', 'grey');
        }
        // Clear the input box
        document.getElementById("user_input").value = "";

        // Restart the game
        new_game();
    });

    // Grab definition for a user as a hint using an API
    document.getElementById('hint').onclick = function (){
        url = `https://freedictionaryapi.com/api/v1/entries/en/${current_word}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                definition = data.entries[0].senses[0].definition;
                alert("Hint: " + definition);
            })
            .catch(error => {
                alert("Could not find a definition for this word :(");
            })
        
    }
}
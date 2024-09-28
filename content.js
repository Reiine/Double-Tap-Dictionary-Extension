let currentPopup = null;
const zIndex = "9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"

// Function to get the selected word
document.addEventListener("dblclick", function () {
    let selectedWord = window.getSelection().toString().trim();

    if (selectedWord) {
        fetchDefinition(selectedWord);
    }
});

// Function to get the definition of the selected word through the API
async function fetchDefinition(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.length > 0) {
            createDefinitionPopup(data[0]);
        } else {
            createErrorPopup(`No definition found for "${word}".`);
        }
    } catch (error) {
        createErrorPopup("Error fetching the definition. Please try again later.");
    }
}

// Function to create the popup that displays the definition
function createDefinitionPopup(data) {
    // Create an iframe for isolation
    let iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.zIndex = zIndex; // Ensure it's above other content
    iframe.style.overflow = "hidden"; // Hide any potential scrollbars
    document.body.appendChild(iframe);

    // Set the position of the iframe near the selected word
    let range = window.getSelection().getRangeAt(0);
    let rect = range.getBoundingClientRect();
    iframe.style.left = `${rect.left + window.scrollX}px`;
    iframe.style.top = `${rect.top + window.scrollY - 60}px`;

    // Get iframe's document and write the content
    let doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dictionary Popup</title>
            <style>
                body {
                    margin: 0;
                    padding: 10px;
                    background-color: whitesmoke;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                }
                .my-dictionary-word {
                    font-size: 1rem;
                    font-weight: bold;
                    color: black;
                }
                .my-dictionary-pos {
                    font-size: 0.7rem;
                    color: darkgray;
                    margin-top: 0;
                    font-weight: bold;
                }
                .my-dictionary-def {
                    font-size: 0.8rem;
                }
                .my-dictionary-example {
                    font-size: 0.8rem;
                    color: black;
                }
                .my-dictionary-audio {
                    width: 100%;
                    border: 1px solid black;
                    border-radius: 10px;
                }
            </style>
        </head>
        <body>
            ${
                data.word
                    ? `<p class="my-dictionary-word"> <strong>${data.word}</strong> ${
                        data.phonetic ? `(${data.phonetic})` : ""
                    }  </p>`
                    : ""
            }
            ${
                data.meanings[0].partOfSpeech
                    ? `<p class="my-dictionary-pos" >Part of Speech: ${data.meanings[0].partOfSpeech}</p>`
                    : ""
            }
            ${
                data.meanings[0].definitions[0].definition
                    ? `<p class="my-dictionary-def"> <strong>Definition:</strong> <br/> ${data.meanings[0].definitions[0].definition}</p> `
                    : ""
            }
            ${
                data.meanings[0].definitions[0].example
                    ? `<p class="my-dictionary-example"> <strong> Example: </strong> <br/> ${data.meanings[0].definitions[0].example}</p> `
                    : ""
            }
            ${
                data.phonetics.length > 0 && data.phonetics[0].audio
                    ? `<audio class="my-dictionary-audio" controls><source src="${data.phonetics[0].audio}" type="audio/mpeg">Your browser does not support the audio element.</audio>`
                    : ""
            }
        </body>
        </html>
    `);
    doc.close();

    // Adjust the iframe height based on content
    iframe.style.height = `${doc.body.scrollHeight}px`;
    iframe.style.width = `${doc.body.scrollWidth}px`;

    currentPopup = iframe;

    // Close the popup when clicking outside
    document.addEventListener("click", handleOutsideClick);
}

// Function to show an error message if a definition is not found
function createErrorPopup(message) {
    // Reuse the iframe approach for consistency
    let iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "50%";
    iframe.style.top = "50%";
    iframe.style.transform = "translate(-50%, -50%)";
    iframe.style.border = "none";
    iframe.style.zIndex = "1000";
    iframe.style.overflow = "hidden"; // Hide any potential scrollbars
    document.body.appendChild(iframe);

    let doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
            <style>
                body {
                    margin: 0;
                    padding: 10px;
                    background-color: #f44336;
                    color: #fff;
                    border-radius: 5px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
                    font-family: Arial, sans-serif;
                }
            </style>
        </head>
        <body>
            <strong>Error:</strong> ${message}
        </body>
        </html>
    `);
    doc.close();

    // Adjust the iframe height based on content
    iframe.style.height = `${doc.body.scrollHeight}px`;
    iframe.style.width = `${doc.body.scrollWidth}px`;

    currentPopup = iframe;

    document.addEventListener("click", handleOutsideClick);
}

// Function to close the popup when clicking outside of it
function handleOutsideClick(event) {
    if (currentPopup && !currentPopup.contains(event.target)) {
        currentPopup.remove();
        currentPopup = null;
        document.removeEventListener("click", handleOutsideClick);
    }
}

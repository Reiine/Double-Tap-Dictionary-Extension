let currentPopup = null;

//Function to get the selected word
document.addEventListener("dblclick", function () {
  let selectedWord = window.getSelection().toString().trim();

  if (selectedWord) {
    fetchDefinition(selectedWord);
  }
});

//Function to get the definition of the selected word through api
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

//Function to create the popup that displays the definition
function createDefinitionPopup(data) {
  const word = data.word;
  const phonetic = data.phonetic;
  const meanings = data.meanings[0]; // Get the first meaning
  const partOfSpeech = meanings.partOfSpeech;
  const definition = meanings.definitions[0].definition || "N/A";
  const example = meanings.definitions[0].example;
  const audio = data.phonetics.length > 0 ? data.phonetics[0].audio : null;

  let popup = document.createElement("div");
  popup.className = "my-dictionary-definition-popup";
  popup.innerHTML = `
        ${
          word
            ? `<p class="my-dictionary-word"> <strong>${word}</strong> ${
                phonetic ? `(${phonetic})` : ""
              }  </p>`
            : ""
        } 
        ${
          partOfSpeech
            ? `<p class="my-dictionary-pos" >Part of Speech: ${partOfSpeech}</p>`
            : ""
        }
        ${
          definition
            ? `<p class="my-dictionary-def"> <strong>Definition:</strong> <br/> ${definition}</p> `
            : ""
        }
        ${
          example
            ? `<p class="my-dictionary-example" style={color:"black"}> <strong> Example: </strong> <br/> ${example}</p> `
            : ""
        }
        ${
          audio
            ? `<audio class="my-dictionary-audio" controls><source src="${audio}" type="audio/mpeg">Your browser does not support the audio element.</audio>`
            : ""
        }
    `;

  let range = window.getSelection().getRangeAt(0);
  let rect = range.getBoundingClientRect();

  popup.style.position = "absolute";
  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.top = `${rect.top + window.scrollY - 60}px`;
  popup.style.backgroundColor = "whitesmoke";
  popup.style.border = "1px solid black";
  popup.style.padding = "10px";
  popup.style.borderRadius = "20px";
  popup.style.zIndex =
    "99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999";
  popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  popup.style.maxWidth = "300px";

  document.body.appendChild(popup);

  document.addEventListener("click", handleOutsideClick);
}

//Function that shows error message if a definition is not found
function createErrorPopup(message) {
  let popup = document.createElement("div");
  popup.className = "my-dictionary-definition-popup";
  popup.innerHTML = `<strong>Error:</strong> ${message}`;

  popup.style.position = "absolute";
  popup.style.left = "50%";
  popup.style.top = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "#f44336";
  popup.style.color = "#fff";
  popup.style.padding = "10px";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = "1000";
  popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.5)";

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 10000);
}

//Function to close the popup when clicked outside of the popup window
function handleOutsideClick(event) {
  if (currentPopup && !currentPopup.contains(event.target)) {
    currentPopup.remove();
    currentPopup = null;
    document.removeEventListener("click", handleOutsideClick);
  }
}
document.addEventListener("click", function () {
  let existingPopup = document.querySelector(".my-dictionary-definition-popup");
  if (existingPopup) {
    existingPopup.remove();
  }
});

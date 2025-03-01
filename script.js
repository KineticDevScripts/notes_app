const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

// Array of month names
const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// Retrieve notes from localStorage or initialize an empty array
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Flags and ID for note updates
let isUpdate = false, updateId;

// Open the popup box to add a new note
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

// Close the popup box and reset fields
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

// Display existing notes from localStorage
function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach(li => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                    <li onclick="printNote('${note.title}', '${filterDesc}', '${note.date}')"><i class="uil uil-print"></i>Print</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

showNotes();

// Show menu options for each note
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Delete a specific note
function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

// Update a specific note
function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

// Print a specific note
function printNote(title, description, date) {
  let printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
    <head>
      <title>Print Note</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 40px;
          margin: 0;
        }
        .print-container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          background: white;
        }
        h2 {
          text-align: center;
          margin-bottom: 10px;
          font-size: 22px;
        }
        p {
          white-space: pre-wrap;
          line-height: 1.6;
          font-size: 16px;
        }
        .date {
          color: gray;
          font-size: 14px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <h2 style="text-align: center;">Note Title:</h2> 
        <p style="text-align: center;">${title}</p> 
        <h2 style="text-align: center;">Note Description:</h2> 
        <p>${description.replaceAll("<br/>", "\n")}</p>
        <h2 style="text-align: center;">Created Date:</h2> 
        <p class="date">${date}</p>
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 100);
        };
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
  showNotes();
}


// Add or update a note on button click
addBtn.addEventListener("click", e => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` }
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});

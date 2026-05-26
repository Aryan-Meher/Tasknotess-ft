function showSection(sectionId, button){

  document.getElementById("dashboard-section").style.display = "none";

  document.getElementById("manager-section").style.display = "none";

  document.getElementById("account-section").style.display = "none";


  document.getElementById(sectionId).style.display = "block";


  let buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach(function(btn){

    btn.classList.remove("active");

  });


  button.classList.add("active");

}
let loggedIn = false;
let completedTasks = 0;
let archivedNotes = 0;
function addNote(){

  let title =document.getElementById("note-title").value;

  let text = document.getElementById("note-text").value;
  
  let tag = document.getElementById("note-tag").value;

  let noteColor = document.getElementById("note-color").value;

  if(title === "" || text === ""){ alert("Please fill all fields");
    return;
  }


  let newNote = document.createElement("div");
  newNote.classList.add( "note-card", noteColor);
  newNote.innerHTML = `

    <h3>${title}</h3>

    <p>${text}</p>

    <small class="note-tag">${tag}</small>
    <div class="actions">

      <button class="edit-btn" onclick="editNote(this)">Edit</button>

      <button class="delete-btn" onclick="deleteNote(this)">Delete</button>

      <button class="archive-btn">Archive</button>

      <button class="complete-btn"onclick="completeTask(this)">Complete</button>

    </div>

  `;
showToast("🔥 Boom! Your note just entered the NoteNest universe , Note captured before your brain forgot it 😄");
 document.getElementById( "main-notes-container").appendChild(newNote);

  document.getElementById("note-title").value = "";

  document.getElementById("note-text").value = "";


  updateStatistics();
}

function showToast(message){

  let toast = document.getElementById("toast-message");

  toast.innerText = message;

  toast.style.visibility = "visible";

  toast.style.opacity = "1";

  toast.style.transform = "translateY(0)";

  setTimeout(() => {

    toast.style.opacity = "0";

    toast.style.transform = "translateY(-20px)";

    setTimeout(() => {

      toast.style.visibility = "hidden";

    },400);

  },3000);

}

function deleteNote(button){

  let noteCard = button.parentElement.parentElement;

  noteCard.remove();

  showToast("🗑️ Poof! Your note vanished into the NoteNest blackhole ");
 updateStatistics();
}

function searchNotes(){

  let searchText = document.getElementById("search-input").value.toLowerCase();

  let notes = document.querySelectorAll(".note-card");

  notes.forEach(function(note){

    let noteTitle = note.querySelector("h3").innerText.toLowerCase();

    if(noteTitle.includes(searchText)){

      note.style.display = "block";

    }

    else{

      note.style.display = "none";

    }

  });

}

function editNote(button){

  let noteCard = button.parentElement.parentElement;

  let titleElement = noteCard.querySelector("h3");

  let textElement = noteCard.querySelector("p");

  let tagElement = noteCard.querySelector(".note-tag");

  let currentTitle = titleElement.innerText;

  let currentText = textElement.innerText;

  let currentTag = tagElement.innerText;

  titleElement.innerHTML = ` <input type="text"  id="edit-title"  value="${currentTitle}">`;

  textElement.innerHTML = ` <textarea id="edit-text">${currentText}</textarea>`;

  tagElement.innerHTML = `  <select class="edit-tag">

      <option ${currentTag === "📌 Priority Task" ? "selected" : ""}>
      📌 Priority Task
      </option>

      <option ${currentTag === "⭐ Favorite Project" ? "selected" : ""}>
      ⭐ Favorite Project
      </option>

      <option ${currentTag === "⏰ Reminder Enabled" ? "selected" : ""}>
      ⏰ Reminder Enabled
      </option>

      <option ${currentTag === "🚀 Upcoming Event" ? "selected" : ""}>
      🚀 Upcoming Event
      </option>

      <option ${currentTag === "💡 Creative Idea" ? "selected" : ""}>
      💡 Creative Idea
      </option>

    </select>`;

  button.innerText = "Save";

  button.setAttribute(  "onclick",  "saveEditedNote(this)" );

  showToast("✏️ Edit mode activated inside NoteNest ");

}
function saveEditedNote(button){

  let noteCard = button.parentElement.parentElement;

  let newTitle = noteCard.querySelector("#edit-title").value;

  let newText = noteCard.querySelector("#edit-text").value;

  let newTag = noteCard.querySelector(".edit-tag").value;

  noteCard.querySelector("h3").innerHTML = newTitle;

  noteCard.querySelector("p").innerHTML = newText;

  noteCard.querySelector(".note-tag").innerHTML = newTag;

  button.innerText = "Edit";

  button.setAttribute( "onclick", "editNote(this)" );

  showToast("Note updated successfully inside NoteNest!!");

}

function updateStatistics(){

  let allNotes = document.querySelectorAll(".note-card");

  let totalNotes = allNotes.length;

  let pinnedNotes = 0;

  allNotes.forEach(function(note){
    let tag = note.querySelector(".note-tag").innerText;

    if(tag.includes("📌")){

      pinnedNotes++;

    }

  });

  document.getElementById( "total-notes" ).innerText = totalNotes;

  document.getElementById( "pinned-notes" ).innerText = pinnedNotes;

}

function completeTask(button){

  let noteCard = button.parentElement.parentElement;

  noteCard.remove();

  completedTasks++;

  document.getElementById("completed-notes" ).innerText = completedTasks;

  updateStatistics();

  showToast( "✅ Mission completed! Productivity level increased");

}
updateStatistics();


function toggleArchive(){

  let archiveSection =document.getElementById( "archive-container" );
  if( archiveSection.style.display === "none"){
    archiveSection.style.display = "grid";
  }

  else{
    archiveSection.style.display =
    "none";
  }

}
function archiveNote(button){

  let noteCard = button.parentElement.parentElement;

  document.getElementById( "archive-container").appendChild(noteCard);

  button.innerText = "Unarchive";

  button.setAttribute( "onclick", "unarchiveNote(this)" );

  showToast("📂 Note sent to the galaxy archive ");

}

function unarchiveNote(button){

  let noteCard = button.parentElement.parentElement;

  document.getElementById( "main-notes-container" ).prepend(noteCard);

  button.innerText = "Archive";

  button.setAttribute( "onclick", "archiveNote(this)");

  showToast( " Note returned from space archive!!");

}

function toggleDarkMode(){

  document.body.classList.toggle("dark-theme");

}

function changeFontStyle(){

 let selectedFont =document.getElementById( "font-style-select" ).value;

 document.body.style.fontFamily = selectedFont;

}

function changeNotesView(){

  let view = document.getElementById("notes-view-select").value;

  let notesContainer = document.getElementById( "main-notes-container" );

  if(view === "List View"){ notesContainer.style.gridTemplateColumns = "1fr"; }

  else{

  notesContainer.style.gridTemplateColumns = "repeat(auto-fit,minmax(250px,1fr))";

  }

}

function changeThemeColor(){

  let color = document.getElementById( "theme-color-select").value;

  if(color === "Yellow"){ document.documentElement.style.setProperty( "--main-color","#FF8811");}

  else if(color === "Blue"){document.documentElement.style.setProperty( "--main-color", "#3B82F6" );}

  else if(color === "Green"){document.documentElement.style.setProperty( "--main-color","#22C55E");}

  else if(color === "Pink"){document.documentElement.style.setProperty( "--main-color","#EC4899");}

}

function setReminder(){

  let title = document.getElementById("reminder-note-title").value;

  let date = document.getElementById("reminder-date").value;

  let time = document.getElementById("reminder-time").value;

  if(title === "" || date === "" || time === ""){

    showToast("⚠️ Fill all reminder fields first");

    return;

  }

  let reminderTime = new Date(date + "T" + time).getTime();

  let currentTime = new Date().getTime();

  let delay = reminderTime - currentTime;

  if(delay <= 0){

    showToast("⏳choose a future time 🧐");

    return;

  }

  showToast("⏰ Reminder locked for: " + title);

  setTimeout(function(){

    showToast("🚨 Reminder Time: " + title);

  }, delay);

}

function signupUser(){

  let name = document.getElementById("signup-name").value;

  let email = document.getElementById("signup-email").value;

  let password = document.getElementById("signup-password").value;

  if(name === "" || email === "" || password === ""){

    showToast("⚠️ Fill all signup fields");

    return;

  }

  document.getElementById("profile-name").innerText = name;

  document.getElementById("profile-email").innerText = email;

  document.getElementById("member-since").innerText = "May 2026";

  loggedIn = true;

  showToast("🎉 Welcome to NoteNest " + name);

  document.getElementById("signup-name").value = "";

  document.getElementById("signup-email").value = "";

  document.getElementById("signup-password").value = "";

}

function loginUser(){

  let name = document.getElementById("signup-name").value;

  let email = document.getElementById("signup-email").value;

  let password = document.getElementById("signup-password").value;

  if(name === "" || email === "" || password === ""){

    showToast("⚠️ Enter all login details");

    return;

  }

  document.getElementById("profile-name").innerText = name;

  document.getElementById("profile-email").innerText = email;

  document.getElementById("member-since").innerText = "May 2026";

  loggedIn = true;

  showToast(" Welcome back " + name);

  document.getElementById("signup-name").value = "";

  document.getElementById("signup-email").value = "";

  document.getElementById("signup-password").value = "";

}

function logoutUser(){

  if(loggedIn === false){

    showToast(" No user is logged in");

    return;

  }

  document.getElementById("profile-name").innerText = "Guest User";

  document.getElementById("profile-email").innerText = "Not Logged In";

  document.getElementById("member-since").innerText = "";

  document.getElementById("signup-name").value = "";

  document.getElementById("signup-email").value = "";

  document.getElementById("signup-password").value = "";

  loggedIn = false;

  showToast("Logged out from NoteNest");

}
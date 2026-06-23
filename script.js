const API_BASE = "https://tasknotess-backend.onrender.com/api/v1";
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
async function saveEditedNote(button) {
    try {
        const card = button.closest(".note-card");
        const id = getNoteId(button);

        let noteCard = button.parentElement.parentElement;
        let newTitle = noteCard.querySelector("#edit-title").value;

        // 1. Send the update request to your server (Change the URL to match your backend)
        const res = await fetch(`/api/v1/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        });

        // 2. Now 'res' exists, so this line will work perfectly:
        const data = await res.json(); 

        if (data.success) {
            showToast("✏️ Updated successfully");
            fetchNotes();
        } else {
            showToast("❌ Update failed");
        }

    } catch (err) {
        console.log(err);
    }
}



async function completeTask(button) {
    try {
        // 1. Get the ID of the note
        const id = getNoteId(button);

        // 2. Make the PUT request to the complete route 
        const res = await fetch(`/api/v1/notes/${id}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // 3. Parse the response data
        const data = await res.json();

        // 4. Show success or failure
        if (data.success) {
            showToast("⬜ Completed");
            fetchNotes();
        }

    } catch (err) {
        console.log(err);
    }
}

function toggleArchive(){

  let archiveSection = document.getElementById("archive-container");

  if(archiveSection.style.display === "none" || archiveSection.style.display === ""){
    archiveSection.style.display = "block";
  }
  else{
    archiveSection.style.display = "none";
  }

}
async function archiveNote(button) {
    try {
        // 1. Get the ID of the note
        const id = getNoteId(button);
        let noteCard = button.parentElement.parentElement;

        // 2. Add the missing fetch call to your archive endpoint
        const res = await fetch(`/api/v1/notes/${id}/archive`, {
            method: 'PUT', // Or whatever HTTP method your backend uses for archiving
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // 3. Parse the response
        const data = await res.json();

        // 4. Handle the UI update
        if (data.success) {
            showToast("📁 Note sent to the galaxy archive");
            fetchNotes();
        }
        }

      catch (err) {
        console.log(err);
    }
}

async function unarchiveNote(button) {
    try {
        // 1. Grab the ID
        const id = getNoteId(button);

        // 2. Tell the database to unarchive the note
        const res = await fetch(`/api/v1/notes/${id}/unarchive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        // 3. If the database update succeeds, refresh the screen
        if (data.success) {
            showToast("🚀 Note returned from space archive!!");
            fetchNotes(); // This clears out the old list and draws it correctly!
        }

    } catch (err) {
        console.log(err);
    }
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
    let notesContainer = document.getElementById("main-notes-container");

    if (view === "List View") {
        notesContainer.style.gridTemplateColumns = "1fr";
    } 
    else {
        notesContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
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

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailRegex.test(email)){
    showToast("⚠️ Please enter a valid email address");
    return;
  }

  document.getElementById("profile-name").innerText = name;
  document.getElementById("profile-email").innerText = email;

  let today = new Date();

  let memberSince = today.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  document.getElementById("member-since").innerText = memberSince;

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
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailRegex.test(email)){
    showToast("⚠️ Please enter a valid email address");
    return;
  }


  document.getElementById("profile-name").innerText = name;

  document.getElementById("profile-email").innerText = email;

  let today = new Date();

  let memberSince = today.toLocaleString("en-US", {
  month: "long",
  year: "numeric"
  });

document.getElementById("member-since").innerText = memberSince;

  loggedIn = true;

  showToast(" Welcome back " + name);

  document.getElementById("signup-name").value = "";

  document.getElementById("signup-email").value = "";

  document.getElementById("signup-password").value = "";

}


function logoutUser() {
    // 1. Optional Check: Prevent running if they aren't even logged in
    if (loggedIn === false) {
        showToast("⚠️ No user is logged in");
        return;
    }

    // 2. Reset the profile UI text
    document.getElementById("profile-name").innerText = "Guest User";
    document.getElementById("profile-email").innerText = "Not Logged In";
    document.getElementById("member-since").innerText = "";

    // 3. Clear out the input fields
    document.getElementById("signup-name").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";

    // 4. Update your state variable so the app knows they left
    loggedIn = false;

    // 5. Show success message
    showToast("Logged out from NoteNest");
}
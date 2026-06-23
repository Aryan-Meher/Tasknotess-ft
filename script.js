const API_BASE = "https://tasknotess-backend.onrender.com/api/v1";
async function handleResponse(res) {
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
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

async function addNote() {
  let title = document.getElementById("note-title").value;
  let text = document.getElementById("note-text").value;
  let tag = document.getElementById("note-tag").value;
  let noteColor = document.getElementById("note-color").value;

  if (title === "" || text === "") {
    showToast("Please fill all fields");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        text,
        tag,
        color: noteColor
      })
    });

    console.log("Status:", response.status);

    const data = await response.json();
    console.log("Response:", data);

    if (!response.ok) {
      showToast(data.message || "Failed to create note");
      return;
    }

    if (data.success) {
      showToast("🔥 Boom! Your note just entered the NoteNest universe , Note captured before your brain forgot it 😄");

      document.getElementById("note-title").value = "";
      document.getElementById("note-text").value = "";

      // IMPORTANT: only if fetchNotes exists
      if (typeof fetchNotes === "function") {
        fetchNotes();
      }
    }
  } catch (err) {
    console.log(err);
    showToast("Server error while creating note");
  }
}

function getNoteId(button) {
  return button.closest(".note-card").getAttribute("data-id");
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

async function deleteNote(button) {
  const id = getNoteId(button);

  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (data.success) {
      button.closest(".note-card").remove();
      showToast("🗑️ Poof! Your note vanished into the NoteNest blackhole");
    } else {
      showToast("❌ Delete failed");
    }

  } catch (err) {
    console.log(err);
    showToast("❌ Server error");
  }
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

        // In your frontend script.js:
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
        const id = getNoteId(button);

        // Make the network call to your backend completion endpoint
        const res = await fetch(`/api/v1/notes/${id}/complete`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();

        if (data.success) {
            showToast("✅ Completed");
            fetchNotes();
        }
    } catch (err) {
        console.log(err);
    }
}

function toggleArchive() {
  let archiveSection = document.getElementById("archive-container");
  archiveSection.classList.toggle("hidden");
}

async function archiveNote(button) {
    try {
        const id = getNoteId(button);
        let noteCard = button.parentElement.parentElement;

        // Matches your backend route: PUT /api/v1/notes/:id/archive
        const res = await fetch(`/api/v1/notes/${id}/archive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        if (data.success) {
            showToast("📁 Note sent to the galaxy archive");
            fetchNotes();
        }
    } catch (err) {
        console.log(err);
    }
}

async function unarchiveNote(button) {
    try {
        const id = getNoteId(button);

        // Send request to your backend to change { archived: false }
        const res = await fetch(`/api/v1/notes/${id}/unarchive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        if (data.success) {
            showToast("🚀 Note returned from space archive!!");
            fetchNotes(); // Keeps your frontend perfectly in sync with the database
        }
    } catch (err) {
        console.log(err);
    }
}
async function fetchNotes() {

  const loader = document.getElementById("notes-loading");
  const container = document.getElementById("main-notes-container");

  // SHOW LOADER FIRST
  loader.style.display = "block";

  try {
    const response = await fetch(`${API_BASE}/notes`, {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (data.success) {
      renderNotes(data.data);
    }

  } catch (err) {
    console.log(err);

  } finally {

    // SMALL DELAY TO PREVENT FLASH ISSUE
    setTimeout(() => {
      loader.style.display = "none";
    }, 150);
  }
}

const colorMap = {
  Yellow: "rgba(255, 235, 59, 0.25)",
  Blue: "rgba(59, 130, 246, 0.20)",
  Green: "rgba(34, 197, 94, 0.20)",
  Pink: "rgba(236, 72, 153, 0.20)"
};

function renderNotes(notes) {
  const container = document.getElementById("main-notes-container");
  const archiveContainer = document.getElementById("archive-container"); // 1. Grab the archive container
  const loader = document.getElementById("notes-loading");

  // Clear out both containers before rendering updated data
  container.innerHTML = "";
  if (archiveContainer) {
    archiveContainer.innerHTML = "";
  }

  notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note-card";

    // Keep your exact identifier setup
    card.setAttribute("data-id", note._id);

    // Keep your exact background fallback choice (0.60 opacity white)
    card.style.background = colorMap[note.color] || "rgba(255, 255, 255, 0.6)";

    // 2. Determine if the note uses Archive or Unarchive button setup
    // Change 'isArchived' below to match your exact database field name (like note.archived) if needed.
    const isArchived = note.isArchived || false; 

    const archiveButtonHtml = isArchived 
      ? `<button class="archive-btn" onclick="unarchiveNote(this)">Unarchive</button>`
      : `<button class="archive-btn" onclick="archiveNote(this)">Archive</button>`;

    // Your exact layout kept completely intact
    card.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.text || ""}</p>
      <small class="note-tag">
        ${getTagIcon(note.tag)} ${note.tag || ""}
      </small>
      <div class="actions">
        <button class="edit-btn" onclick="editNote(this)">Edit</button>
        <button class="delete-btn" onclick="deleteNote(this)">Delete</button>
        ${archiveButtonHtml}
        <button class="complete-btn" onclick="completeTask(this)">Complete</button>
      </div>
    `;

    // 3. Route the completed card to the correct DOM container
    if (isArchived && archiveContainer) {
      archiveContainer.appendChild(card);
    } else {
      container.appendChild(card);
    }
  });
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
function getTagIcon(tag) {

  switch(tag) {

    case "Priority Task":
      return `📌`;

    case "Favorite Project":
      return `⭐`;

    case "Reminder Enabled":
      return `⏰`;

    case "Upcoming Event":
      return `🚀`;

    case "Creative Idea":
      return `💡`;

    default:
      return `📝`;
  }
}

async function signupUser() {

  let username = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;

  if(username === "" || email === "" || password === ""){
    showToast("⚠️ Fill all signup fields");
    return;
  }

  try {

    const response = await fetch(
      "https://tasknotess-backend.onrender.com/api/v1/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      }
    );

    const data = await response.json();

    if(data.success){

      document.getElementById("profile-name").innerText =
        data.data.username;

      document.getElementById("profile-email").innerText =
        data.data.email;

      loggedIn = true;

      showToast("🎉 Welcome to NoteNest " + data.data.username);

    } else {

      showToast("Signup failed");

    }

  } catch(error) {

    console.error(error);
    showToast("Server error");

  }
}
async function loginUser() {

  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;

  if(email === "" || password === "") {
    showToast("⚠️ Enter email and password");
    return;
  }

  try {

    const response = await fetch(
      "https://tasknotess-backend.onrender.com/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      document.getElementById("profile-name").innerText =
        data.data.username;

      document.getElementById("profile-email").innerText =
        data.data.email;

      let memberSince = new Date(data.data.createdAt).toLocaleString(
        "en-US",
        { month: "long", year: "numeric" }
      );

      document.getElementById("member-since").innerText =
        memberSince;

      loggedIn = true;

      showToast("🎉 Welcome Back " + data.data.username);

      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";

      setTimeout(() => {
        fetchNotes();
      }, 300);

    }

  } catch(error) {
    console.error(error);
    showToast("❌ Login failed");
  }
}

async function logoutUser() {

  try {

    const response = await fetch(
      "https://tasknotess-backend.onrender.com/api/v1/auth/logout",
      {
        method: "GET",
        credentials: "include"
      }
    );

    const data = await response.json();

    if(data.success){

      document.getElementById("profile-name").innerText = "Guest User";

      document.getElementById("profile-email").innerText = "Not Logged In";

      document.getElementById("member-since").innerText = "";

      loggedIn = false;

      showToast("Logged out from NoteNest");

    }

  } catch(error){

    console.error(error);

    showToast("Logout failed");

  }

}
async function getCurrentUser() {
  try {
    const response = await fetch(
      "https://tasknotess-backend.onrender.com/api/v1/auth/me",
      {
        credentials: "include"
      }
    );

    const data = await response.json();

    if (data.success) {
      document.getElementById("profile-name").innerText = data.data.username;
      document.getElementById("profile-email").innerText = data.data.email;

      document.getElementById("member-since").innerText =
        new Date(data.data.createdAt).toLocaleString("en-US", {
          month: "long",
          year: "numeric"
        });
    }

  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("load", () => {
  getCurrentUser().then(() => {
    fetchNotes();
  });
});
getCurrentUser();

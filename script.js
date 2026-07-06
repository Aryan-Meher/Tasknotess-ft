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
    content: text,
    tag,
    color: noteColor
  })
    });

    console.log("Status:", response.status);

    const data = await response.json();
    console.log("Response:", data);

    // if (!response.ok) {
    //   showToast(data.message || "Failed to create note");
    //   return;
    // }
    if (!response.ok) {
    showToast(data.message || "You need to log in before creating a new note.");
    return;
    }

    if (data.success) {
      showToast("🔥 Boom! Your note just entered the NoteNest universe , Note captured before your brain forgot it 😄");

      document.getElementById("note-title").value = "";
      document.getElementById("note-text").value = "";

      
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

function editNote(button) {
   // Locate the parent note card element
   const noteCard = button.closest('.note-card');
   
   const titleElement = noteCard.querySelector('h3');
   const textElement = noteCard.querySelector('p');
   const tagElement = noteCard.querySelector('.note-tag');

   let currentTitle = titleElement.innerText;
   let currentText = textElement.innerText;
   
   // Extract clean text tag name without any old emojis attached to it
   let currentTag = tagElement.innerText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();

   // Swap text nodes out for interactive input fields
   titleElement.innerHTML = `<input type="text" id="edit-title" value="${currentTitle}">`;
   textElement.innerHTML = `<textarea id="edit-text">${currentText}</textarea>`;
   
   // Replace the tag display with the dropdown selector menu
   tagElement.innerHTML = `
      <select class="edit-tag">
         <option value="Priority Task" ${currentTag === "Priority Task" ? "selected" : ""}>Priority Task</option>
         <option value="Favorite Project" ${currentTag === "Favorite Project" ? "selected" : ""}>Favorite Project</option>
         <option value="Reminder Enabled" ${currentTag === "Reminder Enabled" ? "selected" : ""}>Reminder Enabled</option>
         <option value="Upcoming Event" ${currentTag === "Upcoming Event" ? "selected" : ""}>Upcoming Event</option>
         <option value="Creative Idea" ${currentTag === "Creative Idea" ? "selected" : ""}>Creative Idea</option>
      </select>
   `;

   // Convert the clicked Edit button into a functional Save button
   button.innerText = "Save";
   button.setAttribute("onclick", "saveEditedNote(this)");
   
   showToast("📝 Edit mode activated inside NoteNest");
}
   
async function saveEditedNote(button) {

  try {

    const card = button.closest(".note-card");

    const id = getNoteId(button);

    let newTitle = card.querySelector("#edit-title").value;

    let newText = card.querySelector("#edit-text").value;

    let newTag = card.querySelector(".edit-tag").value;

    const res = await fetch(`${API_BASE}/notes/${id}`, {

      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      credentials: "include",

      body: JSON.stringify({
        title: newTitle,
        content: newText,
        tag: newTag
      })

    });

    const data = await res.json();

    if(data.success){

      showToast("Note updated successfully inside NoteNest!!");

      fetchNotes();

    } else {

      showToast("❌ Update failed");

    }

  } catch(err){

    console.log(err);

    showToast("❌ Server error");

  }

}

async function completeTask(button) {
  try {
    
    const id = getNoteId(button);

    const res = await fetch(`${API_BASE}/notes/${id}/complete`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json'
      },
      credentials: "include" 
    });

    const data = await res.json();

    if (data.success) {
      showToast("✅ Mission completed! Productivity level increased");
      await fetchNotes();
    }
  } catch (err) {
    console.log(err);
  }
}

function toggleArchive() {
  let archiveSection = document.getElementById("archive-container");

  if (archiveSection.style.display === "none" || archiveSection.style.display === "") {
    archiveSection.style.display = "block";
    
    fetchArchivedNotes(); 
  } else {
    archiveSection.style.display = "none";
  }
}

async function archiveNote(button) {
  try {
    const id = getNoteId(button);

    const res = await fetch(`${API_BASE}/notes/${id}/archive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include" 
    });

    const data = await res.json();
    if (data.success) {
      showToast("📂 Note sent to the galaxy archive");
      await fetchNotes();
    }
  } catch (err) {
    console.error("Archive error:", err);
  }
}

async function unarchiveNote(button) {
  try {
    const id = getNoteId(button);

    const res = await fetch(`${API_BASE}/notes/${id}/unarchive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });

    const data = await res.json();
    if (data.success) {
      showToast("Note returned from space archive!!");
      await fetchNotes();
    }
  } catch (err) {
    console.error("Unarchive error:", err);
  }
}
async function fetchNotes() {

  const loader = document.getElementById("notes-loading");
  const container = document.getElementById("main-notes-container");

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

    setTimeout(() => {
      loader.style.display = "none";
    }, 50);
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
  const archiveContainer = document.getElementById("archive-container");
  const loader = document.getElementById("notes-loading");

  container.innerHTML = "";
  if (archiveContainer) {
    archiveContainer.innerHTML = "";
  }

  notes.forEach(note => {

    if (note.completed) {
     return;
    }
    const card = document.createElement("div");
    card.className = "note-card";
    card.setAttribute("data-id", note._id);

    const colorMap = {
      Yellow: "rgba(255, 235, 59, 0.20)",
      Blue: "rgba(59, 130, 246, 0.20)",
      Green: "rgba(34, 197, 94, 0.20)",
      Pink: "rgba(236, 72, 153, 0.20)"
    };
    card.style.background = colorMap[note.color] || "rgba(255, 255, 255, 0.6)";

    const isArchived = note.archived || false; 

    const archiveButtonHtml = isArchived 
      ? `<button class="archive-btn" onclick="unarchiveNote(this)">Unarchive</button>`
      : `<button class="archive-btn" onclick="archiveNote(this)">Archive</button>`;

    card.innerHTML = `
  <h3>${note.title}</h3>
 <p>${note.content || ""}</p> <small class="note-tag">
    ${getTagIcon(note.tag)} ${note.tag || ""}
  </small>
  <div class="actions">
    <button class="edit-btn" onclick="editNote(this)">Edit</button>
    <button class="delete-btn" onclick="deleteNote(this)">Delete</button>
    ${archiveButtonHtml}
    <button class="complete-btn" onclick="completeTask(this)">Complete</button>
  </div>
`;

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
    // Shared structural layout configuration for perfect icon alignment
    const baseConfig = `width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tag-svg"`;

    switch(tag) {
        case "Priority Task":
            // 🔴 Vibrant Coral Red for urgent focus
            return `<svg ${baseConfig} stroke="#ef4444"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`;
            
        case "Favorite Project":
            // 🟡 Warm Amber/Gold for high-value items
            return `<svg ${baseConfig} stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            
        case "Reminder Enabled":
            // 🔵 Clear Electric Blue for tracking timelines
            return `<svg ${baseConfig} stroke="#3b82f6"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
            
        case "Upcoming Event":
            // 🟢 Crisp Emerald Green for scheduled events
            return `<svg ${baseConfig} stroke="#10b981"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
            
        case "Creative Idea":
            // 🟣 Deep Violet/Purple for creative concepts
            return `<svg ${baseConfig} stroke="#8b5cf6"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5.5 5.5 0 0 0 7.5 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path><line x1="9" y1="18" x2="15" y2="18"></line><line x1="10" y1="22" x2="14" y2="22"></line></svg>`;
            
        default:
            // 🪙 Balanced Slate Gray fallback
            return `<svg ${baseConfig} stroke="#64748b"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
    }
}


async function signupUser() {

  let username = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;

  if (username === "" || email === "" || password === "") {
    showToast("⚠️ Fill all signup fields");
    return;
  }

  try {

    const response = await fetch(
      `${API_BASE}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      loggedIn = true;

      showToast("🎉 Welcome to NoteNest " + data.data.username);

      document.getElementById("signup-name").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";

      await getCurrentUser();

      await fetchNotes();

    } else {

      showToast(data.error || "A user is already logged in. Please logout first");

    }

  } catch (error) {

    console.error(error);
    showToast("❌ Server error");

  }
}
// async function loginUser() {

//   let email = document.getElementById("signup-email").value;
async function loginUser() {

  if (loggedIn) {
    showToast("A user is already logged in. Please logout first.");
    return;
  }

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

    // if (data.success) {

    //   document.getElementById("profile-name").innerText =
    //     data.data.username;

    //   document.getElementById("profile-email").innerText =
    //     data.data.email;

    //   let memberSince = new Date(data.data.createdAt).toLocaleString(
    //     "en-US",
    //     { month: "long", year: "numeric" }
    //   );

    //   document.getElementById("member-since").innerText =
    //     memberSince;

    //   loggedIn = true;

    //   showToast("🎉 Welcome Back " + data.data.username);

    //   document.getElementById("signup-email").value = "";
    //   document.getElementById("signup-password").value = "";

    //   setTimeout(() => {
    //     fetchNotes();
    //   }, 150);

    // }
  if (data.success) {

  loggedIn = true;

  await getCurrentUser();

  showToast("🎉 Welcome Back " + data.data.username);

  document.getElementById("signup-email").value = "";
  document.getElementById("signup-password").value = "";

  await fetchNotes();

}

  } catch(error) {
    console.error(error);
    showToast("❌ Login failed");
  }
}

async function logoutUser() {
  if (!loggedIn) {
  showToast("You're not logged in.");
  return;
}

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

      document.getElementById("main-notes-container").innerHTML = "";

      document.getElementById("archive-container").innerHTML = "";

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

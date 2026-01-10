// Ensure DOM is ready
document.addEventListener("DOMContentLoaded", initProfile);

async function initProfile() {
  // Check session
  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    window.location.href = "index.html";
    return;
  }

  const user = sessionData.session.user;

  // Show email
  const emailEl = document.getElementById("profileEmail");
  if (emailEl) {
    emailEl.innerText = user.email;
  }

  // Load profile name
  await loadProfileName(user.id);
}

/* ---------------- LOAD PROFILE ---------------- */

async function loadProfileName(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  const nameEl = document.getElementById("profileName");

  if (error || !data || !data.full_name) {
    // Default fallback name
    nameEl.innerText = "User";
    return;
  }

  nameEl.innerText = data.full_name;
}

/* ---------------- EDIT NAME ---------------- */

function enableEdit() {
  const nameText = document.getElementById("profileName");
  const nameInput = document.getElementById("nameInput");
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  nameInput.value = nameText.innerText;

  nameText.style.display = "none";
  nameInput.style.display = "block";
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
}

/* ---------------- SAVE NAME ---------------- */

async function saveName() {
  const nameInput = document.getElementById("nameInput");
  const newName = nameInput.value.trim();

  if (!newName) {
    alert("Name cannot be empty");
    return;
  }

  const { data: sessionData } =
    await supabaseClient.auth.getSession();

  if (!sessionData.session) {
    alert("Session expired. Please login again.");
    window.location.href = "index.html";
    return;
  }

  const userId = sessionData.session.user.id;

  // UPSERT = insert if missing, update if exists
  const { error } = await supabaseClient
    .from("profiles")
    .upsert({
      id: userId,
      full_name: newName
    });

  if (error) {
    console.error("Save name error:", error);
    alert("Failed to save name");
    return;
  }

  // Update UI
  document.getElementById("profileName").innerText = newName;
  document.getElementById("profileName").style.display = "block";
  document.getElementById("nameInput").style.display = "none";
  document.getElementById("editBtn").style.display = "inline-block";
  document.getElementById("saveBtn").style.display = "none";
}

/* ---------------- LOGOUT ---------------- */

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

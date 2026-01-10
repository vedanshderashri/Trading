/* -------- PASSWORD LOGIN -------- */

async function loginWithPassword() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  // Success
  window.location.href = "dashboard.html";
}

/* -------- MAGIC LINK LOGIN -------- */
async function sendMagicLink() {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Enter a valid email");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo:
      window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "") + "/dashboard.html"
  }
});

  if (error) {
    alert(error.message);
  } else {
    alert("Login link sent. Check your email.");
  }
}

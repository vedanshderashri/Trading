document.addEventListener("DOMContentLoaded", initSetPassword);

async function initSetPassword() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    // Must be logged in via magic link
    window.location.href = "index.html";
  }
}

async function setPassword() {
  const password = document.getElementById("newPassword").value.trim();
  const confirm = document.getElementById("confirmPassword").value.trim();

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const { error } = await supabaseClient.auth.updateUser({
    password: password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Password set successfully. You can now login with password.");
  window.location.href = "dashboard.html";
}

async function sendMagicLink() {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Enter a valid email");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + "/dashboard.html"
    }
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Login link sent. Check your email.");
  }
}

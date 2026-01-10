document.addEventListener("DOMContentLoaded", init);


async function init() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "index.html";
    return;
  }

  const user = data.session.user;

  // Common (topbar/profile)
  await loadUser();

  // Dashboard page
  if (document.getElementById("balance")) {
    await loadBalance(user.id);
    await loadHistory(user.id); // existing function (unchanged)
  }

  // History page
  if (document.getElementById("historyPage")) {
    await loadHistoryPage(user.id); // new function
  }
}



/* ---------------- USER ---------------- */

async function loadUser() {
  const { data } = await supabaseClient.auth.getUser();
  document.getElementById("email").innerText =
    "Logged in as: " + data.user.email;
}

/* ---------------- PAYMENT ---------------- */

async function addPayment() {
  const amountInput = document.getElementById("amount");
  const noteInput = document.getElementById("note");

  const amount = Number(amountInput.value);
  const note = noteInput.value;

  if (!amount || amount <= 0) {
    alert("Enter a valid amount");
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

  const { error } = await supabaseClient
    .from("payments")
    .insert({
      user_id: userId,
      amount: amount,
      note: note
    });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  amountInput.value = "";
  noteInput.value = "";

  await loadBalance();
  await loadHistory();
}

/* ---------------- BALANCE ---------------- */

async function loadBalance() {
  const { data: sessionData } =
    await supabaseClient.auth.getSession();

  const userId = sessionData.session.user.id;

  const { data: payments } = await supabaseClient
    .from("payments")
    .select("amount")
    .eq("user_id", userId);

  const total = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  document.getElementById("balance").innerText = "₹" + total;
}
/* ---------------- HISTORY ---------------- */

async function loadHistory() {
  const { data: sessionData } =
    await supabaseClient.auth.getSession();

  const userId = sessionData.session.user.id;

  const { data: payments } = await supabaseClient
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const tbody = document.getElementById("history");
  tbody.innerHTML = "";

  payments.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>₹${p.amount}</td>
        <td>${p.note || "-"}</td>
        <td>${new Date(p.created_at).toLocaleString()}</td>
      </tr>
    `;
  });
}

/* ---------------- LOGOUT ---------------- */

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}


async function loadHistoryPage(userId) {
  const { data: payments, error } = await supabaseClient
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.getElementById("historyPage");
  if (!tbody) return;

  tbody.innerHTML = "";

  payments.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>₹${p.amount}</td>
        <td>${p.note || "-"}</td>
        <td>${new Date(p.created_at).toLocaleString()}</td>
      </tr>
    `;
  });
}


async function clearHistory() {
  const confirmDelete = confirm(
    "Are you sure you want to clear your entire history? This action cannot be undone."
  );

  if (!confirmDelete) return;

  const { data: sessionData } =
    await supabaseClient.auth.getSession();

  if (!sessionData.session) {
    alert("Session expired. Please login again.");
    window.location.href = "index.html";
    return;
  }

  const userId = sessionData.session.user.id;

  const { error } = await supabaseClient
    .from("payments")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    alert("Failed to clear history");
    return;
  }

  // Refresh UI
  const tbody = document.getElementById("historyPage");
  if (tbody) {
    tbody.innerHTML = "";
  }

  alert("History cleared successfully.");
}

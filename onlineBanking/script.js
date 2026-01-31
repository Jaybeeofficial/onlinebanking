
const firebaseConfig = {
  apiKey: "AIzaSyBR9H69WILmZ0JmlDopihAk_zhEtDpIsFw",
  authDomain: "onlinebanking-347dd.firebaseapp.com",
  projectId: "onlinebanking-347dd",
  storageBucket: "onlinebanking-347dd.appspot.com",
  messagingSenderId: "1047597422756",
  appId: "1:1047597422756:web:2b08b2ca528cfd3e4cee31"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ----------------------------
// Element References
// ----------------------------
const loginModal = document.getElementById("loginModal");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotForm = document.getElementById("forgotForm");

const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupError = document.getElementById("signupError");

const forgotEmailInput = document.getElementById("email");

const showSignup = document.getElementById("showSignup");
const showForgot = document.getElementById("showForgot");
const backToLogin = document.getElementById("backToLogin");
const backToLoginFromSignup = document.getElementById("backToLoginFromSignup");

const checkingNumber = document.getElementById("checkingNumber");
const savingsNumber = document.getElementById("savingsNumber");
const creditNumber = document.getElementById("creditNumber");

const checkingBalance = document.getElementById("checkingBalance");
const savingsBalance = document.getElementById("savingsBalance");
const creditBalance = document.getElementById("creditBalance");

const historyList = document.getElementById("historyList");

// Welcome name
const welcomeName = document.getElementById("welcomeName");

// Account Details Modal
const accountModal = document.getElementById("accountDetailsModal");
const modalCheckingNumber = document.getElementById("modalCheckingNumber");
const modalCheckingBalance = document.getElementById("modalCheckingBalance");
const modalOpened = document.getElementById("modalOpened");
const modalBranch = document.getElementById("modalBranch");
const accountModalClose = accountModal?.querySelector(".account-modal-close");
const viewDetailsBtn = document.getElementById("viewDetails");

// Transactions Modal
const transactionsModal = document.getElementById("transactionsModal");
const transactionsModalClose = transactionsModal?.querySelector(".account-modal-close");
const viewAllBtn = document.getElementById("viewAll");
const modalTransactionsList = document.getElementById("modalTransactionsList");

// ----------------------------
// Helper Functions
// ----------------------------
function switchForm(hideForm, showForm) {
  hideForm?.classList.add("hidden");
  showForm?.classList.remove("hidden");
}

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// ----------------------------
// LOGIN
// ----------------------------
loginForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = emailInput?.value.trim();
  const password = passwordInput?.value.trim();
  if (!email || !password) return alert("Enter email and password");

  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    alert(err.message);
  }
});

// ----------------------------
// SIGNUP
// ----------------------------
signupForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const name = signupName?.value.trim();
  const email = signupEmail?.value.trim();
  const password = signupPassword?.value.trim();
  if (!name || !email || !password) {
    if (signupError) signupError.textContent = "All fields required";
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const defaultBranch = "Main Branch";

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);

    await db.collection("users").doc(cred.user.uid).set({
      fullName: name,
      email,
      checking: { number: generateAccountNumber(), balance: 0, opened: today, branch: defaultBranch },
      savings: { number: generateAccountNumber(), balance: 0, opened: today, branch: defaultBranch },
      credit: { number: generateAccountNumber(), balance: 0, opened: today, branch: defaultBranch },
      transferHistory: []
    });

    signupForm.reset();
    switchForm(signupForm, loginForm);
  } catch (err) {
    if (signupError) signupError.textContent = err.message;
  }
});

// ----------------------------
// FORGOT PASSWORD
// ----------------------------
forgotForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = forgotEmailInput?.value.trim();
  if (!email) return alert("Enter your email");
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset email sent");
    switchForm(forgotForm, loginForm);
  } catch (err) {
    alert(err.message);
  }
});

// ----------------------------
// FORM SWITCH LINKS
// ----------------------------
showSignup?.addEventListener("click", e => { e.preventDefault(); switchForm(loginForm, signupForm); });
showForgot?.addEventListener("click", e => { e.preventDefault(); switchForm(loginForm, forgotForm); });
backToLogin?.addEventListener("click", e => { e.preventDefault(); switchForm(forgotForm, loginForm); });
backToLoginFromSignup?.addEventListener("click", e => { e.preventDefault(); switchForm(signupForm, loginForm); });

// ----------------------------
// AUTH STATE LISTENER
// ----------------------------
auth.onAuthStateChanged(async user => {
  if (user) {
    if (loginModal) loginModal.style.display = "none";
    dashboard?.classList.remove("hidden");

    const doc = await db.collection("users").doc(user.uid).get();
    if (doc.exists) {
      const data = doc.data();

      // Update welcome name
      if (welcomeName) welcomeName.textContent = data.fullName;

      // Update account numbers and balances
      if (checkingNumber) checkingNumber.textContent = data.checking.number;
      if (savingsNumber) savingsNumber.textContent = data.savings.number;
      if (creditNumber) creditNumber.textContent = data.credit.number;

      if (checkingBalance) checkingBalance.textContent = `$${data.checking.balance.toFixed(2)}`;
      if (savingsBalance) savingsBalance.textContent = `$${data.savings.balance.toFixed(2)}`;
      if (creditBalance) creditBalance.textContent = `$${data.credit.balance.toFixed(2)}`;
    }
  } else {
    if (loginModal) loginModal.style.display = "flex";
    dashboard?.classList.add("hidden");

    if (welcomeName) welcomeName.textContent = "";
  }
});

// ----------------------------
// LOGOUT
// ----------------------------
const logoutBtn = document.querySelector(".logout");
logoutBtn?.addEventListener("click", async () => {
  try {
    await auth.signOut();
    dashboard?.classList.add("hidden");
    if (loginModal) loginModal.style.display = "flex";
    if (welcomeName) welcomeName.textContent = "";
  } catch (err) {
    console.error(err);
  }
});

// ----------------------------
// VIEW DETAILS MODAL
// ----------------------------
viewDetailsBtn?.addEventListener("click", async e => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const doc = await db.collection("users").doc(user.uid).get();
  if (!doc.exists) return;

  const data = doc.data();

  if (modalCheckingNumber) modalCheckingNumber.textContent = data.checking.number;
  if (modalCheckingBalance) modalCheckingBalance.textContent = `$${data.checking.balance.toFixed(2)}`;
  if (modalOpened) modalOpened.textContent = data.checking.opened;
  if (modalBranch) modalBranch.textContent = data.checking.branch;

  accountModal?.classList.remove("account-modal-hidden");
});

accountModalClose?.addEventListener("click", () => {
  accountModal?.classList.add("account-modal-hidden");
});

// ----------------------------
// VIEW ALL TRANSACTIONS MODAL
// ----------------------------
viewAllBtn?.addEventListener("click", async e => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const doc = await db.collection("users").doc(user.uid).get();
  if (!doc.exists) return;

  const data = doc.data();

  if (modalTransactionsList) {
    modalTransactionsList.innerHTML = "";
    if (data.transferHistory && data.transferHistory.length) {
      data.transferHistory.forEach(trx => {
        const li = document.createElement("li");
        li.textContent = `${trx.date} • ${trx.name} • ${trx.bank} • $${trx.amount}`;
        modalTransactionsList.appendChild(li);
      });
    } else {
      modalTransactionsList.innerHTML = "<li>No recent transactions yet</li>";
    }
  }

  transactionsModal?.classList.remove("account-modal-hidden");
});

transactionsModalClose?.addEventListener("click", () => {
  transactionsModal?.classList.add("account-modal-hidden");
});

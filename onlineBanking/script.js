// document.addEventListener("DOMContentLoaded", () => {

  
//   const firebaseConfig = {
//     apiKey: "AIzaSyBR9H69WILmZ0JmlDopihAk_zhEtDpIsFw",
//     authDomain: "onlinebanking-347dd.firebaseapp.com",
//     projectId: "onlinebanking-347dd",
//     storageBucket: "onlinebanking-347dd.appspot.com",
//     messagingSenderId: "1047597422756",
//     appId: "1:1047597422756:web:2b08b2ca528cfd3e4cee31"
//   };

//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }

//   const auth = firebase.auth();

  
//   const loginModal = document.getElementById("loginModal");
//   const dashboard = document.getElementById("dashboard");

//   const loginForm = document.getElementById("loginForm");
//   const forgotForm = document.getElementById("forgotForm");

//   const emailInput = document.getElementById("username");
//   const passwordInput = document.getElementById("password");
//   const forgotEmailInput = document.getElementById("email");

//   const showForgot = document.getElementById("showForgot");
//   const backToLogin = document.getElementById("backToLogin");
//   const logoutBtn = document.querySelector(".logout");


  
//   function switchForm(hideForm, showForm) {
//     if (!hideForm || !showForm) return;
//     hideForm.classList.add("hidden");
//     showForm.classList.remove("hidden");
//   }

//   if (loginForm) {
//     loginForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const email = emailInput?.value.trim();
//       const password = passwordInput?.value.trim();

//       if (!email || !password) {
//         alert("Please enter email and password");
//         return;
//       }

//       auth.signInWithEmailAndPassword(email, password)
//         .catch(error => alert(error.message));
//     });
//   }

 
//   if (forgotForm) {
//     forgotForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const email = forgotEmailInput?.value.trim();
//       if (!email) {
//         alert("Please enter your email");
//         return;
//       }

//       auth.sendPasswordResetEmail(email)
//         .then(() => {
//           alert("Password reset email sent");
//           switchForm(forgotForm, loginForm);
//         })
//         .catch(error => alert(error.message));
//     });
//   }

  
//   if (showForgot) {
//     showForgot.addEventListener("click", (e) => {
//       e.preventDefault();
//       switchForm(loginForm, forgotForm);
//     });
//   }

//   if (backToLogin) {
//     backToLogin.addEventListener("click", (e) => {
//       e.preventDefault();
//       switchForm(forgotForm, loginForm);
//     });
//   }

  
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", () => {
//       auth.signOut();
//     });
//   }

  
//   auth.onAuthStateChanged((user) => {
//     if (user) {
//       loginModal?.classList.add("hidden");
//       dashboard?.classList.remove("hidden");
//     } else {
//       dashboard?.classList.add("hidden");
//       loginModal?.classList.remove("hidden");
//     }
//   });

// });



document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // Firebase Initialization
  // ----------------------------
  const firebaseConfig = {
    apiKey: "AIzaSyBR9H69WILmZ0JmlDopihAk_zhEtDpIsFw",
    authDomain: "onlinebanking-347dd.firebaseapp.com",
    projectId: "onlinebanking-347dd",
    storageBucket: "onlinebanking-347dd.appspot.com",
    messagingSenderId: "1047597422756",
    appId: "1:1047597422756:web:2b08b2ca528cfd3e4cee31"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();

  // ----------------------------
  // Elements
  // ----------------------------
  const loginModal = document.getElementById("loginModal");
  const dashboard = document.getElementById("dashboard");

  const loginForm = document.getElementById("loginForm");
  const forgotForm = document.getElementById("forgotForm");

  const emailInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const forgotEmailInput = document.getElementById("email");

  const showForgot = document.getElementById("showForgot");
  const backToLogin = document.getElementById("backToLogin");
  const logoutBtn = document.querySelector(".logout");

  // ----------------------------
  // Helper: Switch Forms
  // ----------------------------
  function switchForm(hideForm, showForm) {
    if (!hideForm || !showForm) return;
    hideForm.classList.add("hidden");
    showForm.classList.remove("hidden");
  }

  // ----------------------------
  // LOGIN
  // ----------------------------
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();

      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      // ✅ Set persistence to LOCAL so session stays even after closing browser
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return auth.signInWithEmailAndPassword(email, password);
        })
        .catch(error => alert(error.message));
    });
  }

  // ----------------------------
  // FORGOT PASSWORD
  // ----------------------------
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = forgotEmailInput?.value.trim();
      if (!email) {
        alert("Please enter your email");
        return;
      }

      auth.sendPasswordResetEmail(email)
        .then(() => {
          alert("Password reset email sent");
          switchForm(forgotForm, loginForm);
        })
        .catch(error => alert(error.message));
    });
  }

  // ----------------------------
  // FORM SWITCH LINKS
  // ----------------------------
  if (showForgot) {
    showForgot.addEventListener("click", (e) => {
      e.preventDefault();
      switchForm(loginForm, forgotForm);
    });
  }

  if (backToLogin) {
    backToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      switchForm(forgotForm, loginForm);
    });
  }

  // ----------------------------
  // LOGOUT
  // ----------------------------
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      auth.signOut();
    });
  }

  // ----------------------------
  // AUTH STATE (UI CONTROL)
  // ----------------------------
  auth.onAuthStateChanged((user) => {
    if (user) {
      loginModal?.classList.add("hidden");
      dashboard?.classList.remove("hidden");
    } else {
      dashboard?.classList.add("hidden");
      loginModal?.classList.remove("hidden");
    }
  });

});




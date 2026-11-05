const nameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginBtn = document.getElementById("submitBtn");

let passwordVisible = false;
let timeout;

// AUTO CAPITALIZE NAME
nameInput.addEventListener("input", () => {
    let value = nameInput.value;

    if (value.length > 0) {
        nameInput.value = value.charAt(0).toUpperCase() + value.slice(1);
    }
});

// PASSWORD VALIDATION
function validatePassword(password) {
    return password.length >= 8;
}

// TOGGLE PASSWORD VISIBILITY
togglePassword.addEventListener("click", () => {

    if (!passwordVisible) {
        // Show password
        passwordInput.type = "text";
        passwordVisible = true;

        // Auto hide after 3 seconds
        timeout = setTimeout(() => {
            passwordInput.type = "password";
            passwordVisible = false;
        }, 3000);

    } else {
        // Hide immediately if clicked again
        passwordInput.type = "password";
        passwordVisible = false;
        clearTimeout(timeout);
    }
});

// LOGIN BUTTON
loginBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const password = passwordInput.value;

    // Check if name is entered
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    // Check password length
    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    //  If everything is correct → LOGIN automatically
    window.location.href = "Record.html";
});
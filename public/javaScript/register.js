let slide = document.querySelector("#slide-page");
function shift() {
    slide.classList.toggle("right-shift");
}

let log = document.querySelector("#login-details");
let sign = document.querySelector("#signup-details");

function hide() {
    log.classList.toggle("hide");
    sign.classList.toggle("hide");
}

let flip = document.querySelector("#signSwitch");

flip.addEventListener("click", shift);
flip.addEventListener("click", hide);

let flipBack = document.querySelector("#logSwitch");

flipBack.addEventListener("click" , shift);
flipBack.addEventListener("click" , hide);

let flipCard = document.querySelector("#flipCard");

flipCard.addEventListener("click" , function () {
    slide.classList.toggle("flip-card");
    sign.classList.toggle("hide");
    log.classList.toggle("hide");
});

let h3 = document.querySelector(".check-box h3");

function signLog() {
    if(h3.innerText == "Don't have account?"){
        h3.innerText = "Already have account ?";
        flipCard.innerText = "Log in";
    } else {
        h3.innerText = "Don't have account?";
        flipCard.innerText = "Sign up";
    }
}

flipCard.addEventListener("click" , signLog );

// Validators


document.querySelector('#log-form').addEventListener('submit', async function(event){
  event.preventDefault(); // Prevent the default form submission
    
  const enrollmentInput = document.getElementById('log-enrollment');
  const passwordInput = document.getElementById('log-password');
  const error = document.getElementById('log-error');
  const enrollmentValue = enrollmentInput.value;
  const passwordValue = passwordInput.value;

  try {
    const response = await fetch('/check-log', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ enrollment: enrollmentValue, password : passwordValue}),
    });

    if (response.ok) {
        // Enrollment number is available, proceed with the form submission
        error.textContent = ''; // Clear any previous enrollment error messages
        this.submit(); // Submit the form
    } else {
        // Enrollment number already exists, display the error message
        const errorMessage = await response.text();
        error.textContent = errorMessage;
    }
} catch (error) {
    // Handle any network or server errors here
    console.error('Error:', error);
    error.textContent = 'Something Went wrong';
}
});
    
document.querySelector('#sign-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const enrollmentInput = document.getElementById('enrollment');
    const passwordInput = document.getElementById('password');
    const enrollmentError = document.getElementById('enrollment-error');
    const enrollmentValue = enrollmentInput.value;
    const passwordValue = passwordInput.value;
    
    // Validate enrollment number and password
    if (!enrollmentValue.match(/^\d{8}$/)) {
        enrollmentError.textContent = 'Enrollment number is not Correct';
        return;
    }
    
    // Send a request to the backend to check for enrollment number availability
    try {
        const response = await fetch('/check-enrollment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ enrollment: enrollmentValue }),
        });

        if (response.ok) {
            // Enrollment number is available, proceed with the form submission
            enrollmentError.textContent = ''; // Clear any previous enrollment error messages
            this.submit(); // Submit the form
        } else {
            // Enrollment number already exists, display the error message
            const errorMessage = await response.text();
            enrollmentError.textContent = errorMessage;
        }
    } catch (error) {
        // Handle any network or server errors here
        console.error('Error:', error);
        enrollmentError.textContent = 'Something Went wrong';
    }
});


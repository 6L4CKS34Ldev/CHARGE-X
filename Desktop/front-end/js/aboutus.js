// aboutus.js - Doughnut Menu Functionality

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded - aboutus.js running"); // Debug line

  // Get the toggle button and menu elements
  const doughnutToggle = document.getElementById("doughnut-toggle");
  const doughnutMenu = document.querySelector(".doughnut-menu");

  // Check if elements exist before adding event listeners
  if (doughnutToggle && doughnutMenu) {
    console.log("Doughnut elements found"); // Debug line

    // Toggle menu when button is clicked
    doughnutToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Toggle clicked"); // Debug line
      doughnutMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!doughnutMenu.contains(e.target)) {
        doughnutMenu.classList.remove("active");
      }
    });
  } else {
    console.log("Doughnut elements NOT found - check HTML IDs/classes");
  }
});

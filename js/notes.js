// Optimized and improved code
const leftDiv = document.querySelector(".left");
const rightDiv = document.querySelector(".right");

// Function to create a new list element
function createListElement(content = "Enter your text here...") {
  const list = document.createElement("div");
  list.classList.add("list", "adding");
  list.setAttribute("draggable", "true");
  list.setAttribute("contenteditable", "true");
  list.innerHTML = `
        <p>${content}</p>
        <div class="controls">
            <button class="add-btn" contenteditable="false">+</button>
            <button class="del-btn" contenteditable="false">
                <img src="/images/delete.svg" alt="Delete">
            </button>
        </div>`;

  // Remove "adding" class after animation
  setTimeout(() => list.classList.remove("adding"), 500);

  // Attach all necessary events
  attachEvents(list);
  return list;
}

// Function to attach all events to a list element
function attachEvents(list) {
  // Add button functionality
  list.querySelector(".add-btn").addEventListener("click", (e) => {
    const newList = createListElement();
    const currentList = e.target.closest(".list");
    leftDiv.insertBefore(newList, currentList.nextSibling);
    saveLists();
  });

  // Delete button functionality
  list.querySelector(".del-btn").addEventListener("click", (e) => {
    const currentList = e.target.closest(".list");
    if (currentList) {
      currentList.classList.add("deleting");
      setTimeout(() => {
        currentList.remove();
        saveLists();
      }, 500);
    }
  });

  // Drag and drop functionality
  list.addEventListener("dragstart", (e) => {
    const draggedItem = e.target;
    draggedItem.classList.add("dragging");
  });

  list.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
    saveLists();
  });
}

// Handle drag over and drop events for containers
[rightDiv, leftDiv].forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  container.addEventListener("drop", (e) => {
    const draggedItem = document.querySelector(".dragging");
    if (draggedItem) {
      container.appendChild(draggedItem);
    }
  });
});

// Save lists to local storage
function saveLists() {
  const leftLists = Array.from(leftDiv.querySelectorAll(".list")).map(
    (list) => list.querySelector("p").innerText
  );
  const rightLists = Array.from(rightDiv.querySelectorAll(".list")).map(
    (list) => list.querySelector("p").innerText
  );
  localStorage.setItem("leftLists", JSON.stringify(leftLists));
  localStorage.setItem("rightLists", JSON.stringify(rightLists));
}

// Load lists from local storage
function loadLists() {
  const leftLists = JSON.parse(localStorage.getItem("leftLists")) || [];
  const rightLists = JSON.parse(localStorage.getItem("rightLists")) || [];

  leftLists.forEach((content) => {
    const list = createListElement(content);
    leftDiv.appendChild(list);
  });

  rightLists.forEach((content) => {
    const list = createListElement(content);
    rightDiv.appendChild(list);
  });
}

// Attach events to initial lists
const initialLists = document.querySelectorAll(".list");
initialLists.forEach((list) => attachEvents(list));

// Load lists from local storage on page load
window.addEventListener("load", loadLists);

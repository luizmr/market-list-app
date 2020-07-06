// variables - select items
const alert = document.querySelector(".alert");
const form = document.querySelector(".market-form");
const market = document.getElementById("market");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".market-container");
const list = document.querySelector(".market-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId = "";

// event listeners

// submit form

form.addEventListener("submit", addItem);

// clear items

clearBtn.addEventListener("click", clearItems);

// load items

window.addEventListener("DOMContentLoaded", setupItems);

// functions

// add item
function addItem(e) {
    e.preventDefault();

    const value = market.value;
    const id = new Date().getTime().toString();

    if (value !== "" && editFlag === false) {
        createListItem(id, value);
        // display alert
        displayAlert("item added to the list", "success");
        // show container
        container.classList.add("show-container");

        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    } else if (value !== "" && editFlag === true) {
        // when edit is true
        // value
        editElement.innerHTML = value;

        displayAlert("value changed", "success");

        // edit local storage
        editLocalStorage(editId, value);

        setBackToDefault();
    } else {
        displayAlert("please enter value", "danger");
    }
}

// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// clear items

function clearItems() {
    const items = document.querySelectorAll(".market-item");

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }

    container.classList.remove("show-container");

    displayAlert("empty list", "danger");

    setBackToDefault();

    // removes all the items from local storage
    localStorage.removeItem("list");
}

// edit function
function editItem(e) {
    // selects the article
    const element = e.currentTarget.parentElement.parentElement;

    // set edit item - selects the title
    editElement = e.currentTarget.parentElement.previousElementSibling;

    // set form value - puts the value who wants to edit in the input
    market.value = editElement.innerHTML;

    // edit flag
    editFlag = true;

    // edit id
    editId = element.dataset.id;

    // changes the text submit for edit
    submitBtn.textContent = "edit";
}

// delete function
function deleteItem(e) {
    // selects the article
    const element = e.currentTarget.parentElement.parentElement;

    // id from article
    const id = element.dataset.id;

    list.removeChild(element);

    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }

    displayAlert("item removed", "danger");

    setBackToDefault();

    // remove from local storage
    removeFromLocalStorage(id);
}

// set back to default
function setBackToDefault() {
    market.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const market = { id, value };

    let items = getLocalStorage();

    // adds market in the items array
    items.push(market);

    // saves in the local storage
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    // if id is different, returns the item, if not, doesnt return, then it filters
    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    });

    // saves in the local storage
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    // if the item id is equal to id, edit the new value, otherwise, returns the item
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });

    // save in the local storage
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    // if there is a list, it returns the array of list, if not, returns an empty array
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}

// setup items

function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        });

        container.classList.add("show-container");
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");
    // add class
    element.classList.add("market-item");
    // add id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button class="edit-btn" type="button">
                <i class="fa fa-edit"></i>
            </button>
            <button class="delete-btn" type="button">
                <i class="fa fa-trash"></i>
            </button>
        </div>`;

    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
}

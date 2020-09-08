function clearElement(element) {

    if (element != null) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
    }
}

//Functions to create or set any HTML-element

function createElement(id, className, type,) {
    let element = document.createElement(type);
    element.className = className;
    element.id = id;
    return element;
}

function setElement(parentElement, id, className, type) {
    let element = createElement(id, className, type);
    parentElement.appendChild(element);
    return element;
}

//Function to create or set a paragraph-element

function createParagraph(id, className, textContent) {
    let element = document.createElement("p");
    element.className = className;
    element.id = id;
    element.textContent = textContent;
    return element;
}

function setParagraph(parentElement, id, className, textContent) {
    let element = createParagraph(id, className, textContent);
    parentElement.appendChild(element);
    return element;
}

//Function to create or set a headline

function createHeadline(id, className, type, textContent) {
    let regularExpression = /h\d+/g;
    type = regularExpression.test(type) ? type : "h1";
    let element = document.createElement(type);
    element.className = className;
    element.id = id;
    element.textContent = textContent;
    return element;
}

function setHeadline(parentElement, id, className, type, textContent) {
    let element = createHeadline(id, className, type, textContent)
    parentElement.appendChild(element);
    return element;
}

//Function to create or set a link

function createLink(id, className, title, href) {
    let element = document.createElement("a");
    element.className = className;
    element.id = id;
    element.title = title;
    element.href = href;
    return element;
}

function setLink(parentElement, id, className, title, href) {
    let element = createLink(id, className, title, href);
    parentElement.appendChild(element);
    return element;
}

//Function to create or set a text-button

function createTextButton(id, className, textContent, functionToExecute) {
    let element = document.createElement("input");
    element.type = "button";
    element.value = textContent;
    element.className = className + "Hidden";
    element.id = id + "Hidden";
    element.onclick = functionToExecute;
    element.style.display = "none";

    let label = document.createElement("label");
    label.htmlFor = element.id;
    label.id = id;
    label.className = className;
    label.textContent = textContent;

    return [element, label];
}

function setTextButton(parentElement, id, className, textContent, functionToExecute) {
    let element = createTextButton(id, className, textContent, functionToExecute);
    let button = element[0];
    let label = element[1];
    parentElement.appendChild(button);
    parentElement.appendChild(label);
    return label;
}

//Function to create or set a button

function createButton(id, className, functionToExecute) {
    let element = document.createElement("input");
    element.type = "button";
    element.className = className + "Hidden";

    if (id != "" && id != null) { element.id = id + "Hidden"; }

    element.onclick = functionToExecute;
    element.style.display = "none";

    let label = document.createElement("label");
    label.htmlFor = element.id;
    label.className = className;
    label.id = id;

    return [element, label];
}

function setButton(parentElement, id, className, functionToExecute) {
    let element = createButton(id, className, functionToExecute);
    let button = element[0];
    let label = element[1];
    parentElement.appendChild(button);
    parentElement.appendChild(label);
    return label;
}

//Function to create and set a table

function createTable(id, className, headingsArray, contentMatrix) {

    let table = document.createElement("table");
    table.id = id;
    table.className = className;

    let headingsTableRow = setElement(table, "", className + "HeadingsRow", "tr");
    for (let heading of headingsArray) {
        let tableHeading = setElement(headingsTableRow, "", className + "Heading", "th")
        tableHeading.textContent = heading;
    }

    for (let row of contentMatrix) {
        let tableRow = setElement(table, "", className + "Row", "tr");
        for (let entry of row) {
            let tableEntry = setElement(tableRow, "", className + "Entry", "td");

            if (isElement(entry)) {
                tableEntry.appendChild(entry);
            } else {
                tableEntry.textContent = entry;
            }
        }
    }

    return table;
}

//Function to check whether an element is a DOM-element

function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}
// #############################
// ## Rarity related
// #############################

function getRarities() {
    const children = document.getElementById("rarities").children
    return Array.from(children).map(e => e.rarity)
}

function addRarity(rarity) {
    const rarities = document.getElementById("rarities")

    const item = document.createElement("li")
    item.classList.add("list-group-item", "rarity-list-item")
    item.rarity = rarity

    const text = document.createElement("span")
    text.innerHTML = rarity

    const deleteButton = document.createElement("button")
    deleteButton.classList.add("remove-rarity-button")
    deleteButton.innerHTML = "\uD83D\uDDD9"
    deleteButton.type = "button"
    deleteButton.addEventListener("click", evt => removeRarityButtonClicked(evt))

    item.appendChild(text)
    item.appendChild(deleteButton)

    rarities.appendChild(item)
    addRatioTableColumn(rarity)
    addRarityTab(rarity)
}

// #############################
// ## Ratios related
// #############################

function updateRatioTableRow(row) {
    const cells = row.children
    const middle = Array.from(cells).slice(1, -1)
    const last = cells[cells.length - 1]

    let sum = 0.0
    let firstCell = true
    for (const cell of middle) {
        if (cell.children.length == 0) {
            const input = document.createElement("input")
            input.type = "number"
            input.classList.add("form-control")
            input.value = firstCell ? "1.0" : "0.0"
            input.required = "true"
            input.min = "0"
            input.max = "1"
            input.step = "0.01"
            input.addEventListener("change", evt => ratioChanged(evt))
            cell.appendChild(input)
        }

        sum += +cell.children[0].value
        firstCell = false
    }

    sum = sum.toFixed(2) + ""
    last.children[0].value = sum
    if (sum !== "1.00") {
        last.children[0].classList.add("is-invalid")
        last.children[0].classList.remove("is-valid")
    } else {
        last.children[0].classList.remove("is-invalid")
        last.children[0].classList.add("is-valid")
    }
}

function refreshAllRatioTableRows() {
    const rows = document.getElementById("ratio-table-body").children

    for (const row of rows) {
        updateRatioTableRow(row)
    }
}

function adjustNumberOfRatioTableRows() {
    const tableBody = document.getElementById("ratio-table-body")
    const numberOfRowsCurrent = tableBody.children.length
    const numberOfColumns = document.getElementById("ratio-table-header-row").children.length

    const input = document.getElementById("cards-in-pack")
    const numberOfRowsTarget = input.value || input.placeholder

    const d = numberOfRowsCurrent - numberOfRowsTarget

    if (d < 0) {
        let rowCounter = numberOfRowsCurrent + 1
        for (let i = 0; i < Math.abs(d); i++) {
            const row = document.createElement("tr")

            for (let j = 0; j < numberOfColumns; j++) {
                const cell = document.createElement("td")
                row.appendChild(cell)
            }

            row.children[0].innerText = rowCounter++

            const sumInput = document.createElement("input")
            sumInput.type = "number"
            sumInput.className = "form-control"
            sumInput.setAttribute("readonly", true)
            row.children[numberOfColumns-1].appendChild(sumInput)

            tableBody.appendChild(row)
        }
        refreshAllRatioTableRows()
    }

    if (d > 0) {
        for (let i = 0; i < d; i++) {
            tableBody.lastChild.remove()
        }
    }
}

function addRatioTableColumn(rarity) {
    const headerRow = document.getElementById("ratio-table-header-row")

    const newHeader = document.createElement("th")
    newHeader.innerText = rarity

    headerRow.insertBefore(newHeader, headerRow.lastElementChild)

    const tableBody = document.getElementById("ratio-table-body")
    const rows = Array.from(tableBody.children)

    for (const row of rows) {
        const cell = document.createElement("td")
        row.insertBefore(cell, row.lastChild)
    }
    refreshAllRatioTableRows()

}

function removeRatioTableColumn(rarity) {
    const headerRow = document.getElementById("ratio-table-header-row")
    const rarities = Array.from(headerRow.children).slice(1, -1)

    let index = rarities.findIndex(e => e.innerText == rarity)

    if (index < 0) {
        console.log(rarity, " not found and could not be removed")
        return
    }

    index++ // We ignored the first and last element earlier

    const tableBody = document.getElementById("ratio-table-body")
    const rows = Array.from(tableBody.children)

    headerRow.children[index].remove()
    for (const row of rows) {
        row.children[index].remove()
    }

    refreshAllRatioTableRows()
}

// #############################
// ## Cards
// #############################

function addRarityTab(rarity) {
    const rarityId = rarity.replace(" ", "-").toLowerCase()

    // Button
    const button = document.createElement("button")
    button.className = "nav-link"
    button.id = rarityId + "-tab"
    button.type = "button"
    button.innerText = rarity
    button.setAttribute("data-bs-toggle", "tab")
    button.setAttribute("data-bs-target", "#" + rarityId + "-tab-page")
    button.setAttribute("role", "tab")

    const listItem = document.createElement("li")
    listItem.id = button.id + "-container"
    listItem.className = "nav-item"
    listItem.setAttribute("role", "presentation")
    listItem.appendChild(button)

    // Content
    const textarea = document.createElement("textarea")
    textarea.className = "form-control"
    textarea.setAttribute("rows", "20")
    //textarea.setAttribute("placeholder", "33396948\n08124921\n44519536\n70903634\n07902349")
    textarea.setAttribute("placeholder", rarityId)

    const page = document.createElement("div")
    page.id = rarityId + "-tab-page"
    page.className = "tab-pane fade"
    page.setAttribute("role", "tabpanel")
    page.setAttribute("aria-labelledby", rarityId + "-tab")
    page.appendChild(textarea)

    // Add to page
    const tabs = document.getElementById("card-tabs")
    const pages = document.getElementById("card-tabs-pages")

    tabs.appendChild(listItem)
    pages.appendChild(page)
}

function removeRarityTab(rarity) {
    document.getElementById(rarity + "-tab-container").remove()
    document.getElementById(rarity + "-tab-page").remove()
}

// #############################
// ## Initialization
// #############################

function setRatiosToEarlyCoreSet() {
    const tableBody = document.getElementById("ratio-table-body")
    const rows = Array.from(tableBody.children)

    const eightRow = rows[7]
    eightRow.children[1].children[0].value = "0.0"
    eightRow.childNodes[2].children[0].value = "1.0"

    const ninthRow = rows[8]
    ninthRow.children[1].children[0].value = "0.71"
    ninthRow.children[3].children[0].value = "0.17"
    ninthRow.children[4].children[0].value = "0.08"
    ninthRow.children[5].children[0].value = "0.04"
}

function selectFirstTab() {
    const tabs = document.getElementById("card-tabs")
    const pages = document.getElementById("card-tabs-pages")

    tabs.children[0].children[0].classList.add("active")
    pages.children[0].classList.add("show", "active")
}

function init() {
    adjustNumberOfRatioTableRows()
    addRarity("Common")
    addRarity("Rare")
    addRarity("Super Rare")
    addRarity("Ultra Rare")
    addRarity("Secret Rare")
    setRatiosToEarlyCoreSet()
    selectFirstTab()
}

// #############################
// ## GUI event handlers
// #############################

function addRarityButtonClicked() {
    const newRarity = document.getElementById("rarity-input").value
    addRarity(newRarity)
    document.getElementById("rarity-input").value = ""
}

function removeRarityButtonClicked(evt) {
    const parent = evt.target.parentNode
    const rarity = parent.rarity

    parent.remove()
    removeRatioTableColumn(rarity)
    removeRarityTab(rarity)
}

function ratioChanged(evt) {
    updateRatioTableRow(evt.target.parentNode.parentNode)
}

function cardsInPacksChanged(evt) {
    adjustNumberOfRatioTableRows()
}

function exportConfiguration() {

    const name = document.getElementById("name")
    console.log(name)
    if (!name.value) {
        name.classList.add("is-invalid")
        name.classList.remove("is-valid")
    } else {
        name.classList.remove("is-invalid")
        name.classList.add("is-valid")
    }

}

// Prevent submits on ENTER
window.addEventListener('keydown', function (e) {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13){
        e.preventDefault();
        return false;
    }
}, true);

window.addEventListener("load", () => init())

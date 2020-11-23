var AVAILABLE_CHANGE = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];


//Create an html initial structure with javascript
var createInitialHtmlStructure = (availableChange, rootElement) => {
  var ul = document.createElement("ul");
  ul.setAttribute("id", "available-change-list");
  ul.classList.add("content")

  for (i = 0; i < availableChange.length; i++) {
    var li = document.createElement("li");
    var label = document.createElement("label");
    var input = document.createElement("input");
    var span = document.createElement("span");

    var labelText = (availableChange[i] >= 1? (availableChange[i] + "€") : (availableChange[i]*100 + "cent")) + " x "; 
    label.textContent = labelText;
    label.setAttribute("for", availableChange[i]);

    input.setAttribute("id", availableChange[i]);
    input.classList.add("badge");

    span.textContent = "Unidades";

    li.appendChild(label);
    li.appendChild(input);
    li.appendChild(span);
    ul.appendChild(li);
  }

  var h2 = document.createElement("h2");
  h2.textContent = "Cambio disponible en caja";
  
  var button = document.createElement("button");
  button.type = "button";
  button.textContent = "+";
  button.classList.add("collapsible");
  button.setAttribute("id", "collapsible")

  rootElement.appendChild(h2);
  rootElement.appendChild(button);
  rootElement.appendChild(ul);
};

var getAvailableChangeInputValue = () => {
    var inputList = document.getElementsByClassName("badge");

    var availableChangeInputArray = [];

    for (i = 0; i < inputList.length; i++) {
      var inputArray = [];
      var input = document.getElementById(inputList[i].id);
      inputArray[0] = input.id;
      inputArray[1] = input.value;
      availableChangeInputArray.push(inputArray);
    }

  return availableChangeInputArray;
};

var changeAlgorithm = (totalImport, quantityGiven, availableChange) => {
  //calculate the different to know the change back
  var difference = quantityGiven - totalImport;
  //Change algorithm
  //1. look for the coin or bill bigger that can be given
  var changeBack = [];
  for (const badge of availableChange) {
    if (difference / badge[0] >= 1) {
      var badgeCount = Math.trunc(difference / badge[0]);

      if (badgeCount > badge[1]) {
        continue;
      } else {
        changeBack.push([badge[0], badgeCount]);
        difference =
          Math.round(
            (difference - badge[0] * Math.floor(difference / badge[0])) * 100
          ) / 100;
      }
    }
    //2. repeat the 1. until the difference is 0
    if (difference === 0) break;
  }
  if (difference !== 0) {
    return -1;
  }
  return changeBack;
};

var coinOrBill = (value, quantity) => {
  var coinOrBillText = "";
  var coinOrBillClass = "";
  if (value >= 5) {
    if (quantity === 1) {
      coinOrBillText = "billete";
      coinOrBillClass = "bill";
    } else {
      coinOrBillText = "billetes";
      coinOrBillClass = "bills";
    }
  } else {
    if (quantity === 1) {
      coinOrBillText = "moneda";
      coinOrBillClass = "coin";
    } else {
      coinOrBillText = "monedas";
      coinOrBillClass = "coins";
    }
  }
  return [coinOrBillText, coinOrBillClass];
};

var showTotalBack = (rootElement, totalBack) => {
  var h3 = document.createElement("h3");
  h3.textContent = "Total a devolver: " + totalBack.toFixed(2) + " €";

  rootElement.innerHTML = "";
  rootElement.appendChild(h3);
};

var showErrorMessage = (errorMessage, rootElement, deleteRootElemenContent) => {
  var h2 = document.createElement("h2");

  h2.setAttribute("id", "error-message");
  h2.textContent = errorMessage;

  if (deleteRootElemenContent) rootElement.innerHTML = "";
  rootElement.appendChild(h2);
};

var createHtmlChangeBackElements = (changeBackList, totalBack, rootElement) => {
  var ul = document.createElement("ul");

  for (i = 0; i < changeBackList.length; i++) {
    var li = document.createElement("li");
    var span = document.createElement("span");

    var coinOrBillArray = coinOrBill(changeBackList[i][0], changeBackList[i][1])

    span.setAttribute("class", coinOrBillArray[1]);

    span.textContent = changeBackList[i][1] + " " + coinOrBillArray[0] +
      " de " + Number(changeBackList[i][0]).toFixed(2) + "€";

    li.appendChild(span);
    ul.appendChild(li);
  }

  showTotalBack(rootElement, totalBack);

  rootElement.appendChild(ul);
};

var buttonEventHandler = () => {
  //get input values
  var totalImport = document.getElementById("import").value;
  var quantityGiven = document.getElementById("quantity-given").value;

  //calculate the initial difference
  var initialdifference = quantityGiven - totalImport;

  //get html result div
  var result = document.getElementById("result");

  var errorMessage = "";

  if (initialdifference <= 0) {
    errorMessage = "La cantidad entregada debe ser mayor que el importe total.";

    showErrorMessage(errorMessage, result, true);
  } else {
    
    var collapsibleButton = document.getElementById("collapsible");
    var availableChangeInput = [];

    if (collapsibleButton.classList.contains("active")) {

      availableChangeInput = getAvailableChangeInputValue();

      
    } else {
      
      for (i = 0; i < AVAILABLE_CHANGE.length; i++) {
        var inputArray = [];
        inputArray[0] = AVAILABLE_CHANGE[i];
        inputArray[1] = Infinity;
        availableChangeInput.push(inputArray);
      }
    }

    
    var changeBack = changeAlgorithm(
      totalImport,
      quantityGiven,
      availableChangeInput
    );

    if (changeBack === -1) {
      showTotalBack(result, initialdifference);

      errorMessage =
        "No hay suficientes monedas o billetes para devolver el cambio.";

      showErrorMessage(errorMessage, result, false);
    } else {
      createHtmlChangeBackElements(changeBack, initialdifference, result);
    }
  }
};



var fold = () => {
  var collapsibleButton = document.getElementById("collapsible");
  collapsibleButton.classList.toggle("active");
  var content = collapsibleButton.nextElementSibling;
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}
//Event handler for button
document.getElementById("calculate").addEventListener("click", buttonEventHandler);

var rootElement = document.getElementById("available-change");
createInitialHtmlStructure(AVAILABLE_CHANGE, rootElement);

document.getElementById("collapsible").addEventListener("click", fold);

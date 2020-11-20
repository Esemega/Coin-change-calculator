var AVAILABLE_CHANGE = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];

var changeAlgorithm = (totalImport, quantityGiven, availableChange) => {
  //calculate the different to know the change back
  var difference = quantityGiven - totalImport;
      //Change algorithm
    //1. look for the coin or bill bigger that can be given
    var changeBack = [];
    for (const badge of availableChange) {
      if (difference / badge >= 1) {
        changeBack.push([badge, Math.trunc(difference / badge)]);
        difference =
          Math.round(
            (difference - badge * Math.floor(difference / badge)) * 100
          ) / 100;
      }
      //2. repeat the 1. until the difference is 0
      if (difference === 0) break;
    }
    return changeBack;
}

var coinOrBill = (value, quantity) => {
  var coinOrBillText = "";
  if (value >= 5) {
    if (quantity === 1) {
      coinOrBillText = "billete";
    } else {
      coinOrBillText = "billetes";
    }
  } else {
    if (quantity === 1) {
      coinOrBillText = "moneda";
    } else {
      coinOrBillText = "monedas";
    }
  }
  return coinOrBillText;
}

var createHtmlStructure = (changeBackList, totalBack, rootElement ) => {
  var ul = document.createElement("ul");

    for (i = 0; i < changeBackList.length; i++) {
      var li = document.createElement("li");
      var span = document.createElement("span");    

      span.textContent =
        changeBackList[i][1] + " " + coinOrBill(changeBackList[i][0], changeBackList[i][1]) + " de " + changeBackList[i][0].toFixed(2) + "€";

      li.appendChild(span);
      ul.appendChild(li);
    }

    var h3 = document.createElement("h3");
    h3.textContent = "Total a devolver: " + totalBack.toFixed(2) + " €";

    
    rootElement.innerHTML = "";
    rootElement.appendChild(h3);
    rootElement.appendChild(ul);
}

var buttonEventHandler = () => {
  //get input values
  var totalImport = document.getElementById("import").value;
  var quantityGiven = document.getElementById("quantity-given").value;

  //calculate the initial difference
  var initialdifference = quantityGiven - totalImport;

  //get html result div
  var result = document.getElementById("result");

  if (initialdifference <= 0) {
    var h2 = document.createElement("h2");
    h2.setAttribute("id", "error-message")
    h2.textContent =
      "La cantidad entregada debe ser mayor que el importe total.";

    result.innerHTML = "";
    result.appendChild(h2);
  } else {

    var changeBack = changeAlgorithm(totalImport, quantityGiven, AVAILABLE_CHANGE);
    createHtmlStructure(changeBack, initialdifference, result);
    
  }
};

//Event handler for button
document.getElementById("calculate").addEventListener("click", buttonEventHandler);

var AVAILABLE_CHANGE = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];

var changeAlgorithm = () => {
  //get input values
  var totalImport = document.getElementById("import").value;
  var quantityGiven = document.getElementById("quantity-given").value;
  console.log({ totalImport });
  console.log({ quantityGiven });
  //calculate the different to know the change back
  var initialdifference = quantityGiven - totalImport;
  var difference = initialdifference;
  console.log({ difference });

  if (initialdifference <= 0) {
    var h2 = document.createElement("h2");
    h2.textContent =
      "La cantidad entregada debe ser mayor que el importe total.";

    var result = document.getElementById("result");
    result.innerHTML = "";
    result.appendChild(h2);
  } else {
    //Change algorithm
    //1. look for the coin or bill bigger that can be given
    var changeBack = [];
    for (const badge of AVAILABLE_CHANGE) {
      console.log(badge, "difference/ badge", difference / badge);
      if (difference / badge >= 1) {
        changeBack.push([badge, Math.trunc(difference / badge)]);
        difference =
          Math.round(
            (difference - badge * Math.floor(difference / badge)) * 100
          ) / 100;
        console.log("if-difference", difference);
      }
      //2. repeat the 1. until the difference is 0
      if (difference === 0) break;
    }
    console.log("changeBack", changeBack);

    var ol = document.createElement("ul");

    for (i = 0; i < changeBack.length; i++) {
      var li = document.createElement("li");
      var span = document.createElement("span");

      var coinOrBill = "";

      if (changeBack[i][0] >= 5) {
        if (changeBack[i][1] === 1) {
          coinOrBill = "billete";
        } else {
          coinOrBill = "billetes";
        }
      } else {
        if (changeBack[i][1] === 1) {
          coinOrBill = "moneda";
        } else {
          coinOrBill = "monedas";
        }
      }

      span.textContent =
        changeBack[i][1] + " " + coinOrBill + " de " + changeBack[i][0] + "€";

      li.appendChild(span);
      ol.appendChild(li);
    }

    var h3 = document.createElement("h3");
    h3.textContent = "Total a devolver: " + initialdifference.toFixed(2) + " €";

    var result = document.getElementById("result");
    result.innerHTML = "";
    result.appendChild(h3);
    result.appendChild(ol);
  }
};

//Event handler for button
document.getElementById("calculate").addEventListener("click", changeAlgorithm);

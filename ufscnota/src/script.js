document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
});
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".tooltipped");
  var instances = M.Tooltip.init(elems);
});

let numOptions = 7;

function config() {
  if (document.getElementById("numOptionsValue").value != numOptions) {
    numOptions = parseInt(document.getElementById("numOptionsValue").value);

    for (let i = 1; i < 8; i++) {
      console.log(i);
      document.getElementById(`option${i}`).checked = false;
      document.getElementById(`option${i}_g`).checked = false;
      document.getElementById(`option${i}`).disabled = false;
      document.getElementById(`option${i}_g`).disabled = false;
      document
        .getElementById(`parent-option${i}`)
        .classList.remove("blur-option");
      document
        .getElementById(`parent-option${i}_g`)
        .classList.remove("blur-option");

      if (i > numOptions) {
        document.getElementById(`option${i}`).disabled = true;
        document.getElementById(`option${i}_g`).disabled = true;
        document
          .getElementById(`parent-option${i}`)
          .classList.add("blur-option");
        document
          .getElementById(`parent-option${i}_g`)
          .classList.add("blur-option");
      }
    }

    document.getElementById(
      "numOpt_g"
    ).innerHTML = `(${numOptions} Proposições)`;
    document.getElementById("numOpt").innerHTML = `(${numOptions} Proposições)`;
  }

  if (
    document.getElementById("interruptores-switch").checked &&
    document.querySelector(".interruptores.hide")
  ) {
    document.querySelector(".interruptores.hide").classList.remove("hide");
    document.querySelector(".interruptores.hide").classList.remove("hide");
  } else if (
    !document.getElementById("interruptores-switch").checked &&
    document.querySelector(".interruptores:not(.hide)")
  ) {
    document.querySelector(".interruptores:not(.hide)").classList.add("hide");
    document.querySelector(".interruptores:not(.hide)").classList.add("hide");
  }

  if (
    document.getElementById("calculo-switch").checked &&
    document.querySelector(".calculo.hide")
  ) {
    document.querySelector(".calculo.hide").classList.remove("hide");
    document.querySelector(".calculo.hide").classList.remove("hide");
  } else if (
    !document.getElementById("calculo-switch").checked &&
    document.querySelector(".calculo:not(.hide)")
  ) {
    document.querySelector(".calculo:not(.hide)").classList.add("hide");
    document.querySelector(".calculo:not(.hide)").classList.add("hide");
  }

  if (
    document.getElementById("resposta-switch").checked &&
    document.querySelector(".resposta.hide")
  ) {
    document.querySelector(".resposta.hide").classList.remove("hide");
    document.querySelector(".resposta.hide").classList.remove("hide");
  } else if (
    !document.getElementById("resposta-switch").checked &&
    document.querySelector(".resposta:not(.hide)")
  ) {
    document.querySelector(".resposta:not(.hide)").classList.add("hide");
    document.querySelector(".resposta:not(.hide)").classList.add("hide");
  }
}

function checkResult(gabarito) {
  let _g;
  gabarito ? (_g = "_g") : (_g = "");

  let result = document.getElementById(`result${_g}`).value;

  if (result > 99) {
    document.getElementById(`result${_g}`).value = 0;
    alert("A resposta máxima possível é 99");
    return;
  }

  let numDiv = 2 ** (numOptions - 1);
  for (let i = numOptions; i > 0; i--) {
    Math.floor(result / numDiv)
      ? ((document.getElementById(`option${i}${_g}`).checked = true),
        (result -= numDiv))
      : (document.getElementById(`option${i}${_g}`).checked = false);
    numDiv /= 2;
  }
  calculateAnswer(gabarito);
}

function calculateAnswer(gabarito) {
  let _g;
  gabarito ? (_g = "_g") : (_g = "");

  let showcaseArray = [];
  let showcase = ``;

  let numMult = 1;
  for (let i = 1; i < numOptions + 1; i++) {
    if (document.getElementById(`option${i}${_g}`).checked)
      showcaseArray.push(numMult);
    numMult *= 2;
  }

  let result = showcaseArray.reduce(
    (total, currentElement) => total + currentElement
  );

  if (result > 99) {
    document.getElementById(`option7${_g}`).checked = false;
    alert("A resposta máxima possível é 99");
    calculateAnswer(gabarito);
    return;
  }

  for (let i = 0; i < showcaseArray.length; i++) {
    showcase += `${("0" + showcaseArray[i]).slice(-2)} + `;
  }

  showcase = showcase.substring(0, showcase.length - 2);
  showcase += `= ${("0" + result).slice(-2)}`;

  document.getElementById(`showcaseInput${_g}`).value = showcase;
  result > 9
    ? (document.getElementById(`result${_g}`).value = result)
    : (document.getElementById(`result${_g}`).value = "0" + result);

  calculateScore();
}

function calculateScore() {
  let NPC = 0;
  let NPI = 0;
  let NTPC = 0;
  let NP = numOptions;

  for (let i = 1; i < numOptions + 1; i++) {
    if (
      (document.getElementById(`option${i}_g`).checked == false) &
      (document.getElementById(`option${i}`).checked == true)
    )
      NPI++;

    if (
      (document.getElementById(`option${i}_g`).checked == true) &
      (document.getElementById(`option${i}`).checked == true)
    )
      NPC++;
    if (document.getElementById(`option${i}_g`).checked == true) NTPC++;
  }

  document.getElementById("score").innerHTML =
    NPC > NPI
      ? ((NP - (NTPC - (NPC - NPI))) / NP).toLocaleString("pt-BR", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      : "0,00";
}

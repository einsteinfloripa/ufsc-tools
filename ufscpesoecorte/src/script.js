const listDiscp = ["pl", "sl", "mt", "bi", "qm", "fc", "ch", "re", "qd"];
const curso = document.querySelector("#autocomplete-input");
const btnCalculate = document.querySelector("#calculate");
btnCalculate.onclick = function () {
  setFinalScore();
};
var dataCourseUfsc = 0;

document.getElementById("courseConfig").addEventListener("change", function () {
  curso.value = "Personalizado";
  setStateBtn();
});
document.getElementById("myScore").addEventListener("change", function () {
  setStateBtn();
});

document.addEventListener("DOMContentLoaded", function () {
  var instances = M.Modal.init(document.querySelectorAll(".modal"));
  var instances = M.FormSelect.init(document.querySelectorAll("select"));
  var instances = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
});

function configCourses() {
  setStateBtn();
  let selectedCourse = getSelectedCourseById(curso.value.split(" ")[0]);
  for (let i = 0; i < listDiscp.length; i++) {
    if (selectedCourse) {
      let peso = selectedCourse[`${listDiscp[i].toUpperCase()}_p`];
      let inputPeso = document.querySelector(
        `#discp-${listDiscp[i]} input.peso`
      );

      if (typeof peso == "number") {
        inputPeso.value = peso;
      } else {
        inputPeso.value = parseFloat(peso.toString().replace(",", "."));
      }

      let corte = selectedCourse[`${listDiscp[i].toUpperCase()}_c`];
      let inputCorte = document.querySelector(
        `#discp-${listDiscp[i]} input.corte`
      );
      inputCorte.type = "number";

      if (typeof corte == "number") {
        inputCorte.value = corte;
      } else {
        if (corte.includes("*")) {
          inputCorte.type = "text";
          inputCorte.value = corte;
        } else {
          inputCorte.value = parseFloat(corte.toString().replace(",", "."));
        }
      }
    }
  }
  document.querySelector(`#pmc input`).value = selectedCourse.PMC;
}

function getSelectedCourseById(id) {
  for (let i = 0; i < dataCourseUfsc.length; i++) {
    if (dataCourseUfsc[i].Id == id) {
      return dataCourseUfsc[i];
    }
  }
  return false;
}

function setFinalScore() {
  let final = 0;
  for (let i = 0; i < listDiscp.length; i++) {
    let total =
      document.querySelector(`#my-${listDiscp[i]} input`).value *
      100 *
      document.querySelector(`#discp-${listDiscp[i]} input.peso`).value;

    document.querySelector(`#total-${listDiscp[i]} input`).value = (
      total / 100
    ).toFixed(2);

    courseCorte = document.querySelector(
      `#discp-${listDiscp[i]} input.corte`
    ).value;

    if (courseCorte.includes("*")) {
      if (courseCorte == "*") {
        let totalCombined =
          document.querySelector(`#my-bi input`).value *
            document.querySelector(`#discp-bi input.peso`).value +
          document.querySelector(`#my-mt input`).value *
            document.querySelector(`#discp-mt input.peso`).value;

        totalCombined < 2
          ? (setStateOfDisc("bi", true), setStateOfDisc("mt", true))
          : (setStateOfDisc("bi", false), setStateOfDisc("mt", false));
      } else if (courseCorte == "**") {
        let totalCombined =
          document.querySelector(`#my-fc input`).value *
            document.querySelector(`#discp-fc input.peso`).value +
          document.querySelector(`#my-qm input`).value *
            document.querySelector(`#discp-qm input.peso`).value;

        totalCombined < 2
          ? (setStateOfDisc("fc", true), setStateOfDisc("qm", true))
          : (setStateOfDisc("fc", false), setStateOfDisc("qm", false));
      } else {
        alert(
          "Não foi possível finalizar o cálculo de uma ou mais disciplinas. Insira um valor válido no campo 'Corte'"
        );
      }
    } else {
      total / 100 < courseCorte
        ? setStateOfDisc(listDiscp[i], true)
        : setStateOfDisc(listDiscp[i], false);
    }

    final += total;
  }
  final /= 100;
  btnCalculate.innerHTML = "Ok!";
  btnCalculate.classList.add("grey");
  btnCalculate.classList.remove("black");
  document.querySelector(`#total input`).value = final.toFixed(2);
  document.querySelector(`#final input`).value = (
    (100 * final) /
    document.querySelector(`#pmc input`).value
  ).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function setStateOfDisc(discp, state) {
  if (state) {
    document.querySelector(`#total-${discp}`).classList.remove("acima-corte");
    document.querySelector(`#total-${discp}`).classList.add("abaixo-corte");
  } else {
    document.querySelector(`#total-${discp}`).classList.remove("abaixo-corte");
    document.querySelector(`#total-${discp}`).classList.add("acima-corte");
  }
}

function setStateBtn() {
  btnCalculate.innerHTML = "Calcular";
  btnCalculate.classList.remove("grey");
  btnCalculate.classList.add("black");
}

function handleData(data) {
  console.log(data);
  dataCourseUfsc = data;

  listAllCourses = {};
  for (let i = 0; i < dataCourseUfsc.length; i++) {
    var courseInfo = {};
    courseInfo[`${dataCourseUfsc[i].Id} - ${dataCourseUfsc[i].Nome}`] = null;
    listAllCourses = Object.assign(courseInfo, listAllCourses);
  }
  var instances = M.Autocomplete.init(
    document.querySelectorAll(".autocomplete"),
    {
      data: listAllCourses,
      onAutocomplete: configCourses,
    }
  );
}

function parseData(url, callBack) {
  Papa.parse(url, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      callBack(results.data);
    },
  });
}

parseData("data/dataCourseUfsc.csv", handleData);

let umbral = 0.5;
let tasaDeAprendizaje = 0.1;
let pesos = [0, 0, 0];
let conjuntoDeEntrenamiento = [];
let yaEntrenado = false;

Papa.parse("Iris2.csv", {
  download: true,
  header: true,
  dynamicTyping: true,
  delimiter: ";",
  complete: function (results) {
    console.log("Contenido del CSV:", results.data);

    conjuntoDeEntrenamiento = results.data
      .filter((row) => row.x1 !== undefined)
      .map((row) => [[row.x1, row.x2, row.x3], row.salida]);

    graficarEntradas();
  },
});

function productoPunto(valores, pesos) {
  return valores.reduce((suma, valor, i) => suma + valor * pesos[i], 0);
}

function entrenarPerceptron() {
  if (yaEntrenado) {
    console.log("El perceptrón ya fue entrenado.");
    return;
  }

  let iteracion = 0;

  while (true) {
    let contadorDeErrores = 0;

    for (let [entrada, salidaDeseada] of conjuntoDeEntrenamiento) {
      //console.log("Entrada:", entrada, "Salida:", salidaDeseada);
      const resultado = productoPunto(entrada, pesos) > umbral ? 1 : 0;
      //console.log({ resultado });

      const error = salidaDeseada - resultado;

      if (error !== 0) {
        contadorDeErrores++;
        for (let i = 0; i < entrada.length; i++) {
          pesos[i] += tasaDeAprendizaje * error * entrada[i];
        }
      }
    }

    iteracion++;
    console.log(
      `Iteración ${iteracion}, errores: ${contadorDeErrores}, pesos ${pesos}`
    );

    if (contadorDeErrores === 0 || iteracion > 1000) {
      break;
    }
  }

  console.log("Entrenamiento finalizado.");
  console.log("Pesos finales:", pesos);
  yaEntrenado = true;
}

function probarPerceptron() {
  const entradasConSalidaEsperada = [
    [[1, 6.1, 2.8], 0],
    [[1, 6.3, 2.5], 0],
    [[1, 6.1, 2.8], 0],
    [[1, 6.4, 2.9], 0],
    [[1, 6.6, 3.0], 0],
    [[1, 6.8, 2.8], 0],
    [[1, 6.7, 3.0], 0],
    [[1, 6.0, 2.9], 0],
    [[1, 5.0, 3.4], 1],
    [[1, 5.7, 2.6], 0],
    [[1, 5.5, 2.4], 0],
    [[1, 5.5, 2.4], 0],
    [[1, 5.8, 2.7], 0],
    [[1, 6.0, 2.7], 0],
    [[1, 5.4, 3.0], 0],
    [[1, 6.0, 3.4], 0],
    [[1, 6.7, 3.1], 0],
    [[1, 6.3, 2.3], 0],
    [[1, 5.6, 3.0], 0],
    [[1, 4.4, 2.9], 1],
    [[1, 5.5, 2.5], 0],
    [[1, 5.5, 2.6], 0],
    [[1, 6.1, 3.0], 0],
    [[1, 5.8, 2.6], 0],
    [[1, 5.0, 2.3], 0],
    [[1, 5.6, 2.7], 0],
    [[1, 5.7, 3.0], 0],
    [[1, 5.7, 2.9], 0],
    [[1, 6.2, 2.9], 0],
    [[1, 5.1, 2.5], 0],
  ];

  evaluarDesempeño(entradasConSalidaEsperada);
}

function evaluarDesempeño(entradasEsperadas) {
  let correctos = 0;

  entradasEsperadas.forEach(([entrada, salidaEsperada], index) => {
    const salidaPredicha = productoPunto(entrada, pesos) > umbral ? 1 : 0;
    const esCorrecto = salidaPredicha === salidaEsperada;

    if (esCorrecto) correctos++;

    console.log(
      `Entrada ${index + 1}: [${entrada.slice(1)}] → ` +
        `Predicho: ${salidaPredicha} (${
          salidaPredicha === 1 ? "Setosa" : "Otro"
        }) ` +
        `| Esperado: ${salidaEsperada} → ${esCorrecto ? "✔️" : "❌"}`
    );
  });

  const porcentaje = (correctos / entradasEsperadas.length) * 100;
  console.log(`\nAciertos: ${correctos} / ${entradasEsperadas.length}`);
  console.log(`Porcentaje de aciertos: ${porcentaje.toFixed(2)}%`);
}

function graficarEntradas() {
  const setosa = [];
  const otros = [];

  for (const [entrada, salida] of conjuntoDeEntrenamiento) {
    const punto = { x: entrada[1], y: entrada[2] }; // x2 y x3
    if (salida === 1) {
      setosa.push(punto);
    } else {
      otros.push(punto);
    }
  }

  const ctx = document.getElementById("grafico").getContext("2d");

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Setosa",
          data: setosa,
          backgroundColor: "red",
          pointRadius: 6,
        },
        {
          label: "Otros",
          data: otros,
          backgroundColor: "green",
          pointRadius: 6,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          labels: {
            color: "#000",
          },
        },
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "Sepal Length" },
          min: 4,
          max: 8,
        },
        y: {
          title: { display: true, text: "Sepal Width" },
          min: 1.8,
          max: 5,
        },
      },
    },
  });
}

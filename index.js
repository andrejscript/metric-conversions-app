'use strict';

window.addEventListener('DOMContentLoaded', () => {

const incomingDataField = document.querySelector('.enter-output'),
  resultDataField = document.querySelector('#result'),
  list = document.createElement('ul'),
  listRes = document.createElement('ul'),
  examplesDB = document.querySelectorAll('div[data-db]'),
  upload = document.querySelector('#upload'),
  saveBlock = document.querySelector('#saveBlock'),
  btnToJSON = document.querySelector('#toJSON'),
  btnReset = document.querySelector('#resetBtn');
  
  let mainSet = {},
      localDB,
      count = 0;


  function createPathToDB(path) {
  localDB = `/db/${path}.json`;
  getDataFetch(localDB);
}

async function fetchData(url) {
  let response = await fetch(url);
  mainSet = await response.json();
  unpackObject(mainSet);
}

function unpackObject(data) {
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && typeof value === 'object') {
      renderIncomingData(value);
      unpackObject(value);
      convertData(value);
    } else {
      renderIncomingData(key, value);
    }
  });
}

function renderIncomingData(k, v) {
  incomingDataField.appendChild(list);

  if (typeof k === 'object') {
    count++;
    list.innerHTML += `<h4>Set ${count}:</h4>`;
  } else {
    list.innerHTML += `<li>${k}: ${v}</li>`;
  }
}

function renderResultData(resultObj) {
  resultDataField.appendChild(listRes);
  let output;
  for (let k in resultObj) {
    output = `<li>${count}) <strong>${resultObj.convert_to}:</strong> ${resultObj.converted}</li>`;
  }
  listRes.innerHTML += output;
}

function convertData(set) {
  let inMetres,
    initialProp = set.unit,
    amountProp = set.value,
    requiredProp = set.convert_to,
    result;

  if (initialProp === requiredProp) {
    set.converted = amountProp;
  } else if (initialProp !== 'm') {
    inMetres = convertInMetres(initialProp, amountProp);
    result = convertInRequiredProp(requiredProp, inMetres);
  } else {
    result = convertInRequiredProp(requiredProp, amountProp);
  }
  
  set.converted = Math.trunc(result * 100) / 100;
  renderResultData(set);
  console.log(set);
}

function convertInMetres(init, amount) {
  let end;

  switch (init) {
    case 'mm':
      end = amount / 1000;
      break;
    case 'cm':
      end = amount / 100;
      break;
    case 'km':
      end = amount * 1000;
      break;
    case 'inc':
      end = amount / 39.37;
      break;
    case 'ft':
      end = amount / 3.281;
      break;
    case 'yd':
      end = amount / 1.094;
      break;
    case 'mi':
      end = amount * 1609;
      break;
  }
  return end;
}

function convertInRequiredProp(prop, meters) {
  let endedProp;

  switch (prop) {
    case 'mm':
      endedProp = meters * 1000;
      break;
    case 'cm':
      endedProp = meters * 100;
      break;
    case 'm':
      endedProp = meters;
      break;
    case 'km':
      endedProp = meters / 1000;
      break;
    case 'inc':
      endedProp = meters * 39.37;
      break;
    case 'ft':
      endedProp = meters * 3.28;
      break;
    case 'yd':
      endedProp = meters * 1.094;
      break;
    case 'mi':
      endedProp = meters / 1609;
      break;
  }

  return endedProp;
}

});

// (function toSelectDB() {
//   for (let i = 0; i < examplesDB.length; i++) {
//     examplesDB[i].addEventListener('click', (e) => {
//       let receivedPath = e.target.dataset.db;
//       createPathToDB(receivedPath);
//     });
//   }
// })();

// function createPathToDB(path) {
//   localDB = `/db/${path}.json`;
//   getDataFetch(localDB);
// }

// const getDataFetch = async (url) => {
//   const res = await fetch(url);

//   if (!res.ok) {
//     throw new Error(`Could not fetch ${url}` + `, received ${res.status}`);
//   }

//   let data = await res.json();
//   await createSetOfNumberArrays(data);
//   renderIncomeData(data);
// };


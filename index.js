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
    setToJSON = {},
    localDB,
    count;

  upload.addEventListener('change', (e) => {
    clearConditions();

    try {
      const upload = e.target.files[0];
      const reader = new FileReader();
      upload.value = '';
      reader.addEventListener('load', (() => {
          return (e) => {
            mainSet = JSON.parse(e.target.result);
            unpackObject(mainSet);
          };
        })(upload)
      );
      reader.readAsText(upload);
    } catch (ex) {
      console.log(ex);
    }
  });

  upload.addEventListener('click', () => {
    upload.value = '';
  });

  (function toSelectDB() {
    for (let i = 0; i < examplesDB.length; i++) {
      examplesDB[i].addEventListener('click', (e) => {
        let receivedPath = e.target.dataset.db;
        createPathToDB(receivedPath);
      });
    }
  })();

  btnReset.addEventListener('click', () => {
    clearConditions();
    localStorage.clear();
  });

  btnToJSON.addEventListener('click', () => {
    btnToJSON.classList.add('visited');
    let json = JSON.stringify(setToJSON);
    if (Object.keys(mainSet).length > 0) {
      addNoticeAfterConvert('filled');
      localStorage.setItem('json', json);
    } else {
      addNoticeAfterConvert('empty');
    }
  });

  function addNoticeAfterConvert(option) {
    let p = document.createElement('p');
    p.classList.add('to-json-prompt');
    if (option === 'filled') {
      p.innerHTML = 'Local storage has updated';
    } else {
      p.innerHTML = 'Select some JSON above';
      p.classList.add('error');
    }

    setTimeout(() => {
      saveBlock.appendChild(p);
    }, 600);
    setTimeout(() => {
      saveBlock.removeChild(p);
      btnToJSON.classList.remove('visited');
    }, 2500);
  }

  function createPathToDB(path) {
    localDB = `/db/${path}.json`;
    getDataFetch(localDB);
  }

  async function getDataFetch(url) {
    clearConditions();

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
      list.innerHTML += `<li>${k}: &nbsp;${v}</li>`;
    }

  }

  function clearConditions() {
    count = 0;
    list.innerHTML = '';
    listRes.innerHTML = '';
    deletePropsFromObj(mainSet);
  }

  function deletePropsFromObj(obj) {
    let props = Object.keys(obj);
    for (var i = 0; i < props.length; i++) {
      delete obj[props[i]];
    }
  }

  function renderResultData(resultObj) {
    let output;

    resultDataField.appendChild(listRes);
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
      result,
      obj = {};

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
    obj.unit = requiredProp;
    obj.value = set.converted;
    setToJSON[count] = obj;
    return obj;
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
const {ipcRenderer} = require('electron')
const run = require('../repository/database');
const query = require('../repository/query');
const os = require('os');

let queryResult = '';
let departments = [];
let computador = '';
let organizacao = '';

Promise.resolve(run(query.allDeps))
.then(res => { 
  departments = res; 
  console.log(departments);
  // Tabela de busca
  createTable('.div-form', departments, true);  
});

// Dom Nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    btnFind = document.getElementById('btn-find'),
    depTxt = document.getElementById('url');

// Disable & Enable modal buttons
const toggleModalButtons = () => {
  // Check state of buttons
  if (btnFind.disabled === true) {
    btnFind.disabled = false;
    btnFind.style.opacity = 1;
    btnFind.innerText = 'Buscar';
    closeModal.style.display = 'inline';
  } else {
    btnFind.disabled = true;
    btnFind.style.opacity = 0.5;
    btnFind.innerText = 'Carregando...';
    closeModal.style.display = 'none';
  }
}

// Show modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex'
  depTxt.focus();
})

// Hide modal
closeModal.addEventListener('click', e => {
  modal.style.display = 'none';
})

// Click btn-find
btnFind.addEventListener('click', e => {
  if(depTxt.value){
    toggleModalButtons();
  
  Promise.resolve(run(query.allEmps, depTxt.value))
  .then(res => { 
  const emps = res;
  
  if(emps.length > 0) createTable('.emps',emps);
  else{
    const div = document.querySelector('.emps');
    const p = document.createElement('p');
    p.id = 'no-items';
    p.innerHTML = 'Sem resultado';    
    while (div.children.length > 0) {
       div.removeChild(div.lastChild);
    }
    
    div.appendChild(p);
  }

  })
  .finally(() => {
    toggleModalButtons();
    modal.style.display = 'none';
    depTxt.value = '';
  });
}});

// Listen for keyboard submit
depTxt.addEventListener('keyup', e => {
  if( e.key === 'Enter' ) btnFind.click();
})

// Pegar os parametros passados na execução
ipcRenderer.send('online')
ipcRenderer.once('params', ( e ,parms) => {
  parms.forEach(element => {
   if(element.indexOf('=') > 0){ 
     const value = element.split(',');
     value.forEach(ev => {
        const val = ev.split('=');
        if( val[0].toUpperCase() === 'COMPUTADOR') computador = val[1];
        if( val[0].toUpperCase() === 'ORGANIZACAO') organizacao = val[1]; 
     });
    }
  });
  
Promise.resolve(run(query.usuario, computador, organizacao))
.then(res => { 
    queryResult = res; 
    if (queryResult.length === 0 || computador != os.hostname) ipcRenderer.send('User-Proibido');
  });
})


function createTable(div, array ,addClick = false){
  let refTabela = [];
  const divForm = document.querySelector(div);
  
   // Limpa O formulário ao carregar o arquivo 
   while (divForm.children.length > 0) {
    divForm.removeChild(divForm.lastChild);
  }
  
  const table = document.createElement('table');
  table.className = 'content-table';

  const keys = Object.keys(array[0]);

  // Cria cabeçalho da tabela
  let t = '';
  t += '<thead><tr>';
  t += keys.map((e) => `<th> ${e.replace('_',' ')} </th>`);
  t += '</tr></thead>';
  
  // Cria corpo da tabela
  t += '<tbody>';
  for(let val of array){
    t += (addClick) ? `<tr id='${val[keys[0]]}'>` : `<tr>`;

    refTabela.push(val[keys[0]]);

    for(let key of keys){
      
      t +=  `<td class="active-row">`;
      
      t += (val[key] === null ) ? '-': val[key];
      
      t+= '</td>';
    }
    t+= '</tr>';
  }
  t += '</tbody>';

  table.innerHTML = t.replace(/,/g,'');
  divForm.appendChild(table);

  if(addClick){
  refTabela.forEach(element => {
    document.getElementById(element).addEventListener ("click", e => {callBtn(element)});
  })
  }
}

function callBtn(e){
  depTxt.value = e;
  btnFind.click();
}

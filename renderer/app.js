const {ipcRenderer} = require('electron')
const run = require('../repository/database');
const query = require('../repository/query');
const createTable = require('./functions/table');

let queryResult = '';
let departments = [];
let usuario = '';
let senha = '';
let employee = [];

// Carrega a tabela para buscar os Departamentos
Promise.resolve(run(query.allDeps))
.then(res => { 
  departments = res; 
  console.log(departments);
  
  // Tabela de busca 
  const refTabela = createTable('.div-form', departments, true);  

  // Aciona o evento na linhas da tabela
  refTabela.forEach(element => {
    document.getElementById(element).addEventListener ("click", e => {callBtn(element)});}
  );
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
  modal.style.display = 'flex';
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
  employee = res;
  
  if(employee.length > 0) createTable('.emps',employee);
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
ipcRenderer.send('online');

// Checa se usuario tem permissão para acesso
ipcRenderer.once('params', ( e ,parms) => {

  parms.forEach(element => {
    if(element.indexOf('=') > 0){ 
     const value = element.split(',');
     value.forEach(ev => {
        const val = ev.split('=');
        if( val[0].toUpperCase() === 'USUARIO') usuario = val[1];
        if( val[0].toUpperCase() === 'SENHA') senha = val[1]; 
     });
    }
  });
  
Promise.resolve(run(query.acesso, usuario, senha))
.then(res => { 
    queryResult = res; 
    if (queryResult.length === 0) ipcRenderer.send('User-Proibido');
  });
})

function callBtn(e){
  depTxt.value = e;
  btnFind.click();
}

ipcRenderer.on('Salvar', ( e ,parms) => { 
  if (employee.length > 0) ipcRenderer.send('Salvar', employee); 
});

ipcRenderer.on('Criado', ( e ,parms) => { 
  const download = document.getElementById('download');
  download.click();
});
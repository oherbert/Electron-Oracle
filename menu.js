const {Menu, ipcMain} = require('electron');
const geraXls = require('./geraXls');

//Pega a tela que está online
let emiter;

// Recebe o emiter
ipcMain.on('online', (e, args) => {
  emiter = e;
  console.log('Menu online');
});

// Salva o Xls com a tabela da tela
ipcMain.on('Salvar', (e, args) => {
  geraXls(args);
  e.sender.send('Criado');
});

const mainMenu = Menu.buildFromTemplate([
  {
    label:'Principal',
    submenu: [
      {label:'Salvar',click:()=>{
        
        emiter.sender.send('Salvar');
        console.log('Salvar');
      
      }, accelerator:'Ctrl+S'},
      {label:'Tela Cheia',role:'togglefullscreen'},
      {label:'Sistema',
            submenu:[{label:'Sair',click:()=>{console.log('Click em sair')},accelerator:'Esc'},
                     {label:'Help'}]}
    ]
  }
]);

module.exports = mainMenu;

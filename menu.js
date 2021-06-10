const {Menu} = require('electron');

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
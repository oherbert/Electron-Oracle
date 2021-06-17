// Recebe um div onde a tabela ficara, um array com os dados e se havera evento de click na linha
module.exports = function createTable(div, array ,addClick = false){
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
      return refTabela;
    }
  }

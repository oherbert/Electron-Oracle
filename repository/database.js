const oracledb = require('oracledb');
const config = require('./config');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run(query ,condic = 0) {

  let connection;
  const condicts = [];
  

  for (let i = 1; i < arguments.length; i++ ){
    condicts.push(arguments[i]);
  }

  try {
    connection = await oracledb.getConnection( {
      user          : config.user,
      password      : config.password,
      connectString : config.connectString
    });

    console.log(query);

    const result = await connection.execute(
      query,
      condicts,  // bind value for :id
    );
    
    return result.rows;

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports =  run;
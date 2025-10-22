const SequelizeAuto = require('sequelize-auto');

require('dotenv').config({ path: '../.env' });

const auto = new SequelizeAuto(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    directory: './models',  // pasta onde os arquivos JS serão gerados
    caseModel: 'p',  // converte os nomes dos modelos para PascalCase
    caseFile: 'p',   // converte os nomes dos arquivos para PascalCase
    singularize: true, // converte nomes de tabelas para singular
    additional: {
      timestamps: false,
    },
  }
);

auto.run(err => {
  if (err) throw err;
  console.log('Modelos gerados com sucesso.');
});

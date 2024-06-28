import {openDB, DBSchema, IDBPDatabase} from "idb";

// Definição da estrutura do banco de dados
interface MeuBancoDB extends DBSchema {
  minhaTabela: {
    key: number;
    value: {id?: number; nome: string; profissao?: string; idade?: number};
    indexes: {nome: string};
  };
  /* novas tabelas */
}

const DATABASE_NAME = "meuBancoDeDados";
const DATABASE_VERSION = 1;

async function initDB(): Promise<IDBPDatabase<MeuBancoDB>> {
  return openDB<MeuBancoDB>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      // Função de upgrade é executada quando o banco de dados precisa ser atualizado
      if (!db.objectStoreNames.contains("minhaTabela")) {
        // Cria a object store (tabela) minhaTabela se ainda não existir
        const store = db.createObjectStore("minhaTabela", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("nome", "nome", {unique: true}); // Cria um índice único para o campo nome
      } else {
        // Caso a object store (tabela) minhaTabela já exista
        const store = db
          .transaction("minhaTabela", "versionchange")
          .objectStore("minhaTabela");
        if (!store.indexNames.contains("nome")) {
          // Verifica se o índice por nome já existe, caso contrário, cria-o
          store.createIndex("nome", "nome", {unique: true});
        }
      }
    },
  });
}

export {initDB};

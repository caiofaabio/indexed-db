import { openDB, DBSchema, IDBPDatabase } from "idb";

interface MeuBancoDB extends DBSchema {
  minhaTabela: {
    key: number;
    value: {id?: number; nome: string, profissao?: string, idade?: number}
    indexes: { nome: string };
  };
  /* novas tabelas */
}

const DATABASE_NAME = 'meuBancoDeDados';
const DATABASE_VERSION = 1;

async function initDB(): Promise<IDBPDatabase<MeuBancoDB>> {
  return openDB<MeuBancoDB>(DATABASE_NAME, DATABASE_VERSION , {
    upgrade(db) {
      if(!db.objectStoreNames.contains('minhaTabela')) {
        const store = db.createObjectStore('minhaTabela', {keyPath: 'id', autoIncrement: true});
        store.createIndex('nome', 'nome', {unique: true})
      } else {
        const store = db.transaction('minhaTabela', 'versionchange').objectStore('minhaTabela');
        if(!store.indexNames.contains('nome')){
          store.createIndex('nome', 'nome', {unique: true})
        }
      }
    }
  });
}


export { initDB }
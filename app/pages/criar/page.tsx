"use client";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {initDB} from "@/app/lib/indexedDb/indexedDb";

const Criar = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [profissao, setProfissao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (nome) {
      const db = await initDB(); // Inicializa o banco de dados
      const tx = db.transaction("minhaTabela", "readwrite"); // Cria uma transação de escrita na tabela minhaTabela
      const store = tx.objectStore("minhaTabela"); // Obtém o object store (tabela) minhaTabela

      /* verifica se o nome já existe */
      const index = store.index("nome"); // Obtém o índice nome da tabela
      const existeItem = await index.get(nome); // Verifica se já existe um item com o nome fornecido
      if (!existeItem) {
        await store.add({nome, profissao, idade}); // Adiciona um novo item se o nome não existir
      }

      await tx.done; // Completa a transação
    }
  };

  useEffect(() => {
    const updateData = async () => {
      setLoading(true);
      try {
        const db = await initDB(); // Inicializa o banco de dados
        const tx2 = db.transaction("minhaTabela", "readonly"); // Cria uma transação de leitura na tabela minhaTabela
        const store2 = tx2.objectStore("minhaTabela"); // Obtém o object store (tabela) minhaTabela
        const allData = await store2.getAll(); // Obtém todos os dados da tabela
        setData(allData); // Atualiza o estado data com os dados obtidos
      } catch (e) {
        console.error(e); // Exibe erros no console, se houver algum
      } finally {
        setLoading(false); // Define loading como false após o término, indicando o fim do carregamento
      }
    };

    updateData();
  }, []);

  console.log(data);
  console.log(loading);
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1>Criar Itens no indexedDB</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome:
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Profissão
          </label>
          <input
            type="text"
            value={profissao}
            onChange={(e) => setProfissao(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Idade
          </label>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Criar
        </button>
      </form>
      <ul>
        {loading || data.length === 0 ? (
          <p className="text-white font-bold">Carregando...</p>
        ) : (
          data.map((item) => (
            <li key={item.id}>
              Nome: {item.nome} - Idade: {item.idade} - Profissão:{" "}
              {item.profissao}
            </li>
          ))
        )}
      </ul>
    </main>
  );
};

export default Criar;

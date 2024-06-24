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
      const db = await initDB();
      const tx = db.transaction("minhaTabela", "readwrite");
      const store = tx.objectStore("minhaTabela");

      /* verifica se o nome ja existe */
      const index = store.index("nome");
      const existeItem = await index.get(nome);
      if (!existeItem) {
        await store.add({nome, profissao, idade});
      }

      await tx.done;
    }
  };

  useEffect(() => {
    const updateData = async () => {
      setLoading(true);
      try {
        const db = await initDB();
        const tx2 = db.transaction("minhaTabela", "readonly");
        const store2 = tx2.objectStore("minhaTabela");
        const allData = await store2.getAll();
        setData(allData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
  
    updateData();
  }, []);

  console.log(data);
  console.log(loading)
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

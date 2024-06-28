"use client";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {initDB} from "@/app/lib/indexedDb/indexedDb";

const Editar = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [id, setId] = useState(0);
  const [profissao, setProfissao] = useState("");
  const [loading, setLoading] = useState(false);

  const updateItem = async (idToUpdate: any, newData: any) => {
    try {
      const db = await initDB(); // Inicializa o banco de dados
      const tx = db.transaction("minhaTabela", "readwrite"); // Cria uma transação de escrita na tabela minhaTabela
      const store = tx.objectStore("minhaTabela"); // Obtém o object store (tabela) minhaTabela

      /* encontrar o item para update */
      const itemToUpdate = await store.get(idToUpdate); // Obtém o item com o ID fornecido para atualização
      console.log(itemToUpdate);

      if (!itemToUpdate) {
        console.error("Item não encontrado"); // Exibe um erro se o item não for encontrado
        return;
      }

      /* modificando item */
      itemToUpdate.nome = newData.nome; // Atualiza o nome do item
      itemToUpdate.idade = newData.idade; // Atualiza a idade do item
      itemToUpdate.profissao = newData.profissao; // Atualiza a profissão do item

      await store.put(itemToUpdate); // Atualiza o item na tabela

      await tx.done; // Completa a transação

      alert("Item atualizado com sucesso"); // Exibe um alerta indicando sucesso na atualização
    } catch (e) {
      console.error(e, "Erro ao atualizar item"); // Exibe erros no console, se houver algum
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await updateItem(id, {nome, idade, profissao}); // Chama a função updateItem para atualizar o item com os novos dados
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

    updateData(); // Chama a função updateData ao montar o componente
  }, []);

  console.log(data);
  console.log(loading);
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1>Editar Itens no indexedDB</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID:
          </label>
          <input
            type="number"
            value={id}
            onChange={(e) => setId(parseInt(e.target.value))}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
          />
        </div>
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
          Editar
        </button>
      </form>
      <ul>
        {loading || data.length === 0 ? (
          <p className="text-white font-bold">Carregando...</p>
        ) : (
          data.map((item) => (
            <li key={item.id}>
              ID: {item.id} - Nome: {item.nome} - Idade: {item.idade} -
              Profissão: {item.profissao}
            </li>
          ))
        )}
      </ul>
    </main>
  );
};

export default Editar;

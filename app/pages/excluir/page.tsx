"use client";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {initDB} from "@/app/lib/indexedDb/indexedDb";

const Excluir = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const deleteItem = async (idToDelete: number) => {
    try {
      const db = await initDB(); // Inicializa o banco de dados
      const tx = db.transaction("minhaTabela", "readwrite"); // Cria uma transação de escrita na tabela minhaTabela
      const store = tx.objectStore("minhaTabela"); // Obtém o object store (tabela) minhaTabela

      /* excluindo item com o id */
      await store.delete(idToDelete); // Deleta o item com o ID fornecido
      await tx.done; // Completa a transação

      alert("Item DELETADO com sucesso"); // Exibe um alerta indicando sucesso na exclusão
    } catch (e) {
      console.error(e, "Erro ao DELETAR item"); // Exibe erros no console, se houver algum
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    confirm("Tem certeza que deseja excluir este item?") &&
      (await deleteItem(id)); // Pede confirmação antes de excluir o item
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
      <h1>Excluir Itens no indexedDB</h1>
      <form
        onSubmit={handleDelete}
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Excluir
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

export default Excluir;

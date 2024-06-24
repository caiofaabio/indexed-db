'use client'
import React, { useState } from 'react'

const Navbar = () => {
  const [active, setActive] = useState(false)
  const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'Criar Dados', href: '/pages/criar', current: false },
    { name: 'Editar Dados', href: '/pages/editar', current: false },
    { name: 'Excluir Dados', href: '/pages/excluir', current: false },
  ]


  return (
    <nav className="bg-gray-800 p-8">
      <ul className='flex gap-5 justify-center'>
        {navigation.map((item) => (
          <li key={item.name} className={`text-white hover:text-indigo-500 font-bold ${active ??'text-indigo-600'}`}>
            <a
              href={item.href}
              className={item.current ? 'active' : 'inactive'}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar

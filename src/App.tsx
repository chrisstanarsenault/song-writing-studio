import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'

import styles from './App.module.css'

import { NavBar } from './globals/components/nav-bar/nav-bar'

function App() {
  return (
    <>
      <section className={styles.container}>
        <NavBar />

        <main className={styles.main}>
          <ToastContainer position="top-center" />
          <Outlet />
        </main>
      </section>
    </>
  )
}

export default App

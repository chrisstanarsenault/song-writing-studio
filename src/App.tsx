import { Outlet } from 'react-router'

import styles from './App.module.css'

import { NavBar } from './components/nav-bar/nav-bar'

function App() {
  return (
    <>
      <section className={styles.container}>
        <NavBar />

        <main className={styles.main}>
          <Outlet />
        </main>
      </section>
    </>
  )
}

export default App

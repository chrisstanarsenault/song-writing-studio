import styles from './nav-bar.module.css'
import { NavLink } from 'react-router'

export const NavBar = () => {
  return (
    <div className={styles.background}>
      <section>
        <h2 className={styles.title + ' uppercase-text'}>SongWriting Studio</h2>
        <h3 className={styles.subtitle + ' uppercase-text'}>Your Workspace</h3>
      </section>

      <nav>
        <ul className={styles.nav_items}>
          <li >
            <NavLink to="/" className={styles.nav_item}>Library</NavLink>
          </li>

          <li>
            <NavLink to="/archive" className={styles.nav_item}>Archive</NavLink>
          </li>

          <li>
            <NavLink to="/settings" className={styles.nav_item}>Settings</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

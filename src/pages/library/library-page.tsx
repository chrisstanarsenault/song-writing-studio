import styles from './library-page.module.css'

const LibraryPage = () => {
  return (
    <div className={styles.background}>
      <section className={styles.header_container}>
        <div>
          <h2>Song Library</h2>
          <h3>Your songs, words and melodies, together.</h3>
        </div>

        <div className={styles.buttons_container}>
          <button>+ New song</button>
          <button>Capture idea</button>
        </div>
      </section>

      <section className={styles.grid_container}>
        <section className={styles.search_container}>
          <input type="text" placeholder="Search songs..." />

          <select id="status-select" name="status" aria-label="Status">
            <option value="all">All statuses</option>
            <option value="idea">Idea</option>
            <option value="progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <select id="tags-select" name="tags" aria-label="Tags">
            <option value="all">All tags</option>
            <option value="tag1">Tag 1</option>
            <option value="tag2">Tag 2</option>
            <option value="tag3">Tag 3</option>
          </select>
        </section>

        <section className={styles.stats_container}>
          <div className={styles.stats_item}>
            <h4>Total songs</h4>
            <p>0</p>
          </div>

          <div className={styles.stats_item}>
            <h4>In progress</h4>
            <p>0</p>
          </div>

          <div className={styles.stats_item}>
            <h4>Completed</h4>
            <p>0</p>
          </div>
        </section>

        <section className={styles.content_container}>
          <section className={styles.content}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Tags</th>
                  <th scope="col">Last Edited</th>
                  <th scope="col">Takes</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Song 1</td>
                  <td>Idea</td>
                  <td>Tag 1, Tag 2</td>
                  <td>2026-01-01</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.backup_container}>
            <h4>Your library, safe</h4>
            <p>Keep a complete copy of your lyrics, notes and audio.</p>

            <button>Export backup</button>
            <button>Import backup</button>
          </section>
        </section>
      </section>
    </div>
  )
}

export default LibraryPage

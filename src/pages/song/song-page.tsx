import Header from '../../globals/components/header/header'

const songName = 'Untitled song'
const songStatus = 'Idea'

const SongPage = () => {
  return (
    <div>
      <Header
        title={songName}
        description={songStatus}
        buttons={[
          {
            title: 'Record idea',
            type: 'primary',
            onClick: () => {
              console.log('Record idea')
            }
          }
        ]}
      />
    </div>
  )
}

export default SongPage

import React from 'react'

class RoomList extends React.Component {
    render () {
        return (
            <div className="rooms-list">
              <ul>
                <h3>Your Rooms</h3>
                  <li className='room'>
                    <button>General</button>
                  </li>
              </ul>
            </div>
        )
    }
}

export default RoomList

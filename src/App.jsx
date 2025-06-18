import { useState } from 'react'
import Treino from './Treino.jsx'
import profilePic from './assets/images/profile.jpg'
import Header from './Header.jsx'
import Footer from './Footer.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>

      <div className="app-body">
        <div className="main-content">
          <Treino></Treino>
        </div>
      </div>
      
      <Footer></Footer>
    </>
  )
}

export default App

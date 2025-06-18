import { useEffect } from 'react';
import profilePic from './assets/images/profile.jpg'

function Header(){


    /*useEffect(() => {
        const menu = document.querySelector('.content');
    }, []);*/

    function dropDownFunction(event){
        const menu = document.querySelector('.content');
        const bell = document.querySelector('.material-icons');
        //event.stopPropagation();
        menu.classList.toggle("show");
        bell.classList.toggle("show");
    }

    document.addEventListener('click', function(e) {
        const toggle = document.querySelector('.dropdown-toggle');
        const menu = document.querySelector('.content');
        const bell = document.querySelector('.material-icons');
        if (!menu.contains(e.target) && !toggle.contains(e.target)){
            menu.classList.remove("show");
            bell.classList.remove("show");
        }
    });

        /*
        const toggle = document.querySelector('.dropdown-toggle');
        const menu = document.querySelector('.content')

        toggle.addEventListener("click", function(e) {
        e.stopPropagation(); // previne fechamento ao clicar
        menu.classList.toggle('show');
        console.log("teste");
        });

        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)){
                menu.classList.remove('show');
            }
            console.log("teste");
        });*/



    return(
        <header>
                <div className="header-div">
                  <div className="header-profile">
                    <img className="profile-picture" src={profilePic} alt="Profile Picture" width="50" height="50"></img>
                    <div>
                      <span className="profile-text">Bem vindo,</span>
                      <span className="profile-text">Username</span>
                    </div>
                  </div>
                  
                  <div className="dropdown">
                    <button onClick={(event) => dropDownFunction(event)} className="dropdown-toggle">
                        <i className="material-icons">notifications</i>
                    </button>

                    <div className="content">
                        <a href="/">Home</a>
                        <a href="/treino">Treino</a>
                        <a href="/estatisticas">Estatisticas</a>
                        <a href="/profile">Perfil</a>
                    </div>
                  </div>
                    
                  
                </div>
                
              </header>
    )
}
export default Header
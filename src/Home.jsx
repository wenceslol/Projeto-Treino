import Header from "./Header"
import Footer from "./Footer"
import React, { useEffect, useState } from 'react'

function Home(){

    const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
    console.log(dias);
    const agora = new Date().getDay();
    //trunca a array para o domingo ser o último dia ao invés do primeiro. não sei como?
    const indiceHoje = agora === 0 ? 6 : agora - 1;

    function handleClickDia(index){

        console.log(dias[index]);
        console.log(indiceHoje.toLocaleString());

    }

    return(
        <>
            <Header></Header>
            <h1>HOME</h1>
            <div className="semanaBox">

            {dias.map((dia, index) => (

                <div key={index}
                     className={`dia${index === indiceHoje ? 'Ativo' : ''}`}
                     onClick={(event) =>handleClickDia(index)}
                >{dia}</div>

            ))}

            </div>


            <Footer></Footer>
        </>
    )
}

export default Home
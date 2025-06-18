import { NavLink } from "react-router-dom"

function Footer(){

    return(
        <footer>
            <div className="footer-div">

                <NavLink to="/" className={({ isActive}) => isActive ? "active" : ""}>
                    <i className="material-icons">home</i>
                </NavLink>
                <NavLink to="/treino" className={({ isActive}) => isActive ? "active" : ""}>
                    <i className="material-icons">fitness_center</i>
                </NavLink>
                <NavLink to="/estatisticas" className={({ isActive}) => isActive ? "active" : ""}>
                    <i className="material-icons">bar_chart</i>
                </NavLink>
                <NavLink to="/profile" className={({ isActive}) => isActive ? "active" : ""}>
                    <i className="material-icons">account_circle</i>
                </NavLink>
                
            </div>
        </footer>
    )
}
export default Footer
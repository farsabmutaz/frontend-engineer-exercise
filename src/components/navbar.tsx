import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav
            style={{
                borderBottom: 'solid 1px',
                paddingBottom: '1rem',
                marginBottom: '1rem',
            }}
        >
            <Link to="/">Home</Link> |{' '}
            <Link to="/states">States Search Example</Link> |{' '}
            <Link to="/college">College Concentrations</Link> |{' '}
            <Link to="/commutes">Commutes</Link> |{' '}
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link> | {" "}
            {isAuthenticated && <Link onClick={logout} to={""}>
                Logout
            </Link>}
        </nav>
    );
};

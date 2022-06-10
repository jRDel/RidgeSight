import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from 'react-bootstrap/Container';
import Routes from "./Routes";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext, ThemeContext, themes } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const nav = useNavigate();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
    nav("/login");
  }
  return (
    !isAuthenticating && (
      <div className="">
        <Navbar collapseOnSelect bg="dark" expand="lg" variant="dark" className="mb-3">
          <Container fluid>
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold">
              <Container>
              RidgeSight
              </Container>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                <Navbar.Collapse className="justify-content-end">
                  <LinkContainer to="/profile">
                    <Nav.Link>Profile</Nav.Link>
                  </LinkContainer>
                </Navbar.Collapse>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
                
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
          </Container>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
        <ThemeContext.Consumer>
        {({ changeTheme }) => (
              <div className="modebutton">
                <Button
                onClick={() => {
                  setDarkMode(!darkMode);
                  changeTheme(darkMode ? themes.light : themes.dark);
                }}
                variant = {darkMode ? "light" : "dark"}
              >
                {darkMode ? <span>Light Mode</span> : <span>Dark Mode</span>}
              </Button>
              </div>
            )}
        </ThemeContext.Consumer>
      </div>
    )
  );
}

export default App;
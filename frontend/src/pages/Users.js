import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { API } from "aws-amplify";

export default function Users(){
    const [users, setUsers] = useState([]);
    const nav = useNavigate();
    
    useEffect(() => {
        async function onLoad(){
            //Populate users
            const u = 
                [
                    {
                        firstname: "Jakob",
                        lastname: "Delossantos",
                    },
                    {
                        firstname: "Mary",
                        lastname: "Rankin",
                    },
                    {
                        firstname: "Jared",
                        lastname: "Stigter",
                    },
                    {
                        firstname: "Alexander",
                        lastname: "Peek",
                    }
                ]
            //setUsers(u);
            const userList = await loadUsers();
            setUsers(userList);
        }
        onLoad();
    }, [])

    async function loadUsers(){
        return API.get("ridgesight", "/profile");
    }

    function renderOtherProfile(value){
        console.log(value);
        nav('/');
    }

    return(
        <Container>
            <Row>
                <Col>
                <Card style={{ width: '100%' }}>
                <Card.Header><h1>Users</h1></Card.Header>
                <ListGroup variant="flush">
                    {users.map((user)=> {
                        return <ListGroup.Item style={{height: '5rem'}}>
                            <>
                            <Row>
                                <Col xs="auto">
                                    <img src="/ridgelinesvg.svg"  width = "50" height = "50" alt="logo" />
                                </Col>
                                <Col xs="auto">
                                    <h3>{user.firstname} {user.lastname}</h3>
                                </Col>
                                <Col>
                                    <Button variant="dark" onClick={() => renderOtherProfile(user)}>Profile</Button>
                                </Col>
                            </Row>
                            </>
                            
                        </ListGroup.Item>
                    })}
                </ListGroup>
                </Card>
                </Col>
            </Row>
        </Container>
    );
}
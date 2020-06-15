import React, {useContext, useEffect, useState} from 'react';
import AuthenticationContext from "./AuthenticationContext.js";
import {Redirect} from "react-router-dom";
import {Jumbotron, ProgressBar, Table} from "react-bootstrap";
import API from '../api/API.js';
import DeleteIco from './img/eraser.svg';


function Rentals() {
    const value = useContext(AuthenticationContext);
    const [loadFuture, setLoadFuture] = useState(false);
    const [loadPast, setLoadPast] = useState(false);
    const [pastRentals, setPast] = useState([]);
    const [futureRentals, setFuture] = useState([]);
    useEffect(() => {
        API.getRentals(true).then(x => {
            setFuture(x);
            setLoadFuture(true);
        });
        API.getRentals(false).then(x => {
            setPast(x);
            setLoadPast(x);
        })
    }, [])
    if (!value.verifiedLogin || !(loadFuture && loadPast))
        return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
    if (!value.loggedIn)
        return <Redirect to={"/login"}/>;
    return <><RentalTable name="Your future rentals" future={true} rentals={futureRentals}/>
        <RentalTable name="Your past rentals" rentals={pastRentals}/></>;
}

function RentalTable(props) {
    return <> <Jumbotron className="jumbotron-space"><h4>{props.name}</h4></Jumbotron>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>#</th>
                <th>Period</th>
                <th>Category</th>
                <th className="d-none d-lg-table-cell">Driver age</th>
                <th className="d-none d-lg-table-cell">Extra drivers</th>
                <th className="d-none d-sm-table-cell"> km/day</th>
                <th className="d-none d-lg-table-cell">Insurance</th>
                <th>Payment</th>
                <th className="d-none d-sm-table-cell">Brand</th>
                <th className="d-none d-sm-table-cell">Model</th>
                {props.future ? <th/> : ""}
            </tr>
            </thead>
            <tbody>
            {props.rentals.map(x => {
                return <tr>
                    <td>{x.id}</td>
                    <td>{x.start.format("dd-MM-yyyy")+"- "+x.end.format("dd-MM-yyyy")}</td>
                    <td>{x.car.category}</td>
                    <td className="d-none d-lg-table-cell">{x.age}</td>
                    <td className="d-none d-lg-table-cell">{x.extra_drivers}</td>
                    <td className="d-none d-sm-table-cell">{x.kilometer}</td>
                    <td className="d-none d-lg-table-cell">{x.insurance}</td>
                    <td>{x.car.price}</td>
                    <td className="d-none d-sm-table-cell">{x.car.brand}</td>
                    <td className="d-none d-sm-table-cell">{x.car.model}</td>
                    {props.future ? <td><img height={20} src={DeleteIco}/></td> : ""}
                </tr>
            })}
            </tbody>
        </Table>
    </>;
}

export default Rentals;

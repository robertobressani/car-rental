import React, {useContext, useEffect, useState} from 'react';
import AuthenticationContext from "./AuthenticationContext.js";
import {Redirect, Link} from "react-router-dom";
import {Jumbotron, ProgressBar, Table, Alert} from "react-bootstrap";
import API from '../api/API.js';
import DisabledDeleteIco from './img/empty_cancel.svg'
import DeleteIco from './img/eraser.svg';
import YesLogo from './img/tick.svg';
import Spinner from "react-bootstrap/Spinner";
import {dateDiff, dateFormat} from "../utils/dateUtils";
import moment from "moment";
import {getEuro} from "../utils/currency";

//TODO try to add sorting in table

function Rentals(props) {
	const value = useContext(AuthenticationContext);
	const [loadFuture, setLoadFuture] = useState(false);
	const [loadPast, setLoadPast] = useState(false);
	const [pastRentals, setPast] = useState([]);
	const [futureRentals, setFuture] = useState([]);
	const [loading, setLoading] = useState([]);
	const [error, setError] = useState(false);

	function deleteR(x) {
		setLoading([...loading, x]);
		API.deleteRental(x).then((res)=>{
			if(res)
				setFuture([...futureRentals].filter(rental=>rental.id!==x));
			else
				setError(`Impossible to delete car rental number ${x}`);
		}).catch((err)=>{
			if(err===401)
				props.unLog();
			else
				//should not come hear, unless network error
				setError(`Impossible to delete car rental number ${x}`);
		}).finally(()=>
			//removing infinite looping (if network error) spinner
			setLoading([...loading].filter(load=>load!==x)));
	}

	useEffect(() => {
		Promise.all([API.getRentals(true), API.getRentals(false)]).then(result=>{
			setPast(result[0]);
			setFuture(result[1]);

		}).catch((err)=>{
			if(err===401)
				props.unLog();
			else
				//should not come hear, unless network error
				setError(`Impossible to load  rentals`);
		}).finally(()=> {
			setLoadFuture(true);
			setLoadPast(true);
		});
	}, [])
	if (!value.verifiedLogin || !(loadFuture && loadPast))
		return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
	if (!value.loggedIn)
		return <Redirect to={"/login"}/>;
	if(!futureRentals.length && !pastRentals.length)
		return  <Alert variant="light">
			<h2>You have not performed any rental.</h2>
			<Link to={"/configurator/"}>Click here to rent a car</Link>
		</Alert>
	return <>
		<Alert show={!!error} variant="danger" className="jumbotron-space" dismissible onClose={() => setError(false)}>
			<Alert.Heading>An error occurred</Alert.Heading>
			<p>{error}</p>
		</Alert>
		<RentalTable name="Your future and current rentals:" future={true} delete={x=>deleteR(x)} rentals={futureRentals} loading={loading}/>
		<RentalTable name="Your past rentals:" rentals={pastRentals}/></>;
}



function RentalTable(props) {
	if(!props.rentals.length)
		return <></>;
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
				{props.future ? <th/> : null}
			</tr>
			</thead>
			<tbody>
			{props.rentals.map(x => {
				return <tr key={x.id}>
					<td>{x.id}</td>
					<td>{"From "+dateFormat(x.start)+" to "+dateFormat(x.end)}</td>
					<td>{x.car.category}</td>
					<td className="d-none d-lg-table-cell">{x.age}</td>
					<td className="d-none d-lg-table-cell">{x.extra_drivers}</td>
					<td className="d-none d-sm-table-cell">{x.unlimited? "Unlimited" : x.kilometer}</td>
					<td className="d-none d-lg-table-cell">{x.insurance ?
						<img alt="insurance-present" height={20} src={YesLogo}/>: null }</td>
					<td>{getEuro(x.car.price)}</td>
					<td className="d-none d-sm-table-cell">{x.car.brand}</td>
					<td className="d-none d-sm-table-cell">{x.car.model}</td>
					{props.future ?
						<td>{
							dateDiff(x.start, moment())>0 ?
								(props.loading.includes(x.id) ?
									<Spinner animation="border" size="sm" /> :
										<img alt="delete" height={20} src={DeleteIco} onClick={()=>props.delete(x.id)}
											 data-toggle="tooltip" data-placement="top" title="Delete this rental"/>)
							: <img alt="impossible to delete" height={18} src={DisabledDeleteIco} data-toggle="tooltip"
								   data-placement="top" title="You cannot delete a rental that has already started"/>
						}</td> :null}
				</tr>
			})}
			</tbody>
		</Table>
	</>;
}

export default Rentals;

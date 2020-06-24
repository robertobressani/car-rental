import React, {useContext, useEffect, useState} from 'react';
import AuthenticationContext from "./AuthenticationContext.js";
import {Redirect} from "react-router-dom";
import {Jumbotron, ProgressBar, Table, Alert} from "react-bootstrap";
import API from '../api/API.js';
import DisabledDeleteIco from './img/empty_cancel.svg'
import DeleteIco from './img/eraser.svg';
import YesLogo from './img/tick.svg';
import Spinner from "react-bootstrap/Spinner";
import {dateDiff, dateFormat} from "../utils/dateDiff";
import moment from "moment";

//TODO try to add sorting in table

function Rentals() {
	const value = useContext(AuthenticationContext);
	const [loadFuture, setLoadFuture] = useState(false);
	const [loadPast, setLoadPast] = useState(false);
	const [pastRentals, setPast] = useState([]);
	const [futureRentals, setFuture] = useState([]);
	const [loading, setLoading] = useState([]);
	const [error, setError] = useState(false);

	function deleteR(x) {
		setLoading([...loading, x]);
		API.deleteRental(x).then(()=>{
			setFuture([...futureRentals].filter(rental=>rental.id!==x));
		}).catch(()=>setError(`Impossible to delete car rental number ${x}`))
			.finally(()=>setLoading([...loading].filter(load=>load!==x)));
	}

	useEffect(() => {
		API.getRentals(false).then(x => {
			setFuture(x);
			setLoadFuture(true);
		});
		//TODO add error handling
		API.getRentals(true).then(x => {
			setPast(x);
			setLoadPast(true);
		})
	}, [])
	if (!value.verifiedLogin || !(loadFuture && loadPast))
		return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
	if (!value.loggedIn)
		return <Redirect to={"/login"}/>;
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
					<td>{x.car.price.toFixed(2)} €</td>
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

import React, {useContext, useEffect, useState} from 'react';
import AuthenticationContext from "./AuthenticationContext.js";
import {Redirect, Link} from "react-router-dom";
import {Jumbotron, ProgressBar, Alert, Tooltip, OverlayTrigger} from "react-bootstrap";
import API from '../api/API.js';
import DisabledDeleteIco from './img/empty_cancel.svg'
import DeleteIco from './img/eraser.svg';
import YesLogo from './img/tick.svg';
import Spinner from "react-bootstrap/Spinner";
import {dateDiff, dateFormat} from "../utils/dateUtils";
import moment from "moment";
import {getEuro} from "../utils/currency";
import SmartTable from "./SmartTable";

//TODO remove all imports unused

function Rentals(props) {
	document.title="Rent.com - Your rentals";
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
				//although it is a dependency, it is constant, I didn't put it in the dependencies array
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
	const columns=[{
		dataField: 'id',
		text: 'ID',
		sort: true,
		headerStyle: { width: '40px' }
	}, {
		dataField: 'period',
		text: 'Period',
		sort: true,
		headerStyle: { width: '150px' }
	},{
		dataField: 'car.category',
		text: 'Category',
		sort: true,
		headerStyle: { width: '90px' }
	}, {
		dataField: 'age',
		text: 'Driver age',
		sort: true,
		headerClasses: "d-none d-lg-table-cell",
		classes: "d-none d-lg-table-cell"
	}, {
		dataField: 'extra_drivers',
		text: 'Additional drivers',
		sort: true,
		classes: "d-none d-lg-table-cell",
		headerClasses: "d-none d-lg-table-cell"
	},{
		dataField: 'km',
		text: 'km/day',
		sort: true,
		classes: "d-none d-lg-table-cell",
		headerClasses: "d-none d-lg-table-cell"
	},{
		dataField: 'insurance',
		text: 'Insurance',
		sort: true,
		classes: "d-none d-lg-table-cell",
		headerClasses: "d-none d-lg-table-cell",
		headerStyle: { width: '90px' }
	},{
		dataField: 'car.price',
		text: 'Payment',
		sort: true,
		formatter: getEuro,
		headerStyle: { width: '100px' }
	}, {
		dataField: 'car.brand',
		text: 'Brand',
		sort: true,
		classes: "d-none d-lg-table-cell",
		headerClasses: "d-none d-lg-table-cell"
	},{
		dataField: 'car.model',
		text: 'Model',
		sort: true,
		classes: "d-none d-lg-table-cell",
		headerClasses: "d-none d-lg-table-cell"
	}];
	let data= props.rentals.map(x=>{
		let res={...x}
		res.period="From "+dateFormat(x.start)+" to "+dateFormat(x.end);
		res.insurance=  x.insurance ?
				<img alt="insurance-present" height={20} src={YesLogo}/>: null;
		res.km=x.unlimited? "Unlimited" : ""+x.kilometer;
		return res;
	})
	if(props.future){
		columns.push({
			dataField: 'delete',
			text: '',
			headerStyle: { width: '40px' }
		});
		data = data.map(x=>{
			let res={...x};
			res.delete=dateDiff(x.start, moment())>0 ?
				(props.loading.includes(x.id) ?
					<Spinner animation="border" size="sm" /> :
						<OverlayTrigger overlay={<Tooltip id={`tooltip-delete-${x.id}`}>Delete this rental </Tooltip>}>
							<img alt="delete" height={20} src={DeleteIco} onClick={()=>props.delete(x.id)}/>
						</OverlayTrigger>)
								: <OverlayTrigger overlay={<Tooltip id={`tooltip-delete-${x.id}`}>
								You cannot delete a rental that has already started </Tooltip>}>
					<img alt="impossible to delete" height={18} src={DisabledDeleteIco}/>
				</OverlayTrigger>
			return res;
		});
	}
	return <> <Jumbotron className="jumbotron-space"><h4>{props.name}</h4></Jumbotron>
		<SmartTable  data={data} columns={columns} />
	</>;
}

export default Rentals;

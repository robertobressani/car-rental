import {getEuro} from "../utils/currency";
import {dateDiff, dateFormat} from "../utils/dateUtils";
import YesLogo from "./img/tick.svg";
import moment from "moment";
import Spinner from "react-bootstrap/Spinner";
import {Jumbotron, OverlayTrigger, Tooltip} from "react-bootstrap";
import DeleteIco from "./img/eraser.svg";
import DisabledDeleteIco from "./img/empty_cancel.svg";
import SmartTable from "./SmartTable";
import React from "react";

/**
 * Component that manages a table of rentals (current-future or past)
 */
function RentalTable(props) {
    if(!props.rentals.length)
        //nothing to show if the list of rentals is empty
        return <></>;

    //generating columns to interface with SmartTable
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
    //mapping rentals to be coherent with the table columns
    let data= props.rentals.map(x=>{
        let res={...x}
        res.period="From "+dateFormat(x.start)+" to "+dateFormat(x.end);
        res.insurance=  x.insurance ?
            <img alt="insurance-present" height={20} src={YesLogo}/>: null;
        res.km=x.unlimited? "Unlimited" : ""+x.kilometer;
        return res;
    })
    if(props.future){
        //showing future rentals
        //  a column should be added for delete rental
        columns.push({
            dataField: 'delete',
            text: '',
            headerStyle: { width: '40px' }
        });
        // adding also a button field in the data to be shown
        data = data.map(x=>{
            let res={...x};
            res.delete=dateDiff(x.start, moment())>0 ?
                ( //start data is in the future
                    props.loading.includes(x.id) ?
                        //the rental is being deleting
                    <Spinner animation="border" size="sm" /> :
                        //it is not being deleleting, it can be deleted
                    <OverlayTrigger overlay={<Tooltip id={`tooltip-delete-${x.id}`}>Delete this rental </Tooltip>}>
                        <img alt="delete" height={20} src={DeleteIco} onClick={()=>props.delete(x.id)}/>
                    </OverlayTrigger>)
                : //start date is in the past or today, it cannot be deleted
                <OverlayTrigger overlay={<Tooltip id={`tooltip-delete-${x.id}`}>
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

export default RentalTable;

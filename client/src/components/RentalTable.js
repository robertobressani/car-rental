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

export default RentalTable;

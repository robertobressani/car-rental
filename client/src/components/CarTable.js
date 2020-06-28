import React from "react";
import API from "../api/API";
import {getEuro} from "../utils/currency";
import {ProgressBar} from "react-bootstrap";
import SmartTable from "./SmartTable";

class CarTable extends  React.Component{
    constructor(props) {
        super(props);
        this.state={cars:[], loading:true};
    }
    componentDidMount() {
        API.getCars().then(x=>{this.setState(
            {cars:x, loading:false});
        }).catch(error=> this.props.setError(error.msg));
    }

    render(){
        const data=this.state.cars.filter(x=> (!this.props.brands.length ||this.props.brands.includes(x.brand))
            && (!this.props.categories.length || this.props.categories.includes(x.category)))
            .map(x=>{
                let res={...x};
                res.price=getEuro(x.price);
                return res;
            });

        const columns = [{
            dataField: 'id',
            text: 'ID',
            sort: true
        }, {
            dataField: 'brand',
            text: 'Brand',
            sort: true
        },{
            dataField: 'model',
            text: 'Model',
            sort: true
        }, {
            dataField: 'category',
            text: 'Category ',
            sort: true
        },{
            dataField: 'price',
            text: 'Minimum daily price',
            sort: true
        }];

        if(this.state.loading)
            return <ProgressBar animated now={100}/>;
        return <SmartTable data={data} columns={columns}/>
    }

}

export default CarTable;

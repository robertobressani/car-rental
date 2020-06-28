import React from "react";
import API from "../api/API";
import {getEuro} from "../utils/currency";
import {ProgressBar} from "react-bootstrap";
import SmartTable from "./SmartTable";

/**
 * Car Table shown in /cars page
 */
class CarTable extends  React.Component{
    constructor(props) {
        super(props);
        this.state={cars:[], loading:true};
    }

    /**
     * loads all the cars and brands
     */
    componentDidMount() {
        API.getCars().then(x=>{this.setState(
            {cars:x, loading:false});
        }).catch(error=> this.props.setError(error.msg));
    }

    render(){
        if(this.state.loading)
            return <ProgressBar animated now={100}/>;
        /**
         * contains the car to be shown (according to filters)
         * @type {Car[]}
         */
        const data=this.state.cars.filter(x=>
            //car brand is included or no filter for brand is selected
            (!this.props.brands.length ||this.props.brands.includes(x.brand))
            //car category is included or no filter for category is selected
            && (!this.props.categories.length || this.props.categories.includes(x.category)));

        // column configuration for SmartTable
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
            sort: true,
            formatter  : getEuro
        }];
        return <SmartTable data={data} columns={columns}/>
    }

}

export default CarTable;

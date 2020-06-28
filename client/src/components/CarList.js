import React from 'react';
import {Button, Row, Jumbotron, Nav, ProgressBar, Col, Alert} from 'react-bootstrap';
import API from "../api/API";
import {getEuro} from "../utils/currency";
import SmartTable from "./SmartTable";

class CarList extends React.Component {
    constructor() {
        super();
        document.title="Rent.com - Our cars"
        this.state = {
            loading: true,
            categories: ["A", "B", "C", "D", "E"],
            selectedCategories: [],
            brands: [],
            selectedBrands: [],
            error: false
        };
    }

    /**
     * when mounted, loads cars and brands from server
     */
    componentDidMount() {
       API.getBrands().then(result => this.setState({brands: result, loading: false}))
           .catch(error => this.setState({error: error.msg}));

    }

    render() {
        if(this.state.error)
            return <Alert  variant="danger" className="jumbotron-space" >
                <Alert.Heading>An error occurred</Alert.Heading>
                <p>{this.state.error}</p>
            </Alert>;
        return <><Jumbotron className="row jumbotron-space justify-content-between">
            <CarFilterBox name={"Select car category"} values={this.state.categories} loading={this.state.loading}
                          selected={this.state.selectedCategories} setter={this.setCategory}
                          setAll={this.setAllCategories} size={5}/>
            <CarFilterBox  name={"Select car brand"} values={this.state.brands} loading={this.state.loading}
                          selected={this.state.selectedBrands} setter={this.setBrand} setAll={this.setAllBrands} size={7}/>
        </Jumbotron><CarTable  setError={this.setError} categories={this.state.selectedCategories} brands={this.state.selectedBrands}/></>;

    }

    /**
     * Adds or removes the category from the selected group
     * @param cat category to change select state
     * @param val boolean value to add or remove
     */
    setCategory = (cat, val) => {
        if (val)
            this.setState((state) => {
                let selectedCategories = [...state.selectedCategories];
                selectedCategories.push(cat);
                return {selectedCategories};
            });
        else
            this.setState((state) => {
                let selectedCategories = state.selectedCategories.filter(x => x !== cat);
                return {selectedCategories};
            });
    }

    /**
     * Adds or removes the brand from the selected group
     * @param brand to change select state
     * @param val boolean value to add or remove
     */
    setBrand = (brand, val) => {
        if (val)
            this.setState((state) => {
                let selectedBrands = [...state.selectedBrands];
                selectedBrands.push(brand);
                return {selectedBrands};
            });
        else
            this.setState((state) => {
                let selectedBrands = state.selectedBrands.filter(x => x !== brand);
                return {selectedBrands};
            });
    }

    /**
     * Select or deselect all the categories
     * @param val boolean to select or deselect
     */
    setAllCategories = (val) => {
        if (val)
            this.setState((state) => {
                const selectedCategories = [...state.categories];
                return {selectedCategories}
            })
        else this.setState({selectedCategories: []})
    }

    /**
     * Select or deselect all the brands
     * @param val boolean to select or deselect
     */
    setAllBrands = (val) => {
        if (val)
            this.setState((state) => {
                const selectedBrands = [...state.brands];
                return {selectedBrands}
            })
        else this.setState({selectedBrands: []})
    }

    setError=(msg)=> this.setState({error:msg});


}

function CarFilterBox(props) {
    let content;
    if (props.values.size > 0 || !props.loading)
        content = props.values.sort().map(item =>
            <CarFilterItem key={item} name={item} selected={
                props.selected.includes(item)
            } setter={props.setter}/>
        );
    else
        content = <ProgressBar animated now={100}/>;
    return <Col md={props.size} xs={12}><h4>{props.name}
    </h4>
        <Row className="no-gutters">
        {content}
        </Row>
        <Nav className={"small-nav"}>
            <Nav.Item>
                <Nav.Link onClick={() => props.setAll(true)}>SELECT ALL</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={() => props.setAll(false)}>DESELECT ALL</Nav.Link>
            </Nav.Item>
        </Nav>
    </Col>;
}

function CarFilterItem(props) {
    return <Button  className="m-1" key={props.name} variant={props.selected ? "primary" : "secondary"}
                   onClick={() => props.setter(props.name, !props.selected)}
    >{props.name}</Button>
}

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

export default CarList;


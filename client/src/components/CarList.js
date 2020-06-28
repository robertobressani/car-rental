import React from 'react';
import {Jumbotron,  Alert} from 'react-bootstrap';
import API from "../api/API";
import CarFilterBox from "./CarFilters";
import CarTable from "./CarTable";


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

export default CarList;


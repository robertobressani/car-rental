import React from 'react';
import {Button, ButtonGroup, Jumbotron, Nav, ProgressBar, Col} from 'react-bootstrap';
import API from "../api/API";

class CarList extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            categories: ["A", "B", "C", "D", "E"],
            selectedCategories: ["B", "C"],
            brands: [],
            selectedBrands: [],
            cars: [],
        };
    }

    /**
     * when mounted, loads cars and brands from server
     */
    componentDidMount() {
        Promise.all([API.getCars(), API.getBrands()]).then(results =>
            this.setState({cars: results[0], brands: results[1], loading: false})
        ).catch(error => this.setState({error: error}));

    }

    render() {
        return <Jumbotron className="row jumbotron-space justify-content-between">
            <CarFilterBox name={"Select car category"} values={this.state.categories} loading={this.state.loading}
                          selected={this.state.selectedCategories} setter={this.setCategory}
                          setAll={this.setAllCategories} size={5}/>
            <CarFilterBox  name={"Select car brand"} values={this.state.brands} loading={this.state.loading}
                          selected={this.state.selectedBrands} setter={this.setBrand} setAll={this.setAllBrands} size={7}/>
        </Jumbotron>;
        //TODO add car table
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

}

function CarFilterBox(props) {
    let content;
    if (props.values.size > 0 || !props.loading)
        content = props.values.map(item =>
            <CarFilterItem key={item} name={item} selected={
                props.selected.includes(item)
            } setter={props.setter}/>
        );
    else
        content = <ProgressBar animated now={100}/>;
    return <Col md={props.size} xs={12}><h4>{props.name}
    </h4><ButtonGroup className="mb-2">
        {content/*TODO fix multiple buttons*/}

    </ButtonGroup>
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
    return <Button key={props.name} variant={props.selected ? "primary" : "secondary"}
                   onClick={() => props.setter(props.name, !props.selected)}
    >{props.name}</Button>
}

export default CarList;


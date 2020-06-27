import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
    PaginationTotalStandalone
} from "react-bootstrap-table2-paginator";
import {Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import React from "react";

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

function SmartTable(props){
    const options = {
        custom: true,
        totalSize: props.data.length,
        alwaysShowAllBtns: true, // Always show next and previous button
        withFirstAndLast: false, // Hide the going to First and Last page button
        hidePageListOnlyOnePage: true,
        page:1 // when re-rendering always go to the first page
    };
    return <PaginationProvider    pagination={ paginationFactory(options)}>
        {
            ({paginationProps, paginationTableProps }) => (
                <div className="space">
                    <Row className="justify-content-between ml-auto mr-auto">
                        <PaginationTotalStandalone   { ...paginationProps }/>
                        <PaginationListStandalone   { ...paginationProps }/>
                    </Row>
                    <BootstrapTable striped
                                    hover
                                    condensed keyField="id"  data={ props.data }  columns={ props.columns }
                                    { ...paginationTableProps }
                    />
                </div>
            )
        }
    </PaginationProvider>
}

export default SmartTable;

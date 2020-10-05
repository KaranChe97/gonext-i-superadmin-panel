import React, { Component } from "react";
import axios from 'axios';
import ApiUrl from '../config/apiUrl';
import { NavLink } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
//   NavLink,
  Button,
  FormInput,
  ListGroup,
  ListGroupItem,
  InputGroup,
  InputGroupAddon,
} from "shards-react";

import PageTitle from "../components/common/PageTitle";

import '../styles/category.css';

class Category extends Component{

    state = {
        categories: [],
        newCategory: '',
        editable: '',
        editValue: ''
    }

    
    componentDidMount(){
        this.getCategories();
    }

    onChangeAdd = (e) => {
        this.setState({ newCategory: e.target.value  })
    }

    editItem = (id,name) => {
        this.setState({
            editable: id,
            editValue: name
        })
    }

    cancelEdit = () => {
        this.setState({
            editValue: '',
            editable: ''
        })
    }

    handleChangeEdit = (e) => {
        this.setState({ editValue: e.target.value })
    }

    saveEdit = () => {
        if(!this.state.editValue) {
           return alert('Enter value');
        }
        const params = { tagId: this.state.editable };
        const urlParams = new URLSearchParams(params);
        axios.patch(`${ApiUrl.categories}?${urlParams}`, {
            name: this.state.editValue
        })
        .then(res => {
            if(res && res.data && res.data.status === 1) {
                this.setState({
                    editable: '',
                    editValue: '',
                    categories: res.data.data
                },this.getCategories)
            }
        })
    }

    deleteCategory = (tagId) => {
        const params = { tagId };
        const urlParams = new URLSearchParams(params);
        axios.delete(`${ApiUrl.categories}?${urlParams}`)
        .then((res) => {
            if(res && res.data && res.data.status === 1) {
                this.setState({
                    categories: res.data.data
                })
            }
        })
    }

    getCategories = async () => {
        axios.get(ApiUrl.categories)
        .then((response) => {
            if(response && response.data) {
                const { data } = response.data;
                this.setState({
                    categories: data
                })
            }
        })
        .catch(function(err){
            console.log(err);
        })
    }


    addNewCategory = async() => {
        if(!this.state.newCategory) {
            return alert('Enter category name');
        }
        axios.post(ApiUrl.categories, { name: this.state.newCategory })
        .then(res => {
            if(res && res.data) {
                if(res.data.status === 1) {
                    this.setState({
                        newCategory: '',
                        categories: res.data.data
                    })
                } else if(res.data.message) {
                    alert(res.data.message);
                }
            }
        })
        .catch(err => { 
            console.log(err);
         });
    }

    render(){
        const { categories, editable, editValue } = this.state;

        return (
            <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
              <PageTitle sm="4" title="Category" subtitle="Management" className="text-sm-left" />
            </Row>

            <Row>
            <Col>
            <ListGroup style={{ width: '300px', float: 'right', margin: '10px' }}>
                <ListGroupItem className="d-flex px-3">
                <InputGroup className="ml-auto">
                    <FormInput placeholder="New category" value={this.state.newCategory} onChange={this.onChangeAdd} />
                    <InputGroupAddon type="append">
                    <Button theme="white" className="px-2" onClick={this.addNewCategory}>
                        <i className="material-icons">add</i>
                    </Button>
                    </InputGroupAddon>
                </InputGroup>
                </ListGroupItem>
            </ListGroup>
            </Col>
            </Row>
            <Row>
                <Col>
                <Card small className="mb-4">
                <CardHeader className="border-bottom">
                    <h6 className="m-0">Tag Categories</h6>
                </CardHeader>
                <CardBody className="p-0 pb-3">
                    <table className="table mb-0">
                    <thead className="bg-light">
                        <tr>
                        <th scope="col" className="border-0">
                            #
                        </th>
                        <th scope="col" className="border-0">
                            Name
                        </th>
                       
                        <th scope="col" className="border-0">
                            Edit
                        </th>
                        <th scope="col" className="border-0">
                            Delete
                        </th>                     
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map((d,i) => d._id !== editable ? <tr key={d._id}> 
                                <td> {i+1} </td>
                                <td> {d.name} </td>
                                <td> <Button onClick={() => this.editItem(d._id, d.name)}> Edit </Button> </td>
                                <td> <Button theme="danger" onClick={() => this.deleteCategory(d._id)}> Delete </Button> </td>
                             </tr>
                             : <tr key={d._id}> 
                                <td> {i+1} </td>
                                <td> <input value={editValue} style={{ width: '100%' }} placeholder="Edit category name" onChange={this.handleChangeEdit} /> </td>
                                <td> <Button theme="info" onClick={this.saveEdit}> Save </Button> </td>
                                <td> <Button onClick={this.cancelEdit}> Cancel </Button> </td>
                             </tr>
                             ) 
                        }
                    </tbody>
                    </table>
                </CardBody>
                </Card>
            </Col>
            </Row>
            
            </Container>
        )
    }
}

export default Category;
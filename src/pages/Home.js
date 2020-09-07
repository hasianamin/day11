import React, { Component, createRef } from 'react';
import {Table, Modal, ModalBody, ModalFooter, ModalHeader, Button} from 'reactstrap'
import axios from 'axios'
import {MdAddCircleOutline, MdDeleteForever, MdEdit} from 'react-icons/md'
import { BsFillCaretRightFill } from "react-icons/bs";
import Swal from 'sweetalert2'
import {Link} from 'react-router-dom'

class Home extends Component {
    state = {
        datapost: [],
        isModalOpen: false,
        inputauthor: createRef(),
        inputtitle: createRef(),
        editForm: {
            editAuthorRef: createRef(),
            editTitleRef: createRef(),
            editAuthor: '',
            editTitle: '',
            editId: ''
        }
    }

    componentDidMount(){
        axios.get('http://localhost:4000/posts')
        .then((res) => {
            this.state.inputauthor.current.focus()
            this.setState({datapost: res.data})
        }).catch((err) => {
            console.log(err)
        })
    }

    renderPost = () => {
        return this.state.datapost.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.author}</td>
                    <td>{val.title}</td>
                    <td>
                        <button className="btn btn-danger mr-2" onClick={()=> {this.DeletePostid(val.id, index)}}><MdDeleteForever/></button>
                        <button className="btn btn-secondary mr-2" onClick={()=> {this.EditPatchid(val.id, index)}}><MdEdit/></button>
                        <Link to={`/comments/${val.id}`}>
                            <button className="btn btn-primary"><BsFillCaretRightFill/></button>
                        </Link>
                    </td>
                </tr>
            )
        })
    }

    addPostClick = () => {
        var author = this.state.inputauthor.current.value
        var title = this.state.inputtitle.current.value
        axios.post('http://localhost:4000/posts',{
            author,
            title: title
        }).then (() => {
            axios.get('http://localhost:4000/posts')
            .then((res1) => {
                var authorref=this.state.inputauthor
                authorref.current.value=''
                var titleref=this.state.inputtitle
                titleref.current.value=''
                this.state.inputauthor.current.focus()
                this.setState({datapost:res1.data})
            }).catch((err) => {
                console.log(err)
            })
        }).catch ((err) => {
            console.log(err)
        })
    }

    onKeyuphandler = (e) => {
        if(e.keyCode === 13){
            this.state.inputtitle.current.focus()
        }
    }

    onKeyupTitle = (e) => {
        if(e.keyCode === 13){
            this.addPostClick()
        }
    }

    DeletePostid = (id, index) => {
        Swal.fire({
            title: `Are you sure you want to delete ${this.state.datapost[index].author}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                axios.delete(`http://localhost:4000/posts/${id}`)
                .then(() => {
                    axios.get('http://localhost:4000/posts')
                    .then((res) => {
                        this.setState({datapost:res.data})
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }

    EditPatchid = (id) => {
        this.setState({isModalOpen: !this.state.isModalOpen})
        axios.get(`http://localhost:4000/posts?id=${id}`)
        .then((res) => {
            var editFormValue = this.state.editform
            this.setState({...editFormValue, editAuthor: res.data[0].author, editTitle: res.data[0].title, editId: res.data[0].id})
        }).catch((err) => {
            console.log(err)
        })
    }

    confirmEdit = (id) => {
        var {editAuthorRef,editTitleRef}=this.state.editForm
        var editAuthor = editAuthorRef.current.value
        var editTitle = editTitleRef.current.value
        axios.patch(`http://localhost:4000/posts/${id}`,{
            author: editAuthor, title: editTitle
        })
        .then((res) => {
            this.setState({isModalOpen: !this.state.isModalOpen})
            axios.get('http://localhost:4000/posts')
            .then((res2) => {
                this.setState({datapost: res2.data})
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    toggle = () => this.setState({isModalOpen:!this.state.isModalOpen})

    closeModal= () => {
        this.toggle()
        var editFormValue = this.state.editform
        this.setState({...editFormValue, editAuthor: '', editTitle: ''})
    }

    render(){
        const {toggle, state} = this
        const {isModalOpen} = state
        return(
            <div className="container mt-5">
                <div className="mb-3">
                <input type='text' ref={this.state.inputauthor} onKeyUp={this.onKeyuphandler} className='form-control mb-3' placeholder='author'/>
                    <input type='text' ref={this.state.inputtitle} onKeyUp={this.onKeyupTitle} className='form-control mb-3' placeholder='title'/>
                    <button onClick={this.addPostClick} className='btn btn-outline-primary mb-3' style={{width:'60%'}}>
                        <MdAddCircleOutline style={{fontSize:'22'}}/> Add 
                    </button>
                </div>
                <Table striped>
                    <thead>
                        <tr>
                        <th>No</th>
                        <th>Author</th>
                        <th>Title</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPost()}
                    </tbody>
                </Table>
                <Modal isOpen={isModalOpen} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Edit data</ModalHeader>
                    <ModalBody>
                    <div><input className='form-control mb-2' ref={this.state.editForm.editAuthorRef} defaultValue={state.editAuthor}/></div>
                    <div><input className='form-control' ref={this.state.editForm.editTitleRef} defaultValue={state.editTitle}/></div>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={() => {this.confirmEdit(state.editId)}}>Save</Button>
                    <Button color="secondary" onClick={() => {this.closeModal()}}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Home
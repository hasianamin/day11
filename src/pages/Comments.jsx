import React, { Component, createRef } from 'react';
import {CardBody, Card, CardText, Button, FormGroup} from 'reactstrap'
import Axios from 'axios';
import { Link } from 'react-router-dom'


class Comments extends Component {
    state = { 
        comment: [],
        inputComment: createRef()
    }

    componentDidMount(){
        Axios.get(`http://localhost:4000/comments?postId=${this.props.match.params.id}`)
        .then((res) => {
            this.setState({comment: res.data})
        }).catch((err) => {
            console.log(err)
        })
    }

    renderComments(){
        if(!this.state.comment.length){
            return (
                <CardText>Belum ada komentar</CardText>
            )
        } else {
            return this.state.comment.map((value) => {
                return (
                    <CardText>{value.body}</CardText>
                )
            })
        }
    }

    submitComment = () => {
        var cmn = this.state.inputComment.current.value
        console.log(cmn)
        Axios.post('http://localhost:4000/comments',{
            body: this.state.inputComment.current.value,
            postId: this.props.match.params.id
        }).then(() => {
            Axios.get(`http://localhost:4000/comments?postId=${this.props.match.params.id}`)
            .then((res1) => {
                var cmnRef = this.state.inputComment
                cmnRef.current.value = ''
                this.setState({comment:res1.data})
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    render() { 
        return (
            <div className='container'>
                <Card className='mt-5 text-left'>
                    <CardBody>
                        {this.renderComments()}
                    </CardBody>
                </Card>
                <FormGroup className='mt-5 text-left'>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Beri Komentar:</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" ref={this.state.inputComment}></textarea>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <Button color="primary" onClick={this.submitComment}>Submit</Button>
                        <Link to='/' className='d-flex justify-content-end'>
                            <Button>Back to Home</Button>
                        </Link>
                    </div>
                </FormGroup>
            </div>
          );
    }
}
 
export default Comments;
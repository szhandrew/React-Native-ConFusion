import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Alert } from 'react-native';
import { Card, Icon, Input,Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
        
    );
}

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                    <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{justiftyContent:"center", alignItems:"center"}}>
                            <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                            <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.onPressComment()}
                            />
                        </View>
                    </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}


class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: '',
            author: '',
            comment: ''
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };


    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    writeComments() {
        this.toggleModal();
    }

    handleComment(dishId) {
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment),
        this.toggleModal(),
        alert('Your comments has been submitted!!');
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressComment={() => this.writeComments()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <View>
                            <Rating 
                            showRating
                            type="star"
                            startingValue = { 0 }
                            onFinishRating={rating => this.setState({ rating: rating})}
                            />
                        </View>
                        
                        <View style={ styles.modalText }>
                            <Input
                                placeholder=" Author"
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                onChangeText={author => this.setState({ author: author})}
                            />
                        </View>
                        
                        <View style={ styles.modalText }>
                            <Input
                                placeholder=" Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                onChangeText={comment => this.setState({ comment: comment})}
                            />
                        </View>
                        
                        <View style={ styles.modalText }>
                            <Button 
                                onPress = {() =>{this.handleComment(dishId);}}
                                color="#512DA8"
                                title="Submit" 
                            />
                        </View>
                        
                        <View style={ styles.modalText }>
                            <Button
                                onPress = {() =>{this.toggleModal();}}
                                color="#a9a9a9"
                                title="Cancel" 
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    modalText: {
      fontSize: 18,
      margin: 15,
    },
    modal: {
      justifyContent: 'center',
      margin: 20,
    }
  })

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
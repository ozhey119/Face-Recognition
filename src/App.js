import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn';
import Register from './components/register/Register';
import './App.css';

const particlesOptions = {
    particles: {
        number: {
            value: 150,
            density: {
                enable: true,
                value_area: 1500
            }
        }
    }
}

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: new Date()
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries: 0,
                joined: new Date()
            }
        }
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        });
    }

    calculateFaceLocation = (data) => {
        const face = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: face.left_col * width,
            topRow: face.top_row * height,
            rightCol: width - (face.right_col * width),
            bottomRow: height - (face.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({ box: box });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input }, () => {
            fetch('https://peaceful-temple-52286.herokuapp.com/imageurl', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: this.state.input
                })
            })
                .then(response => response.json())
                .then(response => {
                    if (response) {
                        fetch('https://peaceful-temple-52286.herokuapp.com/image', {
                            method: 'put',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: this.state.user.id
                            })
                        })
                            .then(response => response.json())
                            .then(count => {
                                this.setState(Object.assign(this.state.user, { entries: count }));
                            })
                            .catch(err => console.log(err));

                    }
                    return this.displayFaceBox(this.calculateFaceLocation(response));
                }).catch(err => {
                    console.log(`error: ${this.state.input}error: ${err}`);
                })
        }
        );
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState);
        } else if (route === 'home') {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });

    }

    render() {
        const { isSignedIn, imageUrl, route, box, user } = this.state;
        return (
            <div className="App">
                <Particles className='particles'
                    params={particlesOptions} />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
                {(route === 'home')
                    ? <div>
                        <Logo />
                        <Rank name={user.name} entries={user.entries} />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit} />
                        <FaceRecognition box={box} imageUrl={imageUrl} />
                    </div>
                    : (route === 'signin')
                        ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                }
            </div>
        );
    }
}

export default App;

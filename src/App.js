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
    faceUrl : '',
    box: [{}],
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
            faceUrl: '',
            box: [{}],
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

    calculateFaceLocation = (data, index) => {
        const face = data.outputs[0].data.regions[index].region_info.bounding_box;
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

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onFaceChange = (event) => {
        this.setState({ faceUrl: event.target.value });
    }

    onImageSubmit = () => {
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
                    let i = 0;
                    let facesArr = response.outputs[0].data.regions.map(() => {
                        return this.calculateFaceLocation(response, i++)
                    })
                    return this.setState({ box: facesArr });
                }).catch(err => {
                    console.log(`input: ${this.state.input} error: ${err}`);
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
        const { isSignedIn, imageUrl, route, box, user, faceUrl } = this.state;
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
                            onFaceChange = {this.onFaceChange}
                            onImageSubmit={this.onImageSubmit} />
                        <div>
                            <FaceRecognition box={box} imageUrl={imageUrl} faceUrl = {faceUrl} />
                        </div>
                    </div>
                    : (route !== 'register')
                        ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                }
            </div>
        );
    }
}

export default App;

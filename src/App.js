import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn';
import Register from './components/register/Register';
import './App.css';

const app = new Clarifai.App({
    apiKey: '590f8cbbb2a546d49403430c924652ac'
});

const particlesOptions = {
    particles: {
        number: {
            value: 400,
            density: {
                enable: true,
                value_area: 1800
            }
        }
    }
}

class App extends Component {
    constructor () {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
        }
    }

    calculateFaceLocation = (data) => {
        const face = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(data.outputs[0].data.regions);
        return {
            leftCol: face.left_col * width,
            topRow: face.top_row * height,
            rightCol: width - (face.right_col * width),
            bottomRow: height - (face.bottom_row * height)
        }
    }

    displayFaceBox= (box) => {
        this.setState({box: box});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }
   
    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input}, () => {
            app.models.predict(
                'a403429f2ddf4b49b307e318f00e528b',
                this.state.input)
            .then( response => {
                return this.displayFaceBox(this.calculateFaceLocation(response));
            }).catch( err => {
                console.log(`error: ${this.state.input}error: ${err}`);
            })
            }
        ); 
    }

    onRouteChange = (route) => {
        if (route === 'signout' ) {
            this.setState({isSignedIn: false});
        } else if (route === 'home' ) {
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});

    }

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state;
        return (
            <div className="App">
                <Particles className = 'particles'
                params = {particlesOptions} />
                <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />
                {  (route === 'home')
                   ? <div>
                   <Logo />
                   <Rank />
                   <ImageLinkForm
                   onInputChange={this.onInputChange} 
                   onButtonSubmit = {this.onButtonSubmit}/>
                   <FaceRecognition box = {box} imageUrl = {imageUrl}/>
                   </div>
                   : (route === 'signin')
                   ? <SignIn onRouteChange = {this.onRouteChange}/> 
                   : <Register onRouteChange = {this.onRouteChange}/>
                }
            </div>
        );
    }
}

export default App;

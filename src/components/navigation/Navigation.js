import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) => {
        if (isSignedIn) {
            return (
            <nav style = {{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick=  {() => onRouteChange('signout')} className="b w4 h2 pt2 ma1 ba br2 bg-transparent dim pointer f6 dib">Sign Out</p>
            </nav>
            );
        } else {
            return (
            <nav style = {{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick=  {() => onRouteChange('signin')} className="b w4 h2 pt2 ma1 ba br2 bg-transparent dim pointer f6 dib" >Sign in</p>
                <p onClick=  {() => onRouteChange('register')} className="b w4 h2 pt2 ma1 ba br2 bg-transparent dim pointer f6 dib">Register</p>
            </nav>
            );
        }
}

export default Navigation;
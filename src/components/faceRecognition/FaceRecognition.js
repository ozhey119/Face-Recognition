import React from 'react';
import './FaceRecognition.css';




const FaceRecognition = ({ box, imageUrl }) => {
    return (
          
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' alt='' src={imageUrl} width='500px' height='auto' />
                <div>
                    {box.map((face, index) =>
                        <div
                            key={index++}
                            className='bounding-box'
                            style={{ top: face.topRow, right: face.rightCol, bottom: face.bottomRow, left: face.leftCol }}
                        >
                        <img id='face' alt='' src={'https://i.imgur.com/6GZIeKl.png'}/>   
                        </div>)}
                </div>
            </div>
        </div>
    );
}

export default FaceRecognition;
import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onImageSubmit, onFaceChange }) => {
    return (
        <div>
            <p className='f3 pb1 ma0'> {`Enter an image's url. The brain will detect any face that appears.`} </p>
            <p className='f3 pb1 ma0'> {`if you wish, you can enter an image that will mask all of the faces`} </p>
            <div className = 'form center pa1 shadow-5 w-60 br3 br--top'>
            <input
                placeholder='enter a face image url'
                className='f4 pa2 w-90 center' type='text'
                onChange={onFaceChange} />
            </div>
            <div className='center'>
                <div className='form center pa3 br3 shadow-5'>
                    <input
                        className='f4 pa2 w-70 center' type='text'
                        onChange={onInputChange} />
                    <button
                        className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                        onClick={onImageSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;
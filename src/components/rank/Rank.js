import React from 'react';

const Rank = ({name, entries}) => {
    return (
        <React.Fragment>
            <div className = 'white f3'>
                {`${name}, you have uploaded ${entries} images!`}
            </div>
        </React.Fragment>
    );
}

export default Rank;
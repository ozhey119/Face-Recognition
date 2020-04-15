import React from 'react';

const Rank = ({name, entries}) => {
    return (
        <React.Fragment>
            <div className = 'white f3'>
                {`${name}, your upload count is:`}
                <div className = 'white f1'> {entries} </div>
            </div>
        </React.Fragment>
    );
}

export default Rank;
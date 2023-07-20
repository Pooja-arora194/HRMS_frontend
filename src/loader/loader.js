
import React from "react";


const Loader = ({ value }) => {
    return (
        <>
            {value ?
                <div className="loading">
                    <div></div>
                </div>
                :
                ''
            }
        </>
    );
};

export default Loader;

import React from 'react';
import DOMPurify from 'dompurify';
const RTE = (props) => {
    return (
        <>
            {
                props.text && <div
                    className="textEditor"
                    data-rte-editelement
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(props.text)
                    }}
                />
            }
        </>
    )
}
export default RTE;
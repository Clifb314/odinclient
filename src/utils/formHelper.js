import React from "react";


export default function FormHelper({field, label, value, change}) {


    let type
    if (field === 'date') type = 'date'
    else if (field === 'password' || field === 'checkPW' || field === 'oldPW') type = 'password'
    else type = 'text'




    return (
        <label htmlFor={field}>{label}{': '}
            <input
              type={type}
              id={field}
              name={field}
              value={value}
              onChange={change}
              />
        </label>
    )
}
export default function Form ({formFields}) {
    return (
        <div>
            {formFields.map(formItem => 
                <input 
                    value={formItem?.value}
                    key={formItem?.name}
                    type={formItem?.type}
                    onChange={formItem?.onChange}
                    placeholder={formItem?.placeholder}
                />
            )}
        </div>
    )
}
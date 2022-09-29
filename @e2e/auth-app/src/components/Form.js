import { useState, cloneElement } from '@msinnes/dom';

const FormWrapper = ({ children, name, label, value, required, submitted, error }) => (
  <div className="form-group">
    <label for={name}>{label}</label>
    {children}
    {required && submitted && !value ?
      <div className="invalid-feedback">{label} is required</div>
    : null}
    {error ? <div className="invalid-feedback">{error}</div> : null}
  </div>
);

const Input = ({ type, name, label, value, oninput, required, submitted, error }) => (
  <FormWrapper
    name={name}
    label={label}
    value={value}
    required={required}
    submitted={submitted}
    error={error}
  >
    <input
      type={type}
      name={name}
      value={value}
      oninput={oninput}
      className={'form-control' + ((required && submitted && !value) || error ? ' is-invalid' : '')}
    />
  </FormWrapper>
);

const Form = ({
  children,
  title,
  initialValues,
  defaultValues,
  onSubmit,
  loading = false,
  ctaDestination,
  ctaText,
  submitText = 'Submit',
  errors = {},
}) => {
  const [input, setInput] = useState(initialValues || defaultValues);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit(input);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  }

  return (
    <div className="col-lg-4 offset-lg-4">
      {title ? <h2>{title}</h2> : null}
      <form onsubmit={handleSubmit}>
        {children.map(child => cloneElement(child, {
          value: input[child.props.name],
          submitted: submitted,
          error: errors[child.props.name],
          oninput: handleChange,
        }))}
        <div className="form-group">
          <button className="btn btn-primary">
            {loading ? <span className="spinner-border spinner-border-sm mr-1"></span> : null}
            {submitText}
          </button>
          {ctaDestination ? <Link to={ctaDestination} className="btn btn-link">{ctaText || 'Go'}</Link> : null}
        </div>
      </form>
    </div>
  );
}

export { Form, Input };
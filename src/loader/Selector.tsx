import fixtures from "../Fixtures";

const Selector = ({ onSubmitUrl }) => {

    return (
      <div>
        <ul>
          {fixtures.map((fixture, index) => (
            <li key={index}>
              <button onClick={() => onSubmitUrl(fixture)}>{fixture}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default Selector

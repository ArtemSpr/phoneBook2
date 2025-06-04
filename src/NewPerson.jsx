import { useState } from "react";

const NewPerson = (props) => {
  const [visible, setVisible] = useState(false);
  const [visibleChange, setVisibleChange] = useState(false);
  const exists = props.didExists;
  console.log("Exists:", exists);

  // Determine whether to show add or change message
  const didChange = () => {
    if (exists) {
      showChangeMessage();
      console.log("User already exists, showing change notification");
    } else {
      showMessage();
      console.log("User does not exist, showing add notification");
    }
  };

  // Show notification when a new user is added
  const showMessage = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  // Show notification when a user's number is changed
  const showChangeMessage = () => {
    setVisibleChange(true);
    setTimeout(() => setVisibleChange(false), 3000);
  };

  return (
    <form onSubmit={props.addPerson}>
      <div className="inputBlock">
        <div className="inputItem">
          <h2>Name</h2>
          <input
            value={props.newName}
            onChange={props.handleNameChange}
            placeholder="Enter your name..."
          />
        </div>
        <div className="inputItem">
          <h2>Number</h2>
          <input
            value={props.newNumber}
            onChange={props.handleNumberChange}
            placeholder="Enter your number  ..."
          />
        </div>
      </div>
      <div className="addPersonBtn">
        <button type="submit" onClick={didChange}>
          Add
        </button>
        {visible && <div className="message">New user was added</div>}
        {visibleChange && (
          <div className="changeMessage">User number was changed</div>
        )}
      </div>
    </form>
  );
};

export default NewPerson;

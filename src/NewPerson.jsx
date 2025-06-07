import { set } from "mongoose";
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

  const nameChecker = (newName) => {
    if (newName.length < 3) {
      alert("Name must be at least 3 characters long");
      setVisible(false);
      return false;
    }
    return true;
  };

  const numberChecker = (newNumber) => {
    if (newNumber.length <= 8 || newNumber.length >= 15) {
      alert("Number must be between 8 and 15 characters long");
      setVisible(false);
      return false;
    } else {
      if (newNumber.includes("-")) {
        const target = "-";
        let targetCount = 0;

        for (const char of newNumber) {
          if (char === target) {
            targetCount++;
          }
        }

        if (targetCount > 1) {
          alert("Number can contain only one dash");
          setVisible(false);
          return false;
        }

        const dashPos = newNumber.indexOf("-");
        if (dashPos === 2 || dashPos === 3) {
          return true;
        } else {
          alert("Number must be in the format XX-XXXXXXX or XXX-XXXXXXX");
          setVisible(false);
          return false;
        }
      } else {
        alert("Number must be in the format XX-XXXXXXX or XXX-XXXXXXX");
        setVisible(false);
        return false;
      }
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (!nameChecker(props.newName) || !numberChecker(props.newNumber)) {
          setVisible(false);
          return;
        }

        props.addPerson(event);
      }}
    >
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

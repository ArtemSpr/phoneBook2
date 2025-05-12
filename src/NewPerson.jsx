import { useState } from "react";

const NewPerson = (props) => {
  const [visible, setVisible] = useState(false);
  const [visibleChange, setVisibleChange] = useState(false);
  const exists = props.didExists;

  const didChange = () => {
    console.log(
      "Перевірка чи такий користувач вже існує в базі даних " + props.didExists
    );
    if (exists) {
      return showChangeMessage(), console.log("Повідомлення про зміну номера");
    } else {
      return (
        showMessage(), console.log("Повідомлення про додавання користувача")
      );
    }
  };

  const showMessage = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  //* Show notification when user change number
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

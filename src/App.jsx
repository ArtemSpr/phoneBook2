import React, { useState, useEffect } from "react";
import axios from "axios";
import dotenv from "dotenv";

// dotenv.config();
const baseUrl = "/api/persons";
console.log("BASE URL:", baseUrl);

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const addPerson = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((response) => response);
};

const deletePerson = (id) => {
  console.log(id);
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(() => id);
};

import Filter from "./Filter";
import NewPerson from "./NewPerson";
import CardItem from "./CardItem";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameFilter, setFilterName] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [confirmChanges, setConfirmChanges] = useState(false);

  const showDeleteMessage = () => {
    setVisibleDelete(true);
    setTimeout(() => setVisibleDelete(false), 3000);
  };

  const personsGet = () => {
    getAll().then((data) => {
      console.log("Data was collected", data);
      console.log("Data amount: ", data.length);
      console.log("Data amount: ", 2);
      setPersons(data.persons);
    });
  };

  useEffect(personsGet(), []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterNameChange = (event) => setFilterName(event.target.value);

  const addPersonFunc = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const userConfirmed = window.confirm(
        `${newName} is already in the phonebook. Replace the old number with a new one?`
      );
      setConfirmChanges(userConfirmed);

      if (userConfirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        addPerson(updatedPerson)
          .then((response) => {
            console.log("User was updated");
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response.data
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Error with number changing :", error);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      addPerson(newPerson).then((response) => {
        console.log("Нового користувача додано");
        setPersons([...persons, response.data]);
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const deletePersonFunc = (id, name) => {
    const result = window.confirm("Delete " + name + " ?");

    if (result) {
      deletePerson(id)
        .then(() => {
          console.log(`User with id ${id} was deleted`);
          setPersons(persons.filter((person) => person.id !== id));
          showDeleteMessage();
        })
        .catch((error) => {
          console.error(`Error with deleting user with id: ${id}`, error);
        });
    }
  };

  return (
    <div>
      <header>
        <h3>Phonebook</h3>
      </header>

      <CardItem
        content={
          <Filter
            nameFilter={nameFilter}
            handleFilterNameChange={handleFilterNameChange}
          />
        }
        title="Filter"
      />

      <CardItem
        content={
          <NewPerson
            newName={newName}
            newNumber={newNumber}
            handleNameChange={handleNameChange}
            handleNumberChange={handleNumberChange}
            addPerson={addPersonFunc}
          />
        }
        title="Add a new person"
      />

      <h2>---------------------------------------------------</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <h2>Numbers:</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(persons) ? (
            persons
              .filter((person) =>
                person.name.toLowerCase().includes(nameFilter.toLowerCase())
              )
              .map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.number}</td>
                  <td>
                    <button
                      onClick={() => deletePersonFunc(person.id, person.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="3">Loading or no persons data</td>
            </tr>
          )}
        </tbody>
      </table>

      {visibleDelete && <div className="deleteMessage">User was deleted</div>}
    </div>
  );
};

export default App;

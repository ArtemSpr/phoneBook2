import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

// Fetch all persons from backend
const getAll = () => {
  return axios.get(baseUrl).then((response) => {
    console.log("Fetched all persons:", response.data);
    return response.data;
  });
};

// Create new person
const addPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson);
};

// Update existing person's number
const updatePerson = (id, updatedPerson) => {
  console.log(typeof id);

  return axios.put(`${baseUrl}/${id}`, updatedPerson);
};

// Delete person by ID
const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(() => {
    console.log(`Deleted person with id: ${id}`);
    return id;
  });
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

  // Show temporary message after deleting
  const showDeleteMessage = () => {
    setVisibleDelete(true);
    setTimeout(() => setVisibleDelete(false), 3000);
  };

  // Fetch persons list from API
  const personsGet = () => {
    getAll().then((data) => {
      setPersons(data);
    });
  };

  // Load persons when component mounts
  useEffect(() => {
    personsGet();
  }, []);

  // Optional debug logging for persons state updates
  useEffect(() => {
    console.log("Updated persons list:", persons);
  }, [persons]);

  // Handle input field changes
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterNameChange = (event) => setFilterName(event.target.value);

  // Handle form submission
  const addPersonFunc = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) =>
        person.name &&
        newName &&
        person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const userConfirmed = window.confirm(
        `${newName} is already in the phonebook. Replace the old number with a new one?`
      );
      setConfirmChanges(userConfirmed);

      if (userConfirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        updatePerson(existingPerson.id, updatedPerson)
          .then((response) => {
            console.log("User number updated:", response.data);
            setPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id !== existingPerson.id ? person : response.data
              )
            );
            setNewName("");
            setNewNumber("");
            personsGet();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      addPerson(newPerson)
        .then((response) => {
          console.log("Added new user:", response.data);
          setPersons((prevPersons) => [...prevPersons, response.data]);
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    }
  };

  // Delete person with confirmation
  const deletePersonFunc = (id, name) => {
    const result = window.confirm("Delete " + name + " ?");

    if (result) {
      deletePerson(id)
        .then(() => {
          showDeleteMessage();
          personsGet();
        })
        .catch((error) => {
          console.error(`Error deleting user with id ${id}:`, error);
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
            // didExists={persons.some(
            //   (p) => p.name.toLowerCase() === newName.toLowerCase(),
            //   console.log(newName)
            // )}
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
              .filter(
                (person) =>
                  person.name &&
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

import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";

import { TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi('f9187792389f8e0b7b0711f925071423ae2181e2')

const BACKEND_URL = "https://api.todoist.com/rest/v1/tasks";
const COMPLETED_URL = "https://api.todoist.com/sync/v8/completed/get_all";

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [itemsCompleted, setItemsCompleted] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    axios.post(`${BACKEND_URL}`, {
      content: itemToAdd,
    },{
      headers: {
        Authorization: "Bearer f9187792389f8e0b7b0711f925071423ae2181e2",
      }, 
    }, ).then((response) => {
        setItems([ ...items, response.data])
    })
    setItemToAdd("");

  };


  const toggleItemDone = ({ id, completed }) => {
      axios.post(`${BACKEND_URL}/${id}/close`,{
        completed : !completed,
    },{
        headers:{
          Authorization: "Bearer f9187792389f8e0b7b0711f925071423ae2181e2"
        },
      }).then((response) => {
        const newItems = items.filter((item) => {
            return id !== item.id
      })
          setItems(newItems)
      })
  };

  const toggleItemReopen = ({ id, completed }) => {
    console.log("coming soon!")

};
  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`${BACKEND_URL}/${id}`,{
        headers:{
          Authorization: "Bearer f9187792389f8e0b7b0711f925071423ae2181e2"
        },
      }).then((response) => {
          const deletedItem = response.data;
          console.log('Было:',items)
          const newItems = items.filter((item) => {
              return deletedItem.id !== item.id
          })
          console.log('Осталось:',newItems)
          setItems(newItems)
      })
  };

  axios.get(`${COMPLETED_URL}`, {
    headers: {
      Authorization: "Bearer f9187792389f8e0b7b0711f925071423ae2181e2",
    }, 
  })
  .then((response) => setItemsCompleted(response.data.items)
  );

  useEffect(() => {
      axios.get(`${BACKEND_URL}`,{
        headers:{
          Authorization: "Bearer f9187792389f8e0b7b0711f925071423ae2181e2"
        }
      }).then((response) => {
          setItems(response.data);
      })
  }, [searchValue])



  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
      <ul className="list-group todo-list">
      <div>
        <h3>Completed Tasks</h3>
        <br></br>
      </div>
      
        {itemsCompleted.length > 0 ? (
          itemsCompleted.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.completed ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemReopen(item)}>
                  {item.content}
                </span>
              </span>
            </li>
          ))
        ) : (
          <div>No completed todos</div>
        )}
      </ul>
      </div>
  );
    
}

export default App;

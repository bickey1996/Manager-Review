import React, { useState, useEffect } from "react";
import { getData } from "../services/fetchApiCaller";
import "./MainPage.css";
const MainPage = () => {
  const [index, setIndex] = useState(null);
  const [topic, setTopic] = useState(null);
  const [sortedDefinations, setSortedDefinations] = useState({});
  const [sortedData, setSortedData] = useState({});
  const [parameterList, setParameterList] = useState([]);
  const [managerList, setManagerList] = useState([]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "index") {
      setIndex(value);
      setParameterList(Object.keys(sortedDefinations[value]));
      setTopic(null);
    } else if (name === "topic") {
      setTopic(value);
      setParameterList(sortedDefinations[index][value]);
    }
  };
  const sortData = (data) => {
    let sortedData = {};
    let managerList = [];
    for (let i = 0; i < data.length; i++) {
      let parameter = data[i].parameter;
      let manager = data[i].manager;
      let score = data[i].score;
      if (!managerList.includes(manager)) managerList.push(manager);
      if (!sortedData.hasOwnProperty(parameter)) {
        sortedData[parameter] = {};
      }
      sortedData[parameter][manager] = score;
    }
    setSortedData(sortedData);
    setManagerList(managerList);
  };
  const sortDefination = (definations) => {
    let sortedDefinations = {};
    for (let i = 0; i < definations.length; i++) {
      let index = definations[i].index;
      let topic = definations[i].topic;
      let subTopic = definations[i].subTopic;
      if (sortedDefinations.hasOwnProperty(index)) {
        if (!sortedDefinations[index].hasOwnProperty(topic)) {
          sortedDefinations[index][topic] = [];
        }
      } else {
        sortedDefinations[index] = {};
        sortedDefinations[index][topic] = [];
      }
      sortedDefinations[index][topic].push(subTopic);
    }
    setParameterList(Object.keys(sortedDefinations));
    setSortedDefinations(sortedDefinations);
  };
  const calculateAggregate = (parameter) => {
    const sumValues = Object.values(sortedData[parameter]).reduce(
      (a, b) => parseFloat(a) + parseFloat(b)
    );
    return sumValues / managerList.length;
  };
  useEffect(() => {
    async function getManagerData() {
      const response = await getData();
      const result = await response.json();
      if (result) {
        let definations = result.definitions;
        let data = result.data;
        sortData(data);
        sortDefination(definations);
      }
    }
    getManagerData();
  }, []);

  return (
    <div className="mainpage">
      <div className="select--container">
        <select onChange={handleChange} name="index" value={index}>
          <option hidden="true">Select an Index</option>
          {Object.keys(sortedDefinations).map((value, index) => (
            <option value={value} key={index}>
              {value}
            </option>
          ))}
        </select>
        <select
          className={index ? "select" : "select--disabled"}
          onChange={handleChange}
          name="topic"
          value={topic}
        >
          <option hidden="true" selected={!topic}>
            {!index ? "None" : "Select a Topic"}
          </option>

          {index &&
            Object.keys(sortedDefinations[index]).map((value, index) => (
              <option value={value} key={index}>
                {value}
              </option>
            ))}
        </select>
      </div>
      {parameterList.length ? (
        <table>
          <tr>
            <th className="item aggregate parameter--row">
              <i class="fa fa-user"></i>&nbsp;Managers
            </th>
            {parameterList.map((value, index) => (
              <th className="item parameter--row" key={index}>
                {value}
              </th>
            ))}
          </tr>

          {managerList.map((manager, index) => (
            <tr>
              <th className="item manager" key={index}>
                {manager}
              </th>
              {parameterList.map((parameter, index) => (
                <td
                  className={
                    "item item-color-" +
                    parseInt(sortedData[parameter][manager])
                  }
                  key={index}
                >
                  {sortedData[parameter][manager]}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th className="item aggregate">Aggregate</th>
            {parameterList.map((value, index) => (
              <td
                className={
                  "item aggregate item-color-" +
                  parseInt(calculateAggregate(value))
                }
                key={index}
              >
                {calculateAggregate(value)}
              </td>
            ))}
          </tr>
        </table>
      ) : (
        ""
      )}
    </div>
  );
};
export default MainPage;

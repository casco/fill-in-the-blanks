import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [template, setTemplate] = useState({});
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/template')
      .then(response => {
        setTemplate(response.data);
        setResponses([createResponse(response.data.choices)]);
      })
      .catch(error => {
        console.log(error);
      });
  }, []); // empty dependency array

  const createResponse = (choices) => {
    const response = {};
    for (const [variable, options] of Object.entries(choices)) {
      response[variable] = options[0];
    }
    return response;
  };

  const addResponse = () => {
    setResponses([...responses, createResponse(template.choices)]);
  };

  const removeResponse = (index) => {
    setResponses(responses.filter((_, i) => i !== index));
  };

  const handleSelect = (index, variable, value) => {
    setResponses(responses.map((response, i) => {
      if (i === index) {
        return { ...response, [variable]: value };
      }
      return response;
    }));
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8080/response', responses)
      .then(response => {
        console.log(response);
        setResponses([]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  function Sentence({ sentence, choices, index }) {
    if (!sentence) return null;

    const dropdowns = Object.entries(choices).map(([variable, options]) => {
      const dropdownOptions = options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ));

      return (
        <select
          key={variable}
          value={responses[index][variable]}
          onChange={(e) => handleSelect(index, variable, e.target.value)}
        >
          {dropdownOptions}
        </select>
      );
    });

    const sentenceParts = sentence.split(/\$(\w+)/g);
    const renderedSentence = sentenceParts.map((part, index) => {
      if (index % 2 === 1) {
        const variable = part;
        const dropdown = dropdowns.find((d) => d.key === variable);
        return dropdown || part;
      }
      return part;
    });

    return (
      <div>
        <button onClick={() => removeResponse(index)}>Remove</button>
        {renderedSentence}
      </div>
    );
  }

  return (
    <div className="App">
      {responses.map((response, index) => (
        <Sentence
          key={index}
          sentence={template.sentence}
          choices={template.choices}
          index={index}
        />
      ))}
      <button onClick={addResponse}>Add Response</button>
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;

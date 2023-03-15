import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [template, setTemplate] = useState({});
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/template')
      .then(response => {
        setTemplate(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []); // empty dependency array

  const addResponse = () => {
    setResponses(responses => [...responses, template.choices]);
  };

  const removeResponse = (index) => {
    setResponses(responses => responses.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8080/response', responses)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  function Sentence({ sentence, choices, onChange }) {
    if (!sentence) return null;
  
    const dropdowns = Object.entries(choices).map(([variable, options]) => {
      const handleChange = (event) => {
        const selectedOption = event.target.value;
        onChange(variable, selectedOption);
      };
  
      const dropdownOptions = options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
  
      return (
        <select key={variable} onChange={handleChange}>
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
  
    return <>{renderedSentence}</>;
  }
  
  return (
    <div className="App">
      <button onClick={addResponse}>Add Response</button>
      {responses.map((response, index) => (
        <div key={index}>
          <Sentence sentence={template.sentence} choices={response} onChange={(variable, option) => {
            setResponses(responses => {
              const newResponses = [...responses];
              newResponses[index][variable] = [option];
              return newResponses;
            });
          }} />
          <button onClick={() => removeResponse(index)}>Remove Response</button>
        </div>
      ))}
      {responses.length > 0 && <button onClick={handleSubmit}>Submit</button>}
    </div>
  );
}

export default App;

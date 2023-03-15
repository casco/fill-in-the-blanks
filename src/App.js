import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [template, setTemplate] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8080/template')
      .then(response => {
        setTemplate(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []); // empty dependency array

  const handleOptionChange = (variable, value) => {
    setSelectedOptions({ ...selectedOptions, [variable]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8080/response', selectedOptions)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  function Sentence({ sentence, choices }) {
    if (!sentence) return null;
  
    const dropdowns = Object.entries(choices).map(([variable, options]) => {
      const dropdownOptions = options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
  
      return (
        <select key={variable} onChange={(event) => handleOptionChange(variable, event.target.value)}>
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
      <form onSubmit={handleFormSubmit}>
        <Sentence sentence={template.sentence} choices={template.choices} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );

}

export default App;

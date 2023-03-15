import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [template, setTemplate] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8080/template')
      .then(response => {
        setTemplate(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []); // empty dependency array


  function Sentence({ sentence, choices }) {
    if (!sentence) return null;
  
    const dropdowns = Object.entries(choices).map(([variable, options]) => {
      const dropdownOptions = options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
  
      return (
        <select key={variable}>
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
      <Sentence sentence={template.sentence} choices={template.choices} />
    </div>
  );

}

export default App;

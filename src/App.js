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

  // Replace variables in the template sentence with dropdown menus
  const replaceVariables = () => {
    const pattern = /\$(\w+)/g;
    let newSentence = template.sentence;
    let match;

    while ((match = pattern.exec(template.sentence)) !== null) {
      const [variable, name] = match;
      const options = template.choices[name];
      const dropdown = (
        <select key={variable}>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      newSentence = newSentence.replace(variable, dropdown);
    }
    return newSentence;
  };

  return (
    <div>
      <h1>Fill in the blanks</h1>
      {template && (
        <p>{replaceVariables()}</p>
      )}
      {/* Add your submit button here */}
    </div>
  );
}

export default App;
